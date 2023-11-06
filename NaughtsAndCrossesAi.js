// link to code in P5.js is https://editor.p5js.org/Adsa2/sketches/PzzxPIh7f

let player1 = "X";
let player2 = "O";
let playerFirst = player1;
let player = player1;
let   moves = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
let first_move = false;
let next_game = false;
let score = [0, 0];
let score_added = false;
let movetime
let testtime = 0
let gameended = 0 // milis since game ended
let seted = false // if gameended has been set yet
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // runs once each frame
  background(220);
  show();
  if (gameOver(moves) != null) { // game is over
    if (seted == false){
      gameended = millis()
      seted = true
    }else if(millis()-gameended >1000){
      next_game = true
      seted = false
      // Adds delay before start of next game
    }
    
    textAlign(CENTER);
    fill(0);
    textSize(60);
    
    
    if (gameOver(moves) == 0) {
      text("Its a Draw!", width / 2, height / 2);
    } else if (gameOver(moves) == 1) {
      text("Player 1 wins", width / 2, height / 2);
      if (!score_added) {
        score[0]++;
        score_added = true;
      }
    } else if (gameOver(moves) == -1) {
      text("Player 2 wins", width / 2, height / 2);
      if (!score_added) {
        score[1]++;
        score_added = true;
      }
    }
    // displays end of game messages
    
    
    textSize(30);
    text(str(score[0]) + "   :   " + str(score[1]), width / 2, height / 8);
    // print sidplays the current score
    
    if (next_game == true) {
      reset();
    }
  } else if (player == player2) {
    // print("4  "+str(millis()-testtime))
    // testtime = millis()
      if(frameCount>movetime+20){
        ai2(moves);
        // print("5  "+str(millis()-testtime))
        // testtime = millis()
      }
    // checks if it is the computers time to play and plays the move returned by the function ai2(moves)
    // commented code is used to test how long the recursive search takes
  }
}
function place(playerr, array, positionx, positiony) {
  // places an X or O in the correct position when a player takes their turn
  let array2 = [array[0].slice(), array[1].slice(), array[2].slice()];
  array2[positionx][positiony] = playerr;
  return array2;
}
function show() {
  // displays the current game state
  line(0, height / 3, width, height / 3);
  line(0, (2 * height) / 3, width, (2 * height) / 3);
  line(width / 3, 0, width / 3, height);
  line((2 * width) / 3, 0, (2 * width) / 3, height);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (moves[i][j] == player1) {
        line(
          (i * width) / 3,
          (j * height) / 3,
          ((i + 1) * width) / 3,
          ((j + 1) * height) / 3
        );
        line(
          (i * width) / 3,
          ((j + 1) * height) / 3,
          ((i + 1) * width) / 3,
          (j * height) / 3
        );
      } else if (moves[i][j] == player2) {
        noFill();
        ellipse(
          ((i + 0.5) * width) / 3,
          ((j + 0.5) * height) / 3,
          width / 3,
          height / 3
        );
      }
    }
  }
}
function mousePressed() {
  // checks if it is the players go and allows them to make a move based of click location
  if (player == player1 && gameOver(moves) == null) {
    let x = floor((3 * mouseX) / width);
    let y = floor((3 * mouseY) / height);
    if (moves[x][y] == "") {
      moves = place(player, moves, x, y);
      player = switch_players(player);
      first_move = false;
      movetime = frameCount
    }
  }
}
function gameOver(array) {
  // brute force check if the game is over (3 in a row)
  // this approach is sufficient for a small 3x3 grid
  // returns 1 for player 1 winning, -1 for player2 winning, 0 for draw and null for undecided
  for (let i = 0; i < 3; i++) {
    if (check(array[i][0], array[i][1], array[i][2], "X")) {
      //virtical line
      return 1;
    }
    if (check(array[i][0], array[i][1], array[i][2], "O")) {
      return -1;
    }
    if (check(array[0][i], array[1][i], array[2][i], "X")) {
      //horrizontal
      return 1;
    }
    if (check(array[0][i], array[1][i], array[2][i], "O")) {
      return -1;
    }
  }
  if (check(array[0][0], array[1][1], array[2][2], "X")) {
    return 1;
  }
  if (check(array[0][0], array[1][1], array[2][2], "O")) {
    return -1;
  }
  if (check(array[0][2], array[1][1], array[2][0], "X")) {
    return 1;
  }
  if (check(array[0][2], array[1][1], array[2][0], "O")) {
    return -1;
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (array[i][j] == "") {
        return null;
      }
    }
  }
  return 0;
}
function reset() {
  // print("2  "+str(millis()-testtime))
  // testtime = millis()
  // resets the game variables and swaps who the first player is
  moves = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  
  playerFirst = switch_players(playerFirst)

  // print("3  "+str(millis()-testtime))
  // testtime = millis()
  player = playerFirst;
  next_game = false;
  score_added = false;
  first_move = true

}
function check(a, b, c, d) {
  // checks if a, b, c are all equal to d
  let array = [a, b, c];
  for (let i = 0; i < 3; i++) {
    if (array[i] != d) {
      return false;
    }
  }
  return true;
}
function switch_players(playerp) {
  if (playerp == player1) {
    return player2;
  } else {
    return player1;
  }
}
function ai() {
  // makes a random move when called
  // this is not used in the final version, but was just to check that moves were being generated
  let x = floor(random(3));
  let y = floor(random(3));
  if (player == player2) {
    while (moves[x][y] != "") {
      x = floor(random(3));
      y = floor(random(3));
    }
    moves = place(player2,moves, x, y);
    player = player1
  }
}
function ai2(arrayy) {
  // a recursive algorithm that uses min-max to traverse the tree of possible moves and select a move that results in the best outcome
  let array = [arrayy[0].slice(), arrayy[1].slice(), arrayy[2].slice()];
  let value = [];
  let array2;
  let value2;
  let minmaxval
  if (first_move) {
    // hard coded set of moves and values that an ai plays on the first move
    value = [
      [0, 0, 0],
      [0, 0, 2],
      [0, 2, 0],
      [0, 2, 2],
      [0, 1, 1],
    ];
    first_move = false;
  } else {
    if (gameOver(array) == null) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (array[i][j] == "") {
            // makes each possible move for the given position
            array2 = place(player2, array, i, j); // places this moe in the temporary array
            minmaxval = minmax(array2, player1)
            value2 = minmaxval[0]
            // calls minmax for the given game state
            if (value.length > 0) {
              // to get a list of the best moves
              if (player == player2) {
                if (value[0][0] > value2) {
                  //if board state is better then list of best
                  value = [[value2, i, j]];
                } else if (value[0][0] == value2) {
                  value.push([value2, i, j]);
                }
              }
            } else {
              value = [[value2, i, j]];
            }
          }
        }
      }
    }
  }
  let index = floor(random(value.length));
  moves = place(player2, moves, value[index][1], value[index][2]);
  // if its the first move or multiple best moves, makes a radom move out of the list
  player = player1;
}
function minmax(arrayy, playerr) {
  // recursively calls itself and returns either the game result assuming each 
  // player plays the best move on their turn
  let array = [arrayy[0].slice(), arrayy[1].slice(), arrayy[2].slice()];
  let array2;
  let fullValue
  let value = null;
  let count = [0,0]
  if (gameOver(array) == null) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (array[i][j] == "") {
          array2 = place(playerr, array, i, j);
          fullValue = minmax(array2, switch_players(playerr))
          count[0]+=fullValue[1][0] // counting how many wins are encountered (to select route with most chance of a win if the position is drawn)
          count[1]+=fullValue[1][1] // counting how many positions are encounted (to win in as few moves as possible)
          if (value == null) {
            value = fullValue[0];
          } else if (playerr == player1) {
            value = max(value, fullValue[0]);
          } else if (playerr == player2) {
            value = min(value, fullValue[0]);
          }
          // sets value after best move is made by respective player
          if(value == -1){
            count+=1
          }
        }
      }
    }
    return [value,[count[0],count[1]]]
    // returns the value of that branch of the game tree
  }else if(gameOver(array) == -1){
      return [gameOver(array),[1,1]];
  }else{
    return [gameOver(array),[0,1]]
  }
  // cases the where game is over - bottom of the tree
}
