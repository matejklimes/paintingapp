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

let dragging = false;
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

function get_mouse_position(x, y) {
    let canvasSizeData = canvas.getBoundingClientRect();
    return { x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width), y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height) };
}

function save_canvas_image() {
    save_image_data = context.getImageData(0,0, canvas.width, canvas.height);
}

function redraw_canvas_image() {
    context.putImageData(save_image_data,0,0);
}

function update_rubberband_size_data(loc) {
    shape_bounding_box.width = Math.abs(loc.x - mouse_down.x);
    shape_bounding_box.height = Math.abs(loc.y - mouse_down.y);

    if (loc.x > mouse_down.x) {
        shape_bounding_box.left = mouse_down.x;
    } else {
        shape_bounding_box.left = loc.x;
    }

    if (loc.y > mouse_down.y) {
        shape_bounding_box.top = mouse_down.y;
    } else {
        shape_bounding_box.top = loc.y;
    }
}

function get_angle(mouselocX, mouselocY) {
    let adjecent = mouse_down.x - mouselocX;
    let opposite = mouse_down.y - mouselocY;

    return radians_to_degrees(Math.atan2(opposite, adjecent));
}

function radians_to_degrees(rad) {
    return (rad * (180 / Math.PI)).toFixed(2);
}

function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

function react_to_mouse_down(e) {
    canvas.style.cursor = "crosshair";
    loc = get_mouse_position(e.clientX, e.clientY);
    save_canvas_image();
    mouse_down.x = loc.x;
    mouse_down.y = loc.y;
    dragging = true;
}

function react_to_mouse_move(e) {
    canvas.style.cursor = "crosshair";
    loc = get_mouse_position(e.clientX, e.clientY);
}

function react_to_mouse_move(e) {
    canvas.style.cursor = "default";
    loc = get_mouse_position(e.clientX, e.clientY);
    redraw_canvas_image();
    update_rubberband_on_move(loc);
    dragging = false;
    usingBrush = false;
}

function save_image() {
    var img_file = document.getElementById("save");
    img_file.setAttribute("download", "paint.jpg");
    img_file.setAttribute("href", canvas.toDataURL());
}

function open_image() {
    let img = new Image();
    img.onload = function() {
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(img,0,0);
    }
    img.src = "paint.png";
}