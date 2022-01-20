const canvas = document.getElementById("canvas");
canvas.width = 1300;
canvas.height = 615;

let context = canvas.getContext("2d");
start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let brush = document.getElementById("brush");
let eraser = document.getElementById("eraser");

let tool;
let draw_color = "black";
let draw_width = "3";
let is_drawing = false;

let save_image_data;

let restore_array = [];
let index = -1;


// pozoruje klikání myši a přiřazuje funkci, která se má spustit
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop1, false);
canvas.addEventListener("mouseup", stop1, false);
canvas.addEventListener("mouseout", stop1, false);

// funkce pro změnění barvy v základním výběru
function change_color(element) {
    draw_color = element.style.background;
}

// měnění nástrojů
brush.addEventListener("click", function brush() {
    tool == 1;
    draw_color = "black";
})

eraser.addEventListener("click", function eraser() {
    tool == 2;
    draw_color = "white";
})

// funkce pro vytvoření čistého plátna
function clear_canvas() {
    context.fillStyle = start_background_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index = -1;
}

// funkce pro pohyb zpět
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

// funkce, která při kliknutí myší nastaví is_drawing na true a vytvoří novou "cestu" (beginPath())
function start(event) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);

    event.preventDefault();
    
}

// hlavní funkce, zaručující vlastní kreslení pokud is_drawing = true
function draw(event) {
    if (is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop)
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();

        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }

    event.preventDefault();
}

// spustí se při puštění myši tlačítka, ukončí "cestu"
function stop1(event) {
    if (is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }

    event.preventDefault();

    // zabraňuje zapsání tahu do pole, když pouze vyjedeme z canvasu
    if (event.type != "mouseout") {
        restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
    console.log(restore_array);
}

// funkce pro ukládání obrázku
function save_image() {
    var img_file = document.getElementById("save");
    img_file.setAttribute("download", "paint.jpg");
    img_file.setAttribute("href", canvas.toDataURL());
}


