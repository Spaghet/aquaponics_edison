$(function () {

    $('#toggle').click(function () {
        io.emit('toggle');
        console.log("toggle");
    });

    $('#blink').click(function () {
        io.emit('blink');
        console.log("blink");
    });

});