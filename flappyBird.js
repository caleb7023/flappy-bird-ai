GRAVITY = 1;

var birds = [];

for (let i=0; i<=128; i++) {
    birds.push(bird());
};

class global {
    height = 200 // The height of the stage (pixel)
};

class bird {
    constructor (element) {
        this.posY = 100; // How height from ground
        this.UpVelocity = 0; // How much pixel will it move in a frame
        this.element = element; // The html element of the bird
    };
};

class pipe {
    constructor (height) {
        this.height = height; // How height is the pipe on the ground
    };
};

calcGravity = function () {
    birds.forEach(function (targetBird) {
        targetBird.UpVelocity -= GRAVITY; // calc gravity by subjecting the up velocity by gravity
    });
};

moveBird = function () {
    birds.forEach(function (targetBird) {
        targetBird.posY += targetBird.UpVelocity; // move by applying the velocity
    });
};