$(function () {

    $('#toggle').click(function () {
        io.emit('toggle');
        console.log("toggle");
    });

    io.on('waterTemp', function (waterTemp) { 
        $("#waterTemp").html("Temperature: " + waterTemp);
    })


});