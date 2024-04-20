
var birds = [];

class global {
    height = 400 // The height of the stage (pixel)
    GRAVITY = 1;
};

class bird {
    constructor (element) {
        this.posY       = 100;     // How height from ground
        this.element    = element; // The html element of the bird
        this.gameover   = false;   // was the bird gameovered or not
        this.UpVelocity = 0;       // How much pixel will it move in a frame
    };
};

mulArray = function (a, b) { // multiply arrays

    return a.map((value, index) => value * b[index]);

};

sum = function (a) { // sum array
    return a.reduce((result, value) => result + value, 0);
};

swish = function (a) {
    return a / (Math.exp(-a) + 1)
};
class pipe {
    constructor (height) {
        this.height = height; // How height is the pipe on the ground
    };
};

calcGravity = function () {
    birds.forEach(function (targetBird) {
        targetBird.UpVelocity -= global.GRAVITY; // calc gravity by subjecting the up velocity by gravity
    });
};

moveBird = function () {
    birds.forEach(function (targetBird) {
        targetBird.posY += targetBird.UpVelocity; // move by applying the velocity
    });
};

collisionCheck = function (targetBird) {
    return false;
};

collisionCheckBird = function () {
    birds.forEach(function (targetBird) {
        targetBird.gameover = collisionCheck(targetBird); // check is the bird touched to bottom, top or the pipe.
    });
};

render = function () {
    calcGravity();
    calcMove();
    collisionCheckBird();
}

main = function () {

    for (let i=0; i < 128; i++){ // generate birds
        birdElement_temp = document.createElement("img")
        birdElement_temp.setAttribute("src", "./Imgs/bird.png");
        birdElement = document.getElementById("birds").appendChild(birdElement_temp);
        delete birdElement_temp;
        birds.push([new bird(birdElement)]);
    };

};

window.addEventListener("load", main);