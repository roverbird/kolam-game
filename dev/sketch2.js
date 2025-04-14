let tsize = 41; // Tile size
let margin = 5; // Margin size
let tnumber = 9; // Number of points (larger row)

let link, nlink; // Connections
let idx = 0; // Index for interpolation
let pg; // Graphics buffer
let bgcolor; // Background color

function setup() {
    createCanvas(700, 700);
    bgcolor = color(random(50), random(50), random(50));

    pg = createGraphics(tsize * tnumber + 2 * margin, tsize * tnumber + 2 * margin);

    link = Array.from({ length: tnumber + 1 }, () => Array(tnumber + 1).fill(1));
    nlink = Array.from({ length: tnumber + 1 }, () => Array(tnumber + 1).fill(1));

    configTile();
    background(bgcolor);
}

function draw() {
    if (idx <= 1) drawTile();

    push();
    translate(width / 2, height / 2);
    rotate(PI / 4);
    imageMode(CENTER);
    image(pg, 0, 0);
    pop();
}

function mouseClicked() {
    configTile();
}

function configTile() {
    idx = 0; // Reset index

    // Update old links
    for (let i = 0; i < link.length; i++) {
        for (let j = 0; j < link[0].length; j++) {
            link[i][j] = nlink[i][j];
        }
    }

    // Create new links
    let limit = random(0.4, 0.7); // Random connection frequency

    for (let i = 0; i < nlink.length; i++) {
        for (let j = i; j < nlink[0].length / 2; j++) {
            let l = random(1) > limit ? 1 : 0;

            nlink[i][j] = l; // left-top
            nlink[i][nlink[0].length - j - 1] = l; // left-bottom
            nlink[j][i] = l; // top-left
            nlink[nlink[0].length - j - 1][i] = l; // top-right
            nlink[nlink.length - 1 - i][j] = l; // right-top
            nlink[nlink.length - 1 - i][nlink[0].length - j - 1] = l; // right-bottom
            nlink[j][nlink.length - 1 - i] = l; // bottom-left
            nlink[nlink[0].length - 1 - j][nlink.length - 1 - i] = l; // bottom-right
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
                let top_left = (tsize / 2) * lerp(link[i][j], nlink[i][j], idx);
                let top_right = (tsize / 2) * lerp(link[i + 1][j], nlink[i + 1][j], idx);
                let bottom_right = (tsize / 2) * lerp(link[i + 1][j + 1], nlink[i + 1][j + 1], idx);
                let bottom_left = (tsize / 2) * lerp(link[i][j + 1], nlink[i][j + 1], idx);

                pg.rect(i * tsize + margin, j * tsize + margin, tsize, tsize, top_left, top_right, bottom_right, bottom_left);
                pg.point(i * tsize + tsize / 2 + margin, j * tsize + tsize / 2 + margin);
            }
        }
    }

    // Update index
    idx += 0.02;
    idx = constrain(idx, 0, 1);
}


