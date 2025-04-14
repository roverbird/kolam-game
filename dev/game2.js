// Get the values from the data-attributes in the DOM element
let gameContainer = document.getElementById('squareElement');

let tsize = parseInt(gameContainer.getAttribute('data-tsize'), 10);
let margin = parseInt(gameContainer.getAttribute('data-margin'), 10);
let tnumberArray = gameContainer.getAttribute('data-tnumber')
    .split(',')
    .map(num => parseInt(num, 10)); // Convert to array of numbers
let tnumberIndex = 0;
let tnumber = tnumberArray[tnumberIndex]; // Start with first value

let limit = 0.01;
let link, nlink, idx = 0, pg, bgcolor;
const halfTile = tsize / 2;
let yantraImg;

let interactionHistory = [];
let lastInteractionTime = Date.now();
let movementValue = 0.1;
let lastPosition = { x: 0, y: 0 };

function preload() {
    yantraImg = loadImage('path.png');
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
    imageMode(CENTER);
    image(yantraImg, width / 2, height / 2, width, height);

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
    let distance = dist(x, y, lastPosition.x, lastPosition.y);

    movementValue = calculateMovementValue(timeDiff, distance);

    interactionHistory.push({ x, y, time: currentTime });
    lastPosition = { x, y };
    lastInteractionTime = currentTime;

    limit = movementValue;
    console.log("Limit:", movementValue);

    // If limit exceeds 1 and we haven't reached the last tnumber, switch to next
    if (limit > 1 && tnumberIndex < tnumberArray.length - 1) {
        tnumberIndex++;  // Move to the next tnumber
        tnumber = tnumberArray[tnumberIndex];

        console.log("Switched to tnumber:", tnumber);

        // **Reinitialize link and nlink with the new size**
        link = Array.from({ length: tnumber + 1 }, () => Array(tnumber + 1).fill(1));
        nlink = structuredClone(link);

        // **Resize the canvas for new grid size**
        pg = createGraphics(tsize * tnumber + 2 * margin, tsize * tnumber + 2 * margin);
    }

    configTile();
}

function calculateMovementValue(timeDiff, distance) {
    if (timeDiff === 0 || distance === 0 || isNaN(timeDiff) || isNaN(distance)) {
        timeDiff = 0.001;
        distance = 0.001;
    }

    const speed = 1.5 * distance / timeDiff;

    let movementFactor = Math.pow(speed, 1.04);
    let randomFactor = random(0.6, 1.1);
    movementFactor *= randomFactor;

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

