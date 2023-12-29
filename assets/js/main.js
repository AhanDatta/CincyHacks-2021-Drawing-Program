var canvas, ctx, flag = false, prevX = 0, currX = 0, prevY = 0, currY = 0, dot_flag = false;//defines canvas, context and some coordinate variables
var color = "black";//var for color
var size = 2;//var for size
var sizeopt = document.getElementById('sizeopt');//reads size input from html
var coloropt = document.getElementById('colorpicker');//reads color input from html
var userString = document.getElementById('userString');//get what the user wants to practice
var tabTwo = document.getElementById('tabTwo');
var map = document.getElementById('worldMap');
var canvasStates = [];
var state = -1;
var speed = 0;

function init() {//runs on startup, creates canvas and context objects
    canvas = document.getElementById('drawCanvas');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    map.style.visibility = "hidden";

    //event listeners for buttons
    tabTwo.addEventListener("click", function (e) {
        ctx.clearRect(0, 0, w, h);
        userString.style.visibility = "hidden";
        document.getElementById('userLabel').style.visibility = "hidden";
        addImage();
    }, false);
    tabOne.addEventListener("click", function (e) {
        ctx.clearRect(0, 0, w, h);
        userString.style.visibility = "visible";
        document.getElementById('userLabel').style.visibility = "visible";
        map.style.visibility = "hidden";
    })
    userString.addEventListener("input", function (e) {
        ctx.clearRect(0, 0, w, h);
        ctx.font = "200px Arial";
        ctx.lineWidth = 1;
        ctx.strokeText(userString.value, (canvas.width / 2) - (ctx.measureText(userString.value).width/2), canvas.height/2);
    }, false)
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e);
    }, false);
    coloropt.addEventListener("input", function (e) {
        color = coloropt.value;
    }, false);
    sizeopt.addEventListener("input", function (e) {
        size = sizeopt.value;
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
        state++;
        if (state < canvasStates.length) {
            canvasStates.length = state;
        }
        canvasStates.push(document.getElementById('drawCanvas').toDataURL());
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}


//does the drawing
function draw() {
    if (speed < 50) {
        ctx.beginPath();
        ctx.arc(currX, currY, size / 10, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    else {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

//undoes work to a certain canvas state
function undo() {
    if (state >= 0) {
        ctx.clearRect(0, 0, w, h);
        state--;
        var canvasPic = new Image();
        canvasPic.src = canvasStates[state];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
    }
}

//redoes work to a certain canvas state
function redo(){
    if (state < canvasStates.length-1) {
        state++;
        var canvasPic = new Image();
        canvasPic.src = canvasStates[state];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
    }
}

//called with the "big mistakes" button, clears canvas
function erase() {
    var m = confirm("Want to clear");
    state++;
    if (state < canvasStates.length) {
        canvasStates.length = state;
    }
    canvasStates.push(document.getElementById('drawCanvas').toDataURL());
    if (m) {
        ctx.clearRect(0, 0, w, h);
    }
}

//logic bits for drawing
function findxy(res, e) {
    //if mouse down event
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
    
        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(currX, currY, 1, 1);
            ctx.closePath();
            dot_flag = false;
        }
    }
    //if mouse up or mouse out event on canvas
    if (res == 'up' || res == "out") {
        flag = false;
    }
    //if mouse moves, draw
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            speed = Math.abs(currX - prevX) + Math.abs(currY - prevY);
            draw();
        }
    }
}

function addImage() {
    map.style.visibility = "visible";
}