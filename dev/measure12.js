// Select the canvas element
const canvas = document.getElementById('square');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Initialize Hammer.js
const hammer = new Hammer(canvas);

// Track interaction history (for entropy calculation)
let interactionHistory = []; // To store coordinates of each tap/swipe

// Maximum distance for nearby taps (in px)
const MIN_DISTANCE = 50; // Minimum distance to discourage clustering (adjust as needed)
const MAX_FREQUENCY = 3; // Maximum number of taps/swipes per second (encourages slower behavior)

// Track time between interactions
let lastInteractionTime = Date.now();

// Function to record interaction for entropy calculation
function recordInteraction(e) {
    const { x, y } = e.center;
    const currentTime = Date.now();

    // Calculate time difference between current and last interaction
    const timeDifference = currentTime - lastInteractionTime;

    // Calculate distance between current and last interaction (to check for clustering)
    let penalty = 1; // Default penalty (no penalty)
    if (interactionHistory.length > 0) {
        const lastInteraction = interactionHistory[interactionHistory.length - 1];
        const distance = Math.sqrt(Math.pow(x - lastInteraction.x, 2) + Math.pow(y - lastInteraction.y, 2));

        // If the interaction is too close, apply a penalty to the entropy contribution
        if (distance < MIN_DISTANCE) {
            penalty = 0.5; // Reduce entropy contribution for clustered interactions
        }
    }

    // Apply penalty for fast interactions (too quick taps/swipes)
    if (timeDifference < 1000 / MAX_FREQUENCY) {
        penalty *= 0.5; // Reduce entropy contribution for quick interactions
    }

    // Record the interaction and store its penalty
    interactionHistory.push({ x, y, penalty });

    // Update the last interaction time
    lastInteractionTime = currentTime;
}

// Hammer.js events for tap and swipe interactions
hammer.on("tap", recordInteraction);
hammer.on("swipe", recordInteraction);

// Function to calculate entropy based on interaction history
function calculateEntropy(interactionHistory) {
    if (interactionHistory.length < 2) return 0;

    let gridSize = 20;  // Define grid size for entropy calculation (e.g., 20px)
    let gridCounts = {}; // Store the count of interactions in each grid cell
    let totalInteractions = interactionHistory.length;

    // Categorize interactions into grid cells
    interactionHistory.forEach(interaction => {
        let gridX = Math.floor(interaction.x / gridSize);
        let gridY = Math.floor(interaction.y / gridSize);
        let key = `${gridX},${gridY}`;

        if (!gridCounts[key]) gridCounts[key] = { count: 0, penalty: 0 };
        gridCounts[key].count++;
        gridCounts[key].penalty += interaction.penalty;
    });

    // Calculate the probability distribution of interactions and include penalties
    let entropy = 0;
    for (let key in gridCounts) {
        const { count, penalty } = gridCounts[key];
        let probability = count / totalInteractions;
        let adjustedProbability = probability * penalty / totalInteractions; // Adjust by penalty
        entropy -= adjustedProbability * Math.log2(adjustedProbability);
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

