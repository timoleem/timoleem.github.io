const kiwi = document.getElementById('kiwi');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const toggleBtn = document.getElementById('toggle-btn');
const dayNightImg = document.getElementById('day-night-img');

const tree = document.getElementById('tree');
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

// Start the interval
gravityInterval = setInterval(applyGravity, 20);

// Define platforms
const platforms = [
  { left: 100, bottom: 50, width: 200, height: 20 },
  { left: 300, bottom: 150, width: 150, height: 20 },
  { left: 500, bottom: 250, width: 300, height: 30 },
];

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
    } else if (isOnPlatform()) {
      // Stop falling when kiwi's bottom position is at or above the platform's top position plus its height
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

function isOnPlatform() {
  for (let i = 0; i < platforms.length; i++) {
    let platform = platforms[i];
    let kiwiRect = kiwi.getBoundingClientRect();
    let platformRect = {
      left: platform.left,
      right: platform.left + platform.width,
      top: canvas.offsetHeight - platform.bottom - platform.height,
      bottom: canvas.offsetHeight - platform.bottom - platform.height,
    };
    if (
      kiwiRect.bottom >= platformRect.top &&
      kiwiRect.top <= platformRect.bottom - 1.5*platform.height &&
      kiwiRect.right >= platformRect.left &&
      kiwiRect.left <= platformRect.right
    ) {
      return true;
    }
  }
  return false;
}

function applyGravity() {
  if (!isJumping && kiwiBottom > 0 && !isOnPlatform(kiwiBottom)) {
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

function updateHeight(height) {
  // Clear the area within the square
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Display the height value of the kiwi
  ctx.fillStyle = 'black';
  ctx.font = '0.6em Consolas'; // Using em units
  ctx.weight = 'bold';
  ctx.fillText('Height kiwi: ' + Math.floor(height), parseInt(10),parseInt(10));
  const platform2 = document.getElementById('platform2');
  const platform2Rect = platform2.getBoundingClientRect();
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = true;
  } else if (event.key === 'ArrowRight') {
    isMovingRight = true;
  } else if (event.key === 'ArrowUp') { // Space key for jumping
    startJump();
  } else if (event.key === ' ') { // Space key for entering the tree
    if (isWithinTreeBounds()) { // Check if kiwi is near the tree
      enterTree();
    }
  }
});

function isWithinTreeBounds() {
  const treeRect = tree.getBoundingClientRect();
  const kiwiRect = kiwi.getBoundingClientRect();
  return (
    kiwiRect.left >= treeRect.left &&
    kiwiRect.right <= treeRect.right &&
    kiwiRect.bottom <= treeRect.bottom &&
    kiwiRect.top >= treeRect.top
  );
}

function enterTree() {
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
    if (isWithinTreeBounds()) {
      enterText.style.display = 'block';
    } else {
      enterText.style.display = 'none';
    }
  }
});

// Start moving the kiwi
requestAnimationFrame(moveKiwi);
