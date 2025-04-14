// trackMovement.js
const square = document.getElementById("square");
const entropyDisplay = document.getElementById("entropyValue");
const hammer = new Hammer(square);

hammer.get("swipe").set({
    direction: Hammer.DIRECTION_ALL,
    threshold: 10,
    velocity: 0.2,
});

let interactionHistory = [];
let lastInteractionTime = Date.now();
let movementValue = 1; // Default value to prevent issues

function recordInteraction(x, y, type) {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastInteractionTime;

    if (timeDifference > 700) {
        interactionHistory.push({ x, y, type, time: currentTime });
        lastInteractionTime = currentTime;
    }

    movementValue = calculateEntropy(interactionHistory);
    entropyDisplay.innerText = `Interaction Entropy: ${movementValue.toFixed(3)}`;
}

hammer.on("tap swipeleft swiperight swipeup swipedown", (e) => {
    recordInteraction(e.center.x, e.center.y, e.type);
});

function calculateEntropy(history) {
    if (history.length === 0) return 0;

    const rect = square.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const gridSize = 10;
    let grid = {};
    let slowMovements = 0, fastMovements = 0, totalDistance = 0;

    let previousTime = history[0].time;
    let previousInteraction = { x: history[0].x, y: history[0].y };

    history.forEach(({ x, y, time }, index) => {
        const xIdx = Math.floor((x / width) * gridSize);
        const yIdx = Math.floor((y / height) * gridSize);
        const key = `${xIdx}-${yIdx}`;
        grid[key] = (grid[key] || 0) + 1;

        if (index > 0) {
            const interval = time - previousTime;
            interval < 700 ? fastMovements++ : slowMovements++;
            totalDistance += Math.sqrt((x - previousInteraction.x) ** 2 + (y - previousInteraction.y) ** 2);
        }

        previousTime = time;
        previousInteraction = { x, y };
    });

    const totalInteractions = history.length;
    const probabilities = Object.values(grid).map((count) => count / totalInteractions);
    const entropy = -probabilities.reduce((sum, p) => sum + p * Math.log(p), 0);
    const movementFactor = slowMovements > fastMovements ? 0.1 : 1.5;
    const averageDistance = totalDistance / (history.length - 1);
    const distanceFactor = averageDistance < 10 ? 0.8 : 1.2;

    return entropy * movementFactor * distanceFactor;
}

// Expose movementValue for sketch.js

window.getMovementValue = function () {
    return movementValue; // Ensure movementValue is defined
};


