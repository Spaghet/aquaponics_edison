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
//set direction
sw1.dir(m.DIR_IN);
led.dir(m.DIR_OUT); 
feeder.dir(m.DIR_OUT);

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
        setTimeout(function () { feeder.write(0); }, 500);
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


//export functions
module.exports.toggle = toggle;
module.exports.feed = feed;
module.exports.timerLed = timerLed;
module.exports.waterTemp = waterTemp;