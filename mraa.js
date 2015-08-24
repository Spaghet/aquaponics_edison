var m = require('mraa'); //require mraa
console.log(m.getVersion());

var hour = 8; var hour2 = 17;
var minute = 0; var minute2 = 0;
var second = 0; var second2 = 0;

//get pin 13
var waterTempPin = new m.Aio(0); 
var feeder = new m.Gpio(12);
var led = new m.Gpio(13); 
var sw1 = new m.Gpio(6);
var wet = new m.Gpio(11);

//set direction
sw1.dir(m.DIR_IN);
led.dir(m.DIR_OUT); 
feeder.dir(m.DIR_OUT);
wet.dir(m.DIR_IN);

var analogValueFloat = waterTempPin.readFloat();
var ledState = true; //led state bool

//toggles pin13 H/L state
var toggle = function () {
    
    led.write(ledState ? 1 : 0);
    ledState = !ledState;

};

//feed the fish yo
var feed = function ()
{
    var sw = sw1.read();  
    if (sw) {
        feeder.write(1);
        setTimeout(function () { feeder.write(0); }, 1000);
    } else {
        feeder.write(1);
        setTimeout(feed, 50);
    }
}

//on/off of the led based on time
var timerLed = function () {
    var currentDate = new Date();
    if (currentDate.getSeconds() == second && currentDate.getMinutes() == minute && currentDate.getHours() == hour ) {
        mraa.toggle();
        console.log("Time to toggle");
        hour = hour2;
        minute = minute2;
        second = second2;
    }
    setTimeout(timerLed, 1000, currentDate);
}

//return water temperature
var waterTemp = function () {
    analogValueFloat = waterTempPin.readFloat(); //read the pin value as a float
    var v = (analogValueFloat * 5); //voltage
    var r = (10 * v) / (5 - v); //resistance
    var temp = (-21.19 * Math.log(r) + 74.08);
    
    return temp;
};

//read tempreture&humid
function Am2321(bus, address, bufsize) {
    this.x = new m.I2c(bus);
    this.x.address(address);
    this.buff = new Buffer(bufsize);

    this.wakeupSensor = function () {
        this.x.writeReg(0, 0);
    }

    this.sendCommand = function () {
        get_command = new Buffer([0x03, 0x00, 0x04]);
        this.x.write(get_command);
    }

    this.receiveData = function () {
        this.buff = this.x.read(8);
    }

    this.checkCrc = function () {
        var crc = this.buff[6] + this.buff[7] * 256;
        return crc == crc16(this.buff, 6);
    }

    this.checkRecieveData = function () {
        return (this.buff[0] == 0x03) && (this.buff[1] == 0x04);
    }

    this.getHumidity = function () {
        var high = this.buff[2];
        var low = this.buff[3];
        return (high * 256 + low) / 10;
    }

    this.getTemperature = function () {
        var temperature = 0;
        var high = this.buff[4];
        var low = this.buff[5];

        if (high & 0x80) {
            temperature = -1 * (high & 0x7F) * 256 + low;
        }
        else {
            temperature = high * 256 + low;
        }
        return temperature / 10;
    }
}
var tempTest = function (){
    var sensor = new Am2321(6, 0x5C, 8);
    sensor.wakeupSensor();
    sensor.sendCommand();
    sensor.receiveData();
    if (sensor.checkRecieveData() == true) {
        var humidity = sensor.getHumidity();
        var temperature = sensor.getTemperature();
    }
    return [temperature, humidity];
}


//export functions
module.exports.toggle = toggle;
module.exports.feed = feed;
module.exports.timerLed = timerLed;
module.exports.waterTemp = waterTemp;
module.exports.tempTest = tempTest;