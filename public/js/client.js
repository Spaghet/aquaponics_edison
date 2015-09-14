$(function () {
    var cache = [];
 


    io.on('waterTemp', function (waterTemp) {
        $('.waterTemp').html('Water Temperature: ' + waterTemp.toFixed(1) + 'C');

        var d = new Date();
        var ar = [];
        ar[0] = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
        ar[1] = waterTemp;
        
        cache[cache.length] = ar;

        graph(cache, '#WaterTempGraph', 'kionYEAH');
    });

    io.on('tempHum', function (tempHum) {
        $('.temp').html('Air Temperature: ' + tempHum[0] + 'C');
        $('.hum').html('Humidity: ' + tempHum[1] + '\%');
    });
    


});

function setting() {
    var frm = document.forms["set"];
    var led = frm.elements["LED"].selectedIndex;
    var feed = frm.elements["feed"].selectedIndex;
    var pump = frm.elements["pump"].selectedIndex;
    led = frm.elements["LED"].options[led].value;
    feed = frm.elements["feed"].options[feed].value;
    pump = frm.elements["pump"].options[pump].value;
    io.emit('control',   {LED: led, feed: feed, pump: pump});
}
