var m = require('mraa'); //require mraa
console.log(m.getVersion());

var sunrise = new Date();
var sunset = new Date();
//get pin 13
var waterTempPin = new m.Aio(0); 
var feeder = new m.Gpio(12);
var ledPin = new m.Gpio(13); 
var sw1 = new m.Gpio(6);
var pumpPin = new m.Gpio(7);

//set direction
sw1.dir(m.DIR_IN);
ledPin.dir(m.DIR_OUT); 
feeder.dir(m.DIR_OUT);
pumpPin.dir(m.DIR_OUT);

var analogValueFloat = waterTempPin.readFloat();
var ledState = true; //led state bool


var led = {
    on: function () {
        ledPin.write(0);
    },
    off: function () {
        ledPin.write(1);
    },
    equinox: equinox,
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

var sleep = require('sleep');

function crc16(buf, length) {
    var crc = 0xFFFF;
    for (var j = 0; j < length; j++) {
        crc ^= buf[j];
        for (var i = 0; i < 8; i++) {
            if (crc & 0x01) {
                crc >>= 1;
                crc ^= 0xA001;
            }
            else {
                crc >>= 1;
            }
        }
    }
    return crc;
}

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
        sleep.usleep(1500);
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

//var sensor = new Am2321(6, 0x5C, 8);
var temperature, humidity;
function tempTest(){
    sensor.wakeupSensor();
    sensor.sendCommand();
    sensor.receiveData();
        if (sensor.checkRecieveData() == true) {
             humidity = sensor.getHumidity();
             temperature = sensor.getTemperature();
        }
        if (temperature > -100 && temperature < 300) {
            return [temperature, humidity];
        }
}


//Given the sunset/sunrise time, the led should turn on/off at that time. The LED relay is Normally Open, so 0 is on, 1 is off. 
function timerLed(sr, ss) {
    var sunrise = sr;
    var sunset = ss;
    var currentDate = new Date();
    var returnFunc = function (stop) {
        if (stop) {
            clearTimeout(led);
        }
        currentDate = new Date();
        if ((currentDate.getHours() >= sunset.getHours() && currentDate.getMinutes() >= sunset.getMinutes()) || (currentDate.getHours() < sunrise.getHours() && currentDate.getMinutes() < sunrise.getMinutes() )) {
            ledPin.write(1);
        }
        if ((currentDate.getHours() >= sunrise.getHours() && currentDate.getMinutes() >= sunrise.getMinutes()) && (currentDate.getHours() < sunset.getHours() && currentDate.getMinutes() < sunset.getMinutes())) {
            ledPin.write(0);
        }
        var led = setTimeout(returnFunc, 30000, false);
    };
    return returnFunc;

}

function summer() {
    sunrise.setHours(4);
    sunrise.setMinutes(26);
    sunset.setHours(19);
    sunset.setMinutes(1);
    var run = timerLed(sunrise, sunset);
    run(true);
}

function winter() {
    sunrise.setHours(6);
    sunrise.setMinutes(47);
    sunset.setHours(16);
    sunset.setMinutes(32);
    var run = timerLed(sunrise, sunset);
    run(true);
}

function equinox() {
    sunrise.setHours(5);
    sunrise.setMinutes(35);
    sunset.setHours(17);
    sunset.setMinutes(45);
    var run = timerLed(sunrise, sunset);
    run(true);
}

//felt like writing a closure to implement  a timer that turns the pump on for 5 minutes and leaves pump off for t minutes.
//the pump is pretty fast at filling the growbed so it should only take 5 minutes to fill up. 
function pump() {
    var time = 35;
    var rtFunc = function (t, stop) {
        if (stop) {
            clearTimeout(off);
            clearTimeout(on);
        }
        time = t;
        pumpPin.write(1);
        var off = setTimeout(pumpPin.write, 300000, 0);
        var on = setTimeout(rtFunc, time * 60000, time, false);
    };
    return rtFunc;
}
//export functions
module.exports.feed = feed;
module.exports.led = led;
module.exports.waterTemp = waterTemp;
module.exports.tempTest = tempTest;
module.exports.pump = pump();