var m = require('mraa'); //require mraa
console.log(m.getVersion());

var sunrise = new Date();
var sunset = new Date();
//get pin 13
var waterTempPin = new m.Aio(0); 
var feeder = new m.Gpio(12);
var ledPin = new m.Gpio(13); 
var sw1 = new m.Gpio(6);
var wet = new m.Gpio(11);
var pumpPin = new m.Gpio(7);

//set direction
sw1.dir(m.DIR_IN);
ledPin.dir(m.DIR_OUT); 
feeder.dir(m.DIR_OUT);
wet.dir(m.DIR_IN);
pumpPin.dir(m.DIR_OUT);

var analogValueFloat = waterTempPin.readFloat();
var ledState = true; //led state bool


var led = {
    on: function () { ledPin.write(0); },
    off: function () { ledPin.write(1); },
    equinox: function () {
        setInterval(function () { led.write(ledState ? 1:0); ledState = !ledState; }, 43200000);
    },
    summer: summer,
    winter: winter,
};



//feed the fish yo
function feed()
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

//return water temperature
function waterTemp() {
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
function tempTest(){
    var sensor = new Am2321(6, 0x5C, 8);
    sensor.wakeupSensor();
    sensor.sendCommand();
    sensor.receiveData();
    if (sensor.checkCrc == true) {
        if (sensor.checkRecieveData() == true) {
            var humidity = sensor.getHumidity();
            var temperature = sensor.getTemperature();
        }
    }
    return [temperature, humidity];
}

var continueLoop = true;
//timerLed
function timerLed(sunrise, sunset) {
    var currentDate = new Date();
    var isDay = true;
    
    if (isDay && currentDate.getHours() === sunset.getHours() && currentDate.getMinutes() === sunset.getMinutes()) { 
        ledPin.write(0);
    }
    if (!isDay && currentDate.getHours() === sunrise.getHours() && currentDate.getMinutes() === sunrise.getMinutes()) {
        ledPin.write(1);
    }
    
    if(continueLoop){ setTimeout(timerLed, 10000, sunrise, sunset);}

}

function summer() {
    continueLoop = false;
    setTimeout(null, 10010);
    continueLoop = true;
    sunrise.setHours(4, 26);
    sunset.setHours(19, 1);
    timerLed(sunrise, sunset);
}

function winter() {
    continueLoop = false;
    setTimeout(null, 10010);
    continueLoop = true;
    sunrise.setHours(6,47);
    sunset.setHours(16,32);
    timerLed(sunrise, sunset);
}
var isPump = true;
function pump(){
    pumpPin.write(isPump ? 1:0);
    isPump = !isPump;
}
//export functions
module.exports.feed = feed;
module.exports.led = led;
module.exports.waterTemp = waterTemp;
module.exports.tempTest = tempTest;
module.exports.pump = pump;