$(function () {

    $('#toggle').click(function () {
        io.emit('toggle');
        console.log("toggle");
    });


});