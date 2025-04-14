// Select the square div element
const square = document.getElementById("square");
const entropyDisplay = document.getElementById("entropyValue");

// Initialize the Hammer.js instance for detecting tap and swipe
const hammer = new Hammer(square);

// Configure swipe options
hammer.get("swipe").set({
    direction: Hammer.DIRECTION_ALL, // Detect swipes in all directions
    threshold: 10, // Minimum distance required before recognizing a swipe
    velocity: 0.2, // Reduced velocity for slower swipes to reward tenderness
});

// Track click & swipe positions
let interactionHistory = [];
let lastInteractionTime = Date.now();

// Function to record interaction and apply slow movement encouragement
function recordInteraction(x, y, type) {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastInteractionTime;

    // Record interaction only if the movement is slow enough (e.g., slow tap/swipe)
    if (timeDifference > 700) {  // Minimum interval of 700ms between actions
        interactionHistory.push({ x, y, type, time: currentTime });
        lastInteractionTime = currentTime; // Update the last interaction time
    }

    // Calculate and display the entropy (slow movements will generally result in lower entropy)
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

// Function to calculate entropy with a preference for slow/tender interactions
function calculateEntropy(history) {
    if (history.length === 0) return 0;

    // Get the bounding box of the square div
    const rect = square.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize the interactions to a grid within the square
    const gridSize = 10;
    let grid = {};

    // Variables to account for slow movements
    let slowMovements = 0;
    let fastMovements = 0;

    history.forEach(({ x, y, time }) => {
        const xIdx = Math.floor((x / width) * gridSize);
        const yIdx = Math.floor((y / height) * gridSize);
        const key = `${xIdx}-${yIdx}`;

        // Increment the interaction count for each grid cell
        grid[key] = (grid[key] || 0) + 1;

        // Track the time difference between interactions for slow/fast categorization
        if (time && history.indexOf({ x, y, time }) > 0) {
            const prevTime = history[history.indexOf({ x, y, time }) - 1].time;
            const interval = time - prevTime;
            if (interval < 700) fastMovements++;
            else slowMovements++;
        }
    });

    // Calculate the probabilities for each grid cell
    const totalInteractions = history.length;
    const probabilities = Object.values(grid).map((count) => count / totalInteractions);

    // Calculate entropy using the formula: -Σp(x) * log(p(x))
    const entropy = -probabilities.reduce((sum, p) => sum + p * Math.log(p), 0);

    // Adjust entropy based on movement speed: slow movements encourage lower entropy (mindfulness)
    // If there are more slow movements, entropy will decrease.
    const movementFactor = slowMovements > fastMovements ? 0.1 : 1.2; // Penalize fast, reward slow

    return entropy * movementFactor;
}

