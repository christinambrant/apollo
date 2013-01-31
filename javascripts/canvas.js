var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function loadCircle(startAngle,endAngle,radius,color) {
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.strokeStyle = color;
    var cx = 66;
    var cy = 66;
    var anticlockwise = false;
    ctx.arc(cx,cy,radius,startAngle,endAngle,anticlockwise);
    ctx.stroke();
}

var intervalId;
var timerDelay = 100;
var rotateAngle = 0;
var startAngle = 3*Math.PI/2;
var endAngle = -Math.PI/4;
var radius = 55;
var colors = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#00FFFF', '#0000FF', '#8B00FF', '#FF00FF'];
var i = 0

function redrawAll() {
    ctx.clearRect(0,0,132,132);
    loadCircle(startAngle,endAngle,radius,colors[i]);
}

function onTimer() {
    if(i === 7) {
        i = 0;
    }
    else {
        i++;
    }
    startAngle += Math.PI/4;
    endAngle += Math.PI/4;
    redrawAll();
}

function run() {
    redrawAll();
    intervalId = setInterval(onTimer,timerDelay);
}

run();
