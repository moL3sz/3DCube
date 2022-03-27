function Point(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z
    this.w = w
    this.clicked = false
    this.rr = 1;
}

function multiply(a, b) {
    var aNumRows = a.length,
        aNumCols = a[0].length,
        bNumRows = b.length,
        bNumCols = b[0].length,
        m = new Array(aNumRows); // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0; // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}
let cube = []
const createCube = () => {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            for (let k = 0; k < N; k++) {
                const p = new Point(k * gap + k * r * 2, j * gap + j * r * 2, i * gap + i * r * 2)
                cube.push(p)
            }
        }
    }
}


const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt
const tan = Math.tan
const PI = Math.PI
const pow = Math.pow
const abs = Math.abs
const cot = (a) => 1 / Math.tan(a)

function setup() {
    createCanvas(1000, 800)
    setAttributes('antialias', true);
    createCube()
    angleMode(DEGREES)
}

const normalizeVector = (v) => {
    let vv = []
    for (const a of v) {
        vv.push(a[0])
    }
    return vv
}
const vectorFromPoint = (v) => {
    return [
        [v.x],
        [v.y],
        [v.z]
    ]
}
const rotateX = (angle, v) => {
    angle = angle / 180 * Math.PI

    let M = [
        [1, 0, 0],
        [0, cos(angle), -sin(angle)],
        [0, sin(angle), cos(angle)]
    ]
    v = vectorFromPoint(v)

    return pointFromVector(normalizeVector(multiply(M, v)))

}
const rotateY = (angle, v) => {
    angle = angle / 180 * Math.PI

    let M = [
        [cos(angle), 0, sin(angle)],
        [0, 1, 0],
        [-sin(angle), 0, cos(angle)]
    ]
    v = vectorFromPoint(v)
    return pointFromVector(normalizeVector(multiply(M, v)))

}
const rotateZ = (angle, v) => {
    angle = angle / 180 * Math.PI
    let M = [
        [cos(angle), -sin(angle), 0],
        [sin(angle), cos(angle), 0],
        [0, 0, 1]
    ]
    v = vectorFromPoint(v)

    return pointFromVector(normalizeVector(multiply(M, v)))
}

const pointFromVector = (v) => {
    return new Point(v[0], v[1], v[2])
}


let N = 4;
let r = 20;
let gap = 40;
let angle = 0





function PerspectiveProjection(v, M) {
    let p = vectorFromPoint(v)
    let R = normalizeVector(multiply(M, p));
    return pointFromVector(R)
}
let cubeProjected;
let lastMousePos;
let c = new Point(0, 0, 400)


let RX = 0
let RY = 0
let RZ = 0
let SXYZ = 2 / N;

function draw() {
    background(200);
    strokeWeight(1 / SXYZ);
    stroke(0)
    fill(255, 0, 0)
    translate(width / 2, height / 2)
    scale(SXYZ)
    push()
    beginShape(POINTS);
    cubeProjected = []
    for (let p of cube) {
        //make a transform
        let tx = -(N - 1) * gap / 2 - N * r / 2 - r / 2
        let ty = -(N - 1) * gap / 2 - N * r / 2 - r / 2
        let tz = -(N - 1) * gap / 2 - N * r / 2 - r / 2
        p.x += tx
        p.y += ty
        p.z += tz;
        ///////Rotation////////
        let p1;
        p1 = rotateX(RY, p);
        p1 = rotateY(RX, p1);
        p1 = rotateZ(RZ, p1);
        ////////////////////////

        ////////Perspective Projection///////////
        let distance = 2;
        let z = 1 / (distance - p1.z / (N * (N - 2)) + 55) * 100

        //projection matrix
        let PerspectiveMatrix = [
            [z, 0, 0],
            [0, z, 0],
        ]
        p1 = PerspectiveProjection(p1, PerspectiveMatrix)
        p1.rr = r * z / 1.5
            ////////////////////////////////////////

        p.x -= tx
        p.y -= ty
        p.z -= tz;
        //let rr = r * (1.5 - m) * 2
        cubeProjected.push(p1)

        //check if the point clicked and set the color to white
        if (p.clicked) {
            fill(255)
        } else {
            fill(255, 0, 0)
        }
        ellipse(p1.x, p1.y, r * 2 * z / 1.5)
    }
    endShape()
    pop()
    strokeWeight(1)
    stroke(0)
        //line(0, -height / 2, 0, height / 2)
        //line(-width / 2, 0, width / 2, 0)


}
const dist3 = (p1, p2) => {
    return sqrt(
        pow(p2.x - p1.x, 2) +
        pow(p2.y - p1.y, 2) +
        pow(p2.z - p1.z, 2)

    )
}
const dist2 = (p1, p2) => {
    return sqrt(
        pow(p2.x - p1.x, 2) +
        pow(p2.y - p1.y, 2)
    )
}


function mousePressed() {
    lastMousePos = new Point(mouseX, mouseY)

}

function doubleClicked() {
    let mousePoint = new Point(mouseX - width / 2, mouseY - height / 2, 0);
    console.log(mousePoint)

    mousePoint.x *= SXYZ;
    mousePoint.y *= SXYZ;
    console.log(mousePoint)
    let selected = []
    for (var i = 0; i < cubeProjected.length; i++) {
        const p = cubeProjected[i];
        p.x *= SXYZ * SXYZ;
        p.y *= SXYZ * SXYZ;
        console.log(p.rr)
        if (dist2(mousePoint, p) <= p.rr * SXYZ * SXYZ) {
            selected.push(i)
        }
    }
    //means that we clicked on some point
    if (selected != 0) {
        let clickedPointIndex = selected[0]
        let nearest = cube[selected[0]]
        for (const index of selected) {
            if (dist3(c, cube[index]) < dist3(c, nearest)) {
                nearest = cube[index]
                clickedPointIndex = index
            }
        }
        cube[clickedPointIndex].clicked = true;
    }
}

function mouseDragged() {


    RX += (acos((lastMousePos.x - mouseX) / width) - 90);
    RY += -(acos((lastMousePos.y - mouseY) / height) - 90);

    lastMousePos = new Point(mouseX, mouseY)

}

function mouseWheel(event) {
    SXYZ += event.delta / 3000;
}
//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