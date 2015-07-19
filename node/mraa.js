var m = require('mraa'); //require mraa
console.log(m.getVersion());

var led = new m.Gpio(13); //get pin 13
led.dir(m.DIR_OUT); //set direction to out
var ledState = true; //led state bool

//blinks pin13 periodically 
var blink = function () {
    
    led.write(ledState ? 1 : 0);
    ledState = !ledState;
    setTimeout(blink, 100);

};

//toggles pin13 H/L state
var toggle = function () {
    
    led.write(ledState ? 1 : 0);
    ledState = !ledState;

};

//export functions
module.exports.blink = blink;
module.exports.toggle = toggle;