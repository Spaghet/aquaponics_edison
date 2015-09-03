    var tempHum = [
        [25.4, 68],
        [25.6, 68],
        [25.6, 67],
        [25.5, 67],
        [25.3, 67],
        [25.1, 70],
        [25.0, 68],
        [26.2, 69],
        [26.2, 70],
        [26.4, 72],
        [26.7, 71],
        [26.7, 71],
        [26.6, 70],
        [26.5, 69],
        [26.5, 69],
        [26.3, 69],
        [26.3, 67],
        [26.1, 67],
        [26.0, 68],
        [26.2, 69],
        [26.2, 71],
        [25.9, 69],
        [25.6, 68],
        [25.5, 67],
    ];
    
    var waterTemp = [
    25.5,
    25.6,
    25.9,
    26.2,
    26.0,
    26.1,
    26.3,
    26.3,
    26.5,
    26.5,
    26.6,
    26.7,
    26.4,
    26.2,
    26.2,
    25.0,
    25.1,
    25.3,
    25.5,
    25.6,
    25.6,
    25.4,
    25.5,
    25.3
];

setInterval(loop, 1000, tempHum, waterTemp);
var i = 0;
function loop(tempHum, waterTemp) {
    if (i > tempHum.length - 1) { 
        i = 0;
    }
    $('.waterTemp').html('Water Temperature: ' + waterTemp[i] + 'C');
    $('.temp').html('Air Temperature: ' + tempHum[i][0] + 'C');
    $('.hum').html('Humidity: ' + tempHum[i][1] + '\%');
    i++;
}

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

function graph(data, id, name) {
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
}