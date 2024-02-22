const kiwi = document.getElementById('kiwi');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toggleBtn = document.getElementById('toggle-btn');
const rocket = document.getElementById('rocket');
const enterText = document.getElementById('enter-text');

let kiwiLeft = 0;
let kiwiBottom = 0;
let isFacingLeft = false; // Keep track of Kiwi's facing direction
let isJumping = false; // Keep track of whether Kiwi is currently jumping
let isMovingLeft = false; // Keep track of whether Kiwi is moving left
let isMovingRight = false; // Keep track of whether Kiwi is moving right
let jumpInterval; // Interval for the jump animation
let fallInterval; // Interval for the fall animation
const jumpHeight = 200; // Adjust as needed
const gravity = .7; // Adjust as needed
let jumpStep = 14; // Adjust for faster jump speed
let fallStep = 3; // Adjust for faster fall speed
let jumpIntervalDuration = 12; // Decrease for smoother jump animation
let fallIntervalDuration = 6; // Decrease for smoother fall animation
let isDayTime = true;
let gravityInterval;
let isInShuttle = false;

// Start the interval
gravityInterval = setInterval(applyGravity, 20);

toggleBtn.addEventListener('click', function() {
  isDayTime = !isDayTime;
  if (isDayTime) {
    canvas.style.backgroundColor = '#e5eff7'; // Day time color
  } else {
    canvas.style.backgroundColor = '#225566'; // Night time color
  }
});

function moveKiwi() {
  let moveStep = 6; // Adjust for faster movement speed
  if (isMovingLeft) {
    kiwiLeft -= moveStep;
    if (!isFacingLeft) {
      kiwi.classList.add('kiwi-flipped');
      isFacingLeft = true;
    }
  } else if (isMovingRight) {
    kiwiLeft += moveStep;
    if (isFacingLeft) {
      kiwi.classList.remove('kiwi-flipped');
      isFacingLeft = false;
    }
  }
  kiwi.style.left = `${kiwiLeft}px`;
  requestAnimationFrame(moveKiwi);
}

function startFall() {
  fallInterval = setInterval(function() {
    kiwiBottom -= fallStep;
    kiwi.style.bottom = `${kiwiBottom}px`;
    if (kiwiBottom <= 0) {
      kiwiBottom = 0;
      kiwi.style.bottom = `${kiwiBottom}px`;
      clearInterval(fallInterval);
      isJumping = false;
      jumpStep = 14; // Reset jump step for next jump
    }
  }, fallIntervalDuration);
}

function startJump() {
  if (!isJumping) {
    isJumping = true;
    let jumpStart = kiwiBottom;
    jumpInterval = setInterval(function() {
      kiwiBottom += jumpStep;
      kiwi.style.bottom = `${kiwiBottom}px`;
      jumpStep -= gravity; // Apply gravity to decrease jump step
      if (kiwiBottom - jumpStart >= jumpHeight || jumpStep <= 0) { // Stop jumping when reaching max height or jump step becomes zero
        clearInterval(jumpInterval);
        startFall();
      }
    }, jumpIntervalDuration);
  }
}

function applyGravity() {
  if (!isJumping && kiwiBottom > 0) {
    kiwiBottom -= 5;
    kiwi.style.bottom = `${kiwiBottom}px`;
    if (kiwiBottom <= 0) {
      kiwiBottom = 0;
      kiwi.style.bottom = `${kiwiBottom}px`;
      clearInterval(fallInterval);
      isJumping = false;
      jumpStep = 14; // Reset jump step for next jump
    }
  }
}

function updateHeight() {
  // Clear the area within the square
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Display the height value of the kiwi
  ctx.fillStyle = 'black';
  ctx.font = '0.6em Consolas'; // Using em units
  ctx.weight = 'bold';
  //
  const rocketRect = rocket.getBoundingClientRect();
  ctx.fillText('kiwileft: ' + rocketRect.bottom, parseInt(10),parseInt(10));
}

function isNearShuttle() {
  const kiwiRect = kiwi.getBoundingClientRect();
  const shuttleRect = rocket.getBoundingClientRect();

  return (
    kiwiRect.left >= shuttleRect.left +20 &&
    kiwiRect.right <= shuttleRect.right -20 &&
    kiwiRect.bottom <= shuttleRect.bottom -20 &&
    kiwiRect.top >= shuttleRect.top
  );
}

function enterShuttle() {
  isInShuttle = true;
  kiwi.style.bottom = '0';
  kiwi.style.left = '50%';
}

function exitShuttle() {
  isInShuttle = false;
  kiwi.style.bottom = '0';
  kiwi.style.left = '0';
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = true;
  } else if (event.key === 'ArrowRight') {
    isMovingRight = true;
  } else if (event.key === 'ArrowUp') { // Space key for jumping
    startJump();
  } else if (event.key === ' ') { // Space key for entering the tree
    if (isNearShuttle()) { // Check if kiwi is near the tree
      enterRocket();
    }
  }
  kiwi.style.left = `${kiwiLeft}px`;
  if (!isInShuttle && isNearShuttle()) {
    enterShuttle();
  }
});

function enterRocket() {
  // Code to execute when kiwi enters the tree
  window.location.href = 'profile.html';
}

document.addEventListener('keyup', function(event) {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = false;
  } else if (event.key === 'ArrowRight') {
    isMovingRight = false;
  }
});

// Event listener to show the enter text when kiwi is within bounds of the tree
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    if (isWithinRocketBounds()) {
      enterText.style.display = 'block';
    } else {
      enterText.style.display = 'none';
    }
  }
});

// Start moving the kiwi
requestAnimationFrame(moveKiwi);
