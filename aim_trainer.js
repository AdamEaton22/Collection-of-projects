// link to source code: https://editor.p5js.org/Adsa2/sketches/lrpPC4nIt


let list = [];
let clicked = 0;
let position = [];
let button = [];
let number_of_targets = 1;
let startTime;
let start = false;
let show = 0;
let justStopped = false;
let size;
let multiplier = 1;
let total = 1;
let percentage = 100;
let score = 0;
let temp;
let time = 0;
let last;
let squares;
let addTotal = false;
let correctHeld = false;
let mode = 1;
let box_size;
function setup() {
  noStroke()
  squares = squaresReset();
  size = windowHeight;
  box_size = size / 8;
  for (let i = 0; i < 7; i++) {
    position[i] = createVector(
      windowHeight + box_size * 0.4,
      (i + 1) * box_size * 0.4
    );
  }
  button[0] = [
    windowHeight + box_size * 0.55,
    box_size * 5.15,
    box_size * 0.7,
    false,
  ];
  button[1] = [
    windowHeight + box_size * 1.75,
    box_size * 5.15,
    box_size * 0.7,
    false,
  ];
  button[2] = [windowHeight + box_size, box_size * 3.5, box_size, false];
  button[3] = [windowHeight + box_size, box_size * 6.5, box_size, false];
  //createCanvas(size, size);
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  textSize(12 * multiplier);
  if (millis() - startTime > 30000) {
    start = false;
    list = [];
    squares = squaresReset();
    last = undefined;
    correctHeld = false;
  }
  if (start) {
    list = rando2(list, number_of_targets, squares);
  }
  buttonPressed();

  for (let i = 0; i < squares.length; i++) {
    //fill(77, 38, 0)
    fill(0, 0, 0);
    if ((squares[i].x + squares[i].y) % 2 == 0) {
      //fill(255, 255, 150)
      fill(128, 0, 0);
    }
    square(squares[i].x * box_size, squares[i].y * box_size, box_size);
  }
  //fill(255,0,0)
  fill(0, 0, 255);
  for (let i = 0; i < list.length; i++) {
    square(list[i].x * box_size, list[i].y * box_size, box_size); // fills in targets
  }

  if (last != undefined && !correctHeld) {
    fill(255, 255, 0);
    if (mode == 1 || start == false) {
      fill(0, 0, 0);
      if ((last.x + last.y) % 2 == 0) {
        fill(128, 0, 0);
      }
    }
    square(last.x * box_size, last.y * box_size, box_size); // this fills in the square left behind
  } else if (correctHeld && last != undefined) {
    fill(0, 0, 0);
    if ((last.x + last.y) % 2 == 0) {
      //fill(255, 255, 150)
      fill(128, 0, 0);
    }
    square(last.x * box_size, last.y * box_size, box_size);
  }
  if (correctHeld) {
    fill(255, 255, 0);
    square(mouseX - box_size / 4, mouseY - box_size / 4, box_size / 2);
  }

  fill(255, 255, 150);
  //fill(128,0,0)
  //fill(255,0,0)
  if (start) {
    temp = total;
    if (justStopped) {
      clicked = 0;
      justStopped = false;
      total = 0;
      temp = 1;
    } else if (total == 0) {
      temp = 1;
      time = 0;
    }
    show = round((clicked * 1000) / (millis() - startTime), 2);
    percentage = round((clicked * 100) / temp, 1);
    score = round((clicked * percentage) / 100, 1);
    time = round(30 - (millis() - startTime) / 1000, 1);
  }
  textSize(0.25 * box_size);

  text("correct : " + str(clicked), position[0].x, position[0].y);
  text("correct per second : " + str(show), position[1].x, position[1].y);
  text(
    "number of targets : " + str(number_of_targets),
    position[2].x,
    position[2].y
  );
  text("accuracy : " + str(percentage), position[3].x, position[3].y);
  text("score : " + str(score), position[4].x, position[4].y);
  text("time : " + str(time), position[5].x, position[5].y);
  text("mode : " + str(mode), position[6].x, position[6].y);
  square(button[0][0], button[0][1], button[0][2]);
  square(button[1][0], button[1][1], button[1][2]);
  square(button[2][0], button[2][1], button[2][2]);
  square(button[3][0], button[3][1], button[3][2]);
  fill(0);
  textStyle(BOLD);
  text("start/", button[2][0] + box_size * 0.2, button[2][1] + box_size * 0.4);
  text("stop", button[2][0] + box_size * 0.2, button[2][1] + box_size * 0.7);
  text("switch", button[3][0] + box_size * 0.13, button[3][1] + box_size * 0.4);
  text("mode", button[3][0] + box_size * 0.18, button[3][1] + box_size * 0.7);
  textSize(box_size * 0.6);
  textStyle(NORMAL);
  text("+", button[0][0] + box_size * 0.17, button[0][1] + box_size * 0.56);
  text("-", button[1][0] + box_size * 0.25, button[1][1] + box_size * 0.51);
}

function rando2(list, n, squares) {
  let index;
  for (let i = list.length; i < n; i++) {
    index = floor(random(squares.length));
    list[i] = squares[index];
    squares.splice(index, 1);
  }
  return list;
}

function mousePressed() {
  if (mode == 1) {
    mode1();
  } else {
    mode2();
  }

  for (let i = 0; i < 4; i++) {
    if (mouseX >= button[i][0] && mouseX < button[i][0] + button[i][2]) {
      if (mouseY >= button[i][1] && mouseY < button[i][1] + button[i][2]) {
        button[i][3] = true;
      }
    }
  }
}
function mouseReleased() {
  if (mode !=1 && start) {
    if (addTotal) {
      total += 1;
      addTotal = false;
    }
    if (correctHeld) {
      for (let i = 0; i < list.length; i++) {
        if (
          mouseX >= list[i].x * box_size &&
          mouseX < (list[i].x + 1) * box_size
        ) {
          if (
            mouseY >= list[i].y * box_size &&
            mouseY < (list[i].y + 1) * box_size
          ) {
            squares.push(last);
            if (mode == 2) {
              last = list[i];
            } else {
              last = rando2([], 1, squares)[0];
              squares.push(list[i]);
            }
            list.splice(i, 1);
            clicked += 1;
          }
        }
      }
    }
    correctHeld = false;
  }
}

function buttonPressed() {
  if (button[0][3] && number_of_targets<64) {
    number_of_targets += 1;
    button[0][3] = false;
    if (number_of_targets == 64 && last != undefined) {
      squares.push(last);
      last = undefined;
    }
  } else if (button[1][3]) {
    number_of_targets -= 1;
    if (number_of_targets==0){
      number_of_targets = 1
    }
    button[1][3] = false;
  } else if (button[2][3]) {
    button[2][3] = false;
    start = !start;
    justStopped = true;
    startTime = millis();
    list = [];
    squares = squaresReset();
    if (number_of_targets < 64){
      last = rando2([], 1, squares)[0];
    }
  } else if (button[3][3]) {
    button[3][3] = false;
    mode = mode + 1;
    if (mode > 3) {
      mode = 1;
    }
  }
}
function squaresReset() {
  squares = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      squares[i * 8 + j] = createVector(i, j);
    }
  }
  return squares;
}
function mode2() {
  if (start) {
    if (mouseX < size && mouseY < size) {
      addTotal = true;
      if (mouseX >= last.x * box_size && mouseX < (last.x + 1) * box_size) {
        if (mouseY >= last.y * box_size && mouseY < (last.y + 1) * box_size) {
          correctHeld = true;
        }
      }
    }
  }
}
function mode1() {
  if (mouseX < size && mouseY < size) {
    total += 1;
  }
  for (let i = 0; i < list.length; i++) {
    if (mouseX >= list[i].x * box_size && mouseX < (list[i].x + 1) * box_size) {
      if (
        mouseY >= list[i].y * box_size &&
        mouseY < (list[i].y + 1) * box_size
      ) {
        if (last != undefined) {
          squares.push(last);
        }
        last = list[i];
        if (number_of_targets == 64) {
          if (last != undefined) {
            squares.push(last);
            last = undefined;
          }
        }
        list.splice(i, 1);
        clicked += 1;
      }
    }
  }
}
