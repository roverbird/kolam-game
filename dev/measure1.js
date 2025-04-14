// Select the square div element
const square = document.getElementById("square");
const entropyDisplay = document.getElementById("entropyValue");

// Initialize the Hammer.js instance for detecting tap and swipe
const hammer = new Hammer(square);

// Configure swipe options
hammer.get("swipe").set({
    direction: Hammer.DIRECTION_ALL, // Detect swipes in all directions
    threshold: 10, // Minimum distance required before recognizing a swipe
    velocity: 0.3, // Minimum velocity required before recognizing
});

// Track click & swipe positions
let interactionHistory = [];

// Function to record interaction
function recordInteraction(x, y, type) {
    interactionHistory.push({ x, y, type });
    console.log(`${type} recorded:`, { x, y });

    // Calculate and display the entropy
    const entropy = calculateEntropy(interactionHistory);
    entropyDisplay.innerText = `Interaction Entropy: ${entropy.toFixed(3)}`;
}

// Hammer.js listeners
hammer.on("tap", (e) => {
    recordInteraction(e.center.x, e.center.y, "tap");
});

hammer.on("swipeleft", (e) => {
    recordInteraction(e.center.x, e.center.y, "swipeleft");
});

hammer.on("swiperight", (e) => {
    recordInteraction(e.center.x, e.center.y, "swiperight");
});

hammer.on("swipeup", (e) => {
    recordInteraction(e.center.x, e.center.y, "swipeup");
});

hammer.on("swipedown", (e) => {
    recordInteraction(e.center.x, e.center.y, "swipedown");
});

// Function to calculate entropy
function calculateEntropy(history) {
    if (history.length === 0) return 0;

    // Get the bounding box of the square div
    const rect = square.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize the interactions to a grid within the square
    const gridSize = 10;
    let grid = {};

    history.forEach(({ x, y }) => {
        const xIdx = Math.floor((x / width) * gridSize);
        const yIdx = Math.floor((y / height) * gridSize);
        const key = `${xIdx}-${yIdx}`;

        // Increment the interaction count for each grid cell
        grid[key] = (grid[key] || 0) + 1;
    });

    // Calculate the probabilities for each grid cell
    const totalInteractions = history.length;
    const probabilities = Object.values(grid).map((count) => count / totalInteractions);

    // Calculate entropy using the formula: -Σp(x) * log(p(x))
    const entropy = -probabilities.reduce((sum, p) => sum + p * Math.log(p), 0);

    return entropy;
}

