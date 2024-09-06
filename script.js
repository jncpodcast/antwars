let score = 0;
let timeRemaining = 60;
let level = 1;
let ants = [];
let antTypes = ['ghost-ant', 'regular-ant', 'carpenter-ant', 'flying-carpenter-ant'];
let levelDuration = 60000; // 60 seconds

const gameArea = document.getElementById('game-area');
const timerDisplay = document.getElementById('time-remaining');
const scoreDisplay = document.getElementById('score-value');
const levelDisplay = document.getElementById('level-value');
const startButton = document.getElementById('start-button');
const nextLevelButton = document.getElementById('next-level-button'); // Next Level Button

let gamePaused = false; // Track if the game is paused between levels

// Define different levels
const levelSettings = [
    { type: 'ghost-ant', speed: 6 }, // Level 1: Ghost ants only
    { type: 'regular-ant', speed: 6 }, // Level 2: Regular ants only
    { type: 'carpenter-ant', speed: 6 }, // Level 3: Carpenter ants only
    { type: ['carpenter-ant', 'flying-carpenter-ant'], speed: 6 }, // Level 4: Carpenter and Flying ants
    { type: 'ghost-ant', speed: 3 }, // Level 5: Fast ghost ants
];

// Ant generation and movement
function spawnAnt(type, speed) {
    if (gamePaused) return; // Don't generate ants if the game is paused

    const ant = document.createElement('div');
    ant.classList.add('ant', type);
    ant.style.left = `${Math.random() * 90}%`;
    ant.style.top = '0';

    ant.style.animationDuration = `${speed}s`;
    ant.style.animationDelay = `0s`;

    // Handle both touch and click events for squishing
    const squishHandler = (event) => {
        event.preventDefault(); // Prevent default behavior to avoid duplicate events
        squishAnt(ant);
    };

    ant.addEventListener('touchstart', squishHandler);
    ant.addEventListener('click', squishHandler);

    gameArea.appendChild(ant);
    ants.push(ant);
}

// Squish ant function
function squishAnt(ant) {
    // Check if the ant has already been squished to prevent duplicate handling
    if (ant.classList.contains('squished')) return;
    ant.classList.add('squished');

    score += 10;
    scoreDisplay.innerText = score;

    // Stop the movement and change to squished image
    ant.style.animationPlayState = 'paused';

    // Replace the ant with the squished image
    const squishedImageUrl = 'https://static.wixstatic.com/media/7b5caa_41c47076103b4288b8efa441bc66a7e8~mv2.png';
    ant.style.backgroundImage = `url('${squishedImageUrl}')`;
    ant.style.backgroundSize = 'contain';
    ant.style.transform = ''; // Remove any rotation for the squished image

    // Adjust size of the squished ant relative to the original size
    const antWidth = ant.offsetWidth;
    ant.style.width = `${antWidth}px`; // Keep size the same

    // Remove the ant after a short delay
    setTimeout(() => {
        ant.remove();
        ants = ants.filter(a => a !== ant);
    }, 1000);
}

// Generate ants for the current level
function generateAnts() {
    if (gamePaused) return; // Don't generate ants if the game is paused

    const currentLevel = levelSettings[level - 1] || { type: antTypes, speed: Math.random() * 3 + 3 };
    const antTypesForLevel = Array.isArray(currentLevel.type) ? currentLevel.type : [currentLevel.type];

    const randomAntType = antTypesForLevel[Math.floor(Math.random() * antTypesForLevel.length)];
    spawnAnt(randomAntType, currentLevel.speed);

    setTimeout(generateAnts, Math.random() * 1500 + 500);
}

// Timer and game loop
function startGame() {
    startButton.classList.add('hidden');
    nextLevelButton.classList.add('hidden');
    gamePaused = false; // Unpause the game when starting

    // Reset timer and score if starting a new game
    if (level === 1 && score === 0) {
        timeRemaining = 60;
    }

    timerDisplay.innerText = timeRemaining;
    scoreDisplay.innerText = score;

    const gameInterval = setInterval(() => {
        if (gamePaused) return; // Pause the timer if the game is paused

        timeRemaining--;
        timerDisplay.innerText = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(gameInterval);
            endLevel();
        }
    }, 1000);

    generateAnts(); // Start generating ants for the current level
}

// End current level and show next level button
function endLevel() {
    gamePaused = true; // Pause the game at the end of the level

    // Stop generating new ants and clear existing ants
    ants.forEach(ant => ant.remove());
    ants = [];

    // Show Next Level button
    nextLevelButton.classList.remove('hidden');
}

// Proceed to the next level
function nextLevel() {
    level++;
    levelDisplay.innerText = level;
    timeRemaining = 60; // Reset time for the next level, but keep score
    startGame(); // Start the next level
}

// Start game button click handler
startButton.addEventListener('click', () => {
    timeRemaining = 60;
    score = 0; // Reset score when starting a new game
    scoreDisplay.innerText = score;
    startGame();
});

// Next level button click handler
nextLevelButton.addEventListener('click', nextLevel);

// Optional: Allow restarting the game after all levels
// You can implement this based on your game design