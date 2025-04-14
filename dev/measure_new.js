// Select the canvas element
const canvas = document.getElementById('square');

// Set canvas dimensions (optional, no longer needed for drawing)
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Initialize Hammer.js
const hammer = new Hammer(canvas);

// Track interaction history (for entropy calculation)
let interactionHistory = []; // To store coordinates of each tap/swipe

// Maximum distance for nearby taps (in px)
const MIN_DISTANCE = 50;

// Function to record interaction for entropy calculation
function recordInteraction(e) {
    const { x, y } = e.center;

    // Check if the tap/swipe is too close to previous actions
    if (interactionHistory.length > 0) {
        const lastInteraction = interactionHistory[interactionHistory.length - 1];
        const distance = Math.sqrt(Math.pow(x - lastInteraction.x, 2) + Math.pow(y - lastInteraction.y, 2));
        if (distance < MIN_DISTANCE) {
            // If the interaction is too close, reduce the entropy contribution
            return;
        }
    }

    // Record the valid interaction
    interactionHistory.push({ x, y });
}

// Hammer.js events for tap and swipe interactions
hammer.on("tap", recordInteraction);
hammer.on("swipe", recordInteraction);

// Function to calculate entropy based on interaction history
function calculateEntropy(interactionHistory) {
    if (interactionHistory.length < 2) return 0;

    let gridSize = 5;  // Define grid size for entropy calculation (e.g., 20px)
    let gridCounts = {}; // Store the count of interactions in each grid cell
    let totalInteractions = interactionHistory.length;

    // Categorize interactions into grid cells
    interactionHistory.forEach(interaction => {
        let gridX = Math.floor(interaction.x / gridSize);
        let gridY = Math.floor(interaction.y / gridSize);
        let key = `${gridX},${gridY}`;

        if (!gridCounts[key]) gridCounts[key] = 0;
        gridCounts[key]++;
    });

    // Calculate the probability distribution of interactions
    let entropy = 0;
    for (let key in gridCounts) {
        let probability = gridCounts[key] / totalInteractions;
        entropy -= probability * Math.log2(probability);
    }

    // Return the calculated entropy
    return entropy;
}

// Function to display entropy
function displayEntropy() {
    const entropy = calculateEntropy(interactionHistory);
    document.getElementById('entropyValue').innerText = `Click Entropy: ${entropy.toFixed(3)}`;
}

// Periodically update entropy display
setInterval(displayEntropy, 500);

