let gameContainer = document.getElementById('squareElement');

const tsize = parseInt(gameContainer.getAttribute('data-tsize'), 10);
const margin = parseInt(gameContainer.getAttribute('data-margin'), 10);
const tnumberArray = gameContainer.getAttribute('data-tnumber')
    .split(',')
    .map(Number);
let tnumberIndex = 0;
let tnumber = tnumberArray[tnumberIndex];

let limit = 0.01;
let idx = 0, pg, bgcolor;
const halfTile = tsize / 2;
let yantraImg;

let interactionHistory = [];
let lastInteractionTime = performance.now();
let movementValue = 0.1;
let lastPosition = { x: 0, y: 0 };

function preload() {
    yantraImg = loadImage('frame.png');
}

function setup() {
    createCanvas(700, 700);
    bgcolor = color('#000000');
    pg = createGraphics(tsize * tnumber + 2 * margin, tsize * tnumber + 2 * margin);
    
    initializeLinks();
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
    image(pg, 0, 0);
    pop();
}

let firstInteractionTime = performance.now();

function mouseClicked() {
    const x = mouseX;
    const y = mouseY;
    const currentTime = performance.now();
    const timeDiff = currentTime - lastInteractionTime;
    const timeSinceStart = 23 / (1 + Math.log(1 + (currentTime - firstInteractionTime)));
    const distance = dist(x, y, lastPosition.x, lastPosition.y) || 0.001;
    
    movementValue = calculateMovementValue(timeDiff || 0.001, distance, timeSinceStart || 1);
    interactionHistory.push({ x, y, time: currentTime });
    lastPosition = { x, y };
    lastInteractionTime = currentTime;

    limit = movementValue;
    console.log("Limit:", movementValue);

    if (limit > 0.9 && tnumberIndex < tnumberArray.length - 1) {
        tnumber = tnumberArray[++tnumberIndex];
        initializeLinks();
        pg = createGraphics(tsize * tnumber + 2 * margin, tsize * tnumber + 2 * margin);
    }

    configTile();
}

function calculateMovementValue(timeDiff, distance, timeSinceStart) {
    return Math.pow(timeSinceStart * (distance / timeDiff), 1.04) * random(0.7, 1.5);
}

function initializeLinks() {
    link = new Array(tnumber + 1).fill().map(() => new Uint8Array(tnumber + 1).fill(1));
    nlink = link.map(row => new Uint8Array(row));
}

function configTile() {
    idx = 0;
    const size = nlink.length - 1;
    
    for (let i = 0; i <= size / 2; i++) {
        for (let j = i; j <= size / 2; j++) {
            const l = Math.random() > limit ? 1 : 0;
            nlink[i][j] = nlink[i][size - j] = nlink[j][i] = nlink[size - j][i] = l;
            nlink[size - i][j] = nlink[size - i][size - j] = nlink[j][size - i] = nlink[size - j][size - i] = l;
        }
    }
}

function drawTile() {
    pg.background(bgcolor);
    pg.noFill();
    pg.stroke(254, 247, 226);
    pg.strokeWeight(3);
    
    for (let i = 0; i < tnumber; i++) {
        for (let j = 0; j < tnumber; j++) {
            if ((i + j) % 2 === 0) {
                const x = i * tsize + margin, y = j * tsize + margin;
                pg.rect(x, y, tsize, tsize, 
                        halfTile * lerp(link[i][j], nlink[i][j], idx),
                        halfTile * lerp(link[i + 1][j], nlink[i + 1][j], idx),
                        halfTile * lerp(link[i + 1][j + 1], nlink[i + 1][j + 1], idx),
                        halfTile * lerp(link[i][j + 1], nlink[i][j + 1], idx));
                pg.point(x + halfTile, y + halfTile);
            }
        }
    }
    idx = constrain(idx + 0.02, 0, 1);
}

