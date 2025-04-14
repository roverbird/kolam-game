let tsize = 41, margin = 5, tnumber = 5;
let limit = 0.01; // Default connectivity density
let link, nlink, idx = 0, pg, bgcolor;
const halfTile = tsize / 2;
let yantraImg; // Variable to hold the SVG image

let interactionHistory = []; // Stores user interaction history
let lastInteractionTime = Date.now();
let movementValue = 0.1; // Initial movement value
let lastPosition = { x: 0, y: 0 }; // Initial position to calculate movement distance

function preload() {
    yantraImg = loadImage('path.png'); // Preload the SVG
}

function setup() {
    createCanvas(700, 700);
    bgcolor = color('#000000');
    pg = createGraphics(tsize * tnumber + 2 * margin, tsize * tnumber + 2 * margin);

    link = Array.from({ length: tnumber + 1 }, () => Array(tnumber + 1).fill(1));
    nlink = structuredClone(link);

    configTile();
    background(bgcolor);
}

function draw() {
    // Draw the yantra as background
    imageMode(CENTER);
    image(yantraImg, width / 2, height / 2, width, height); // Display the SVG

    if (idx <= 1) drawTile();

    push();
    translate(width / 2, height / 2);
    rotate(PI / 4);
    imageMode(CENTER);
    image(pg, 0, 0);
    pop();
}
function mouseClicked() {
    let x = mouseX;
    let y = mouseY;
    let currentTime = Date.now();

    let timeDiff = currentTime - lastInteractionTime;
    let distance = dist(x, y, lastPosition.x, lastPosition.y); // Distance from last interaction

    // Calculate movement value based on time difference and distance
    movementValue = calculateMovementValue(timeDiff, distance);

    // Update interaction history and last interaction details
    interactionHistory.push({ x, y, time: currentTime });
    lastPosition = { x, y };
    lastInteractionTime = currentTime;

    // Map movement value to a limit range and update density
    limit = map(movementValue, 0, 1, 0.1, 0.9);

    // Update tile configuration based on new limit
    configTile();
}

function mouseClicked() {
    let x = mouseX;
    let y = mouseY;
    let currentTime = Date.now();

    let timeDiff = currentTime - lastInteractionTime;
    let distance = dist(x, y, lastPosition.x, lastPosition.y); // Distance from last interaction

    // Calculate movement value based on time difference and distance
    movementValue = calculateMovementValue(timeDiff, distance);

    // Update interaction history and last interaction details
    interactionHistory.push({ x, y, time: currentTime });
    lastPosition = { x, y };
    lastInteractionTime = currentTime;

    // Map movement value to a limit range and update density
    limit = movementValue;
    console.log("Limit", movementValue);
    // Update tile configuration based on new limit
    configTile();
}

function calculateMovementValue(timeDiff, distance) {
    // Ensure timeDiff and distance are not zero or NaN
    if (timeDiff === 0 || distance === 0 || isNaN(timeDiff) || isNaN(distance)) {
        timeDiff = 0.001;  // Small value to avoid issues
        distance = 0.001;  // Small value to avoid issues
    }

    // Calculate speed: lower speed means slower movements (rewarding slow, expansive moves)
    const speed = 1.5 * distance / timeDiff; // Slow speed = large timeDiff, smaller distance

    console.log("speed:", speed);
    console.log("distance:", distance);
    console.log("timeDiff:", timeDiff);

    // Movement value should increase with more distance and slower speed
    let movementFactor = Math.pow(speed, 1.04);  // Exponentiate by a factor (e.g., 1.5)

    console.log("movementFactor:", movementFactor);

    // Factor in a random value to introduce variability
    let randomFactor = random(0.6, 1.1); // Random value between 0.7 and 1.1 for variability
    movementFactor *= randomFactor; // Apply the random factor to the movement factor

    //console.log("Movement Factor:", movementFactor);

    return movementFactor;
}


function configTile() {
    idx = 0;
    link = structuredClone(nlink);
    let size = nlink.length - 1;

    for (let i = 0; i <= size / 2; i++) {
        for (let j = i; j <= size / 2; j++) {
            let l = random() > limit ? 1 : 0;
            nlink[i][j] = nlink[i][size - j] = l;
            nlink[j][i] = nlink[size - j][i] = l;
            nlink[size - i][j] = nlink[size - i][size - j] = l;
            nlink[j][size - i] = nlink[size - j][size - i] = l;
        }
    }
}

function drawTile() {
    pg.background(bgcolor);
    pg.noFill();
    pg.stroke(255);
    pg.strokeWeight(5);

    for (let i = 0; i < tnumber; i++) {
        for (let j = 0; j < tnumber; j++) {
            if ((i + j) % 2 === 0) {
                let tl = halfTile * lerp(link[i][j], nlink[i][j], idx);
                let tr = halfTile * lerp(link[i + 1][j], nlink[i + 1][j], idx);
                let br = halfTile * lerp(link[i + 1][j + 1], nlink[i + 1][j + 1], idx);
                let bl = halfTile * lerp(link[i][j + 1], nlink[i][j + 1], idx);

                let x = i * tsize + margin, y = j * tsize + margin;
                pg.rect(x, y, tsize, tsize, tl, tr, br, bl);
                pg.point(x + halfTile, y + halfTile);
            }
        }
    }

    idx = constrain(idx + 0.02, 0, 1);
}

