(function () {
    $(function () {

        io.on('waterTemp', function (waterTemp) {
            $('.waterTemp').html('Water Temperature: ' + waterTemp.toFixed(1) + ' C');
        });

        io.on('tempHum', function (tempHum) {
            $('.temp').html('Air Temperature: ' + tempHum[0] + ' C');
            $('.hum').html('Humidity: ' + tempHum[1] + ' \%');
        });
    });
    var frm = document.forms["set"];
    $("#ledButton").click(function () {
        console.log("led");
        var led = frm.elements["LED"].selectedIndex;
        led = frm.elements["LED"].options[led].value;
        io.emit("ledControl", led);
    });
    $("#feedButton").click(function () {
        var feed = frm.elements["feed"].selectedIndex;
        feed = frm.elements["feed"].options[feed].value;
        io.emit("feedControl", feed);
    });
    $("#pumpButton").click(function () {
        var pump = frm.elements["pump"].selectedIndex;
        pump = frm.elements["pump"].options[pump].value;
        io.emit("pumpControl", pump);
    });
})();