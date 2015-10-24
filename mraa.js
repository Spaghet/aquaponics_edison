var sleep = require('sleep');
var m = require('mraa'); //require mraa
console.log(m.getVersion());

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
    var analogValueFloat = waterTempPin.readFloat();
    var v = (analogValueFloat * 5); //voltage
    var r = (10 * v) / (5 - v);  //resistance

    return (-21.19 * Math.log(r) + 74.08);
};


//read tempreture&humidity
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
function tempTest(){
    var temperature, humidity;
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
function led() {
    var sunrise, sunset, currentDate, timeout;
    var sunrise, sunset;
    sunrise = { hour: 0, minute: 0 };
    sunset = { hour: 0, minute: 0 };
    var returnFunc = function (season) {
        console.log(season);
        if (timeout != null) {
            clearTimeout(timeout);
        }
        switch (season) {
            case "summer":
                sunrise = { hour: 4, minute: 26 };
                sunset = { hour: 19, minute: 1 };
                break;
            case "winter":
                sunrise = { hour: 6, minute: 47 };
                sunset = { hour: 16, minute: 32 };
                break;
            case "equinox":
                sunrise = { hour: 5, minute: 35 };
                sunset = { hour: 17, minute: 45 };
                break;
            case "on":
                ledPin.write(0);
                return;
                break;
            case "off":
                ledPin.write(1);
                return;
                break;
        }
        
        function iterator() {
            var setTime, riseTime;
            currentDate = new Date();
            currentDate = (currentDate.getHours() * 60) + currentDate.getMinutes();
            setTime = (sunset.hour * 60) + sunset.minute;
            riseTime = (sunrise.hour * 60) + sunrise.minute;
            
            var isSet = (currentDate >= setTime) || (currentDate < riseTime);
            //LED is pulldown so 1 = off 0 = on
            if (isSet) {
                ledPin.write(1);
            } else {
                ledPin.write(0);
            }
            timeout = setTimeout(iterator, 30000);
        }
        iterator();

    };

    return returnFunc;
}

//felt like writing a closure to implement  a timer that turns the pump on for 5 minutes and leaves pump off for t minutes.
//the pump is pretty fast at filling the growbed so it should only take 5 minutes to fill up.
function pump() {
    var time = 30;
    var iterator = function () {
        var date = new Date();
        if (date.getMinutes() % time == 0) {
            pumpPin.write(1);
            off = setTimeout(function () { pumpPin.write(0);}, 360000)
        }
        setTimeout(iterator, 25000);
    };
    iterator();
    return function (t) {
        time = t;
    };
}


//export functions
module.exports.feed = feed;
module.exports.led = led();
module.exports.waterTemp = waterTemp;
module.exports.tempTest = tempTest;
module.exports.pump = pump();
