/*
 * A simon game, https://en.wikipedia.org/wiki/Simon_(game)
 */
var audioExtension;
var audioPath;
var buttonColours;
var gamePattern = [];
var level;
var randomChosenColour;
var randomNumber;
var rangeMax;
var rangeMin;
var run;
var started;
var userChosenColour;
var userClickPattern = [];

//constants
audioExtension = ".mp3";
audioPath = "sounds/";
buttonColours = ["green", "red", "yellow", "blue"];
level = 0;
rangeMax = 4;
rangeMin = 0;
started = false;

//initializes the game, when a key press is detected run is called
document.addEventListener('keypress', run);

/**
 * Run starts the game
 **/
function run() {
  if (!started) {
    started = true;
    $("h1").text("Level " + level);
    nextSequence();
  }
}

//the click event
$(".btn").click(function() {
  //get the attribute by id from this object and store it in userChosenColour
  userChosenColour = $(this).attr("id");
  //put the userChosenColour inside the user pattern array
  userClickPattern.push(userChosenColour);
  //animate and sound
  animatePress(userChosenColour);
  playAudio(userChosenColour);
  //check the answer against the gamePattern, lenght of array -1 since the length would be out of bounds
  checkAnswer(userClickPattern.length-1);
});

/**
 * Animates the button press by applying and removing a pressed style
 * @param {String} currentColour The current colour of the button
 **/
function animatePress(currentColour) {
  //set the class to pressed then remove it after a delay
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

/**
 * Checks the answer
 * @param {Number} level The level
 **/
function checkAnswer(level) {
  //validate the current level
  if (gamePattern[level] === userClickPattern[level]) {
    //check to see if the length of the userClickPattern is equal to the gamePattern
    if (userClickPattern.length === gamePattern.length) {
      //timeout for a second
      setTimeout(function() {
        //call nextSequence to increase the level
        nextSequence();
      }, 1000);
    }
  } else {
    //wrong answer items
    playAudio("wrong");
    $('body').addClass("game-over-man");
    $("#level-title").text("Game Over Man, Press Any Key to Restart");

    setTimeout(function() {
      $("body").removeClass("game-over-man");
    }, 2000);

    startOver();
  }
}

//flash a button
function flashButton(colourIdentifier) {
  $("#" + colourIdentifier).fadeIn(100).fadeOut(100).fadeIn(100);
}

/**
 * Get a random number from min (inclusive) to max (exclusive)
 * @param {Number} min The minimum number
 * @param {Number} max The maximum number
 * @return {Number} The random nmber
 **/
function getRandomInt(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  randomNumnber = Math.floor(Math.random() * (max - min) + min);
  //The maximum is exclusive and the minimum is inclusive
  return randomNumnber;
}

/**
 * The next sequence function
 **/
function nextSequence() {
  //reset the user pattern
  userClickPattern = [];
  //increase the level
  level++;
  $("h1").text("Level " + level);

  //call the funciton to get a random number from 0-3
  randomNumber = getRandomInt(rangeMin, rangeMax);
  //use this random number to get a colour in the buttonColours array
  randomChosenColour = buttonColours[randomNumber];
  //put this random colour in the gamePattern array
  gamePattern.push(randomChosenColour);

  //flash the buttonColours and play sound
  flashButton(randomChosenColour);
  playAudio(randomChosenColour);
}

/**
 * Play a sound clip
 * @param {[String]} fileName The file name of the sound clip
 **/
function playAudio(fileName) {
  //create audio object
  var audio = new Audio(audioPath + fileName + audioExtension);
  //play sound clip
  audio.play();
}

/**
 * Starts the game over
 **/
function startOver() {
  gamePattern = [];
  userClickPattern = [];
  level = 0;
  started = false;
}
