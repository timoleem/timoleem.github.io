const kiwi = document.getElementById('kiwi');

let kiwiLeft = 0;
let kiwiBottom = 0;
let isFacingLeft = false; // Keep track of Kiwi's facing direction
let isJumping = false; // Keep track of whether Kiwi is currently jumping
let isMovingLeft = false; // Keep track of whether Kiwi is moving left
let isMovingRight = false; // Keep track of whether Kiwi is moving right
let jumpInterval; // Interval for the jump animation
let fallInterval; // Interval for the fall animation
const jumpHeight = 150; // Adjust as needed
const gravity = .9; // Adjust as needed

let jumpStep = 14; // Adjust for faster jump speed
let fallStep = 3; // Adjust for faster fall speed

let jumpIntervalDuration = 10; // Decrease for smoother jump animation
let fallIntervalDuration = 10; // Decrease for smoother fall animation

function moveKiwi() {
  let moveStep = 3; // Adjust for faster movement speed

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

function applyGravity() {
  if (!isJumping && kiwiBottom > 0) {
    kiwiBottom -= gravity;
    kiwi.style.bottom = `${kiwiBottom}px`;
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = true;
  } else if (event.key === 'ArrowRight') {
    isMovingRight = true;
  } else if (event.key === 'ArrowUp') { // Space key for jumping
    startJump();
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = false;
  } else if (event.key === 'ArrowRight') {
    isMovingRight = false;
  }
});

// Apply gravity continuously
setInterval(applyGravity, 20);

// Initialize kiwiBottom to its initial position
kiwiBottom = parseInt(window.getComputedStyle(kiwi).bottom);

// Start moving the kiwi
requestAnimationFrame(moveKiwi);
