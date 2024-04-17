
class global {
    height = 200 // The height of the stage (pixel)
}

class bird {
    constructor () {
        this.posX = 100; // How height from ground
        this.UpVelocity = 0; // How much pixel will it move in a frame
    };
};

class pipe {
    constructor (height) {
        this.height = height; // How height is the pipe on the ground
    };
};