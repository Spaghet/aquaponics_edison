$(function () {
    var cache = [];
    var graph = function (data, id, name) {
        $(id).highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: name
            },
            
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: name
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
 /*                       stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
  */
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            
            series: [{
                    type: 'area',
                    name: name,
                    data: data
                }]
        });
    };

    $('#toggle').click(function () {
        io.emit('toggle');
        console.log("toggle");
    });

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {
        console.log(data[0]);
    });
    


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