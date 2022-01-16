const canvas = document.getElementById("canvas");
canvas.width = 1100;
canvas.height = 400;

let context = canvas.getContext("2d");
start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

//let draw_color = "black";
let draw_width = "3";
let is_drawing = false;

let save_image_data;
let stroke_color = "black";
let fill_color = "black"
let polygon_sides = 6;
let current_tool = "brush";

let restore_array = [];
let index = -1;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop1, false);
canvas.addEventListener("mouseup", stop1, false);
canvas.addEventListener("mouseout", stop1, false);

function change_color(element) {
    stroke_color = element.style.background;
}

function clear_canvas() {
    context.fillStyle = start_background_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index = -1;
}

function undo_last() {
    if (index <= 0) {
        clear_canvas();
    }
    else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}

function change_tool(toolClicked) {
    document.getElementById("open").className = "";
    document.getElementById("save").className = "";
    document.getElementById("brush").className = "";
    document.getElementById("eraser").className = "";
    document.getElementById("line").className = "";
    document.getElementById("circle").className = "";
    document.getElementById("rectangle").className = "";
    document.getElementById("triangle").className = "";
    document.getElementById("polygon").className = "";

    document.getElementById(toolClicked).className = "selected";
    current_tool = toolClicked;
}

function start(event) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    
    event.preventDefault();
}

function draw(event) {
    if (is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop)
        context.strokeStyle = stroke_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke(); 

        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
    
    event.preventDefault();
}

function stop1(event) {
    if (is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    
    event.preventDefault();

    if (event.type != "mouseout") {
        restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
    console.log(restore_array);
}

class ShapeBoundingBox {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

class MouseDownPos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class PolygonPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let shape_bounding_box = new ShapeBoundingBox(0, 0, 0, 0);
let mouse_down = new MouseDownPos(0, 0);
let loc = new Location(0, 0);