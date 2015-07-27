var m = require('mraa'); //require mraa
console.log(m.getVersion());

var bool = true;

var feeder = new m.Gpio(12);
var led = new m.Gpio(13); //get pin 13
var sw1 = new m.Gpio(6);
sw1.dir(m.DIR_IN);
led.dir(m.DIR_OUT); //set direction to out
feeder.dir(m.DIR_OUT);
var ledState = true; //led state bool

//toggles pin13 H/L state
var toggle = function () {
    
    led.write(ledState ? 1 : 0);
    ledState = !ledState;

};

var feed = function () {
    
    feeder.write(0);

}



var periodicActivity = function ()
{
    console.log("pAc");
    var sw = sw1.read();
    //setTimeout(periodicActivity, 100);    
    if (sw) {
        console.log("sw=1");
        feeder.write(1);
        setTimeout(feed, 500);
    } else {
        console.log("sw=0");
        feeder.write(1);
        setTimeout(periodicActivity, 50)
    }
}

//export functions
module.exports.toggle = toggle;
module.exports.feed = periodicActivity;