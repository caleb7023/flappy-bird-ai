
var birds = [];
    
HEIGHT = 400 // The height of the stage (pixel)
GRAVITY = 0.1;

class bird {
    constructor (element, nn) {
        this.nn         = nn;      // the neutral network
        this.posY       = 300;     // How height from ground
        this.element    = element; // The html element of the bird
        this.gameover   = false;   // was the bird gameovered or not
        this.UpVelocity = 0;       // How much pixel will it move in a frame
        this.gameoverPosX;
    };
};

mulArray = (a, b) => { // multiply arrays

    return a.map((value, index) => value * b[index]);

};

sum = (a) => { // sum array
    return a.reduce((result, value) => result + value, 0);
};

swish = (a) => {
    return a / (Math.exp(-a) + 1)
};
class pipe {
    constructor (height) {
        this.height = height; // How height is the pipe on the ground
    };
};

jumpBird = (targetBird) => {
    targetBird.UpVelocity += 4;
};

gameProcess = () => {
    birds.forEach((targetBird) => {
        if (!targetBird.gameover) {
            targetBird.UpVelocity -= GRAVITY;               // calc gravity by subjecting the up velocity by gravity
            targetBird.posY       += targetBird.UpVelocity; // move by applying the velocity
            if (targetBird.posY < 0 || 400 < targetBird.posY) { // check is the bird touched to bottom, top or the pipe.
                targetBird.gameover = true;
                targetBird.posY     = targetBird.posY < 0 ? 0 : HEIGHT-68;
                targetBird.element.style.filter = "grayscale(1)";
            };
        };
    });
}

render = () => {

    birds.forEach((targetBird) => {
        targetBird.element.style.bottom = String(targetBird.posY) + "px";
    });

};

newNeurons = (amount, inputAmount) => {

    resultNeurons = [];
    
    for (let i=0; i < amount; i++) {
        
        weights = [];

        for (let k=0; k < inputAmount; k++) {

            weights.push(Math.random()*100 - 50)

        };

        resultNeurons.push([
            weights,               // weights
            Math.random()*100 - 50 // bias
        ]);

    };

    return(resultNeurons);

};

train = (LearningRate) => {

    birds.forEach((targetBird) => {
        if (!targetBird.gameover){
        
            input = [
                targetBird.UpVelocity,
                targetBird.posY,
                0,
                0
            ];
    
            var firstLayerOutput  = targetBird.nn[0].map((array) =>     swish(sum(mulArray(array[0], input           )) + array[1]));
            var secondLayerOutput = targetBird.nn[1].map((array) => Math.tanh(sum(mulArray(array[0], firstLayerOutput)) + array[1]));
            var thirdLayerOutput  = sum(mulArray(targetBird.nn[2][0][0], secondLayerOutput)) + targetBird.nn[2][0][1]

            if (0 < thirdLayerOutput){jumpBird(targetBird)};

        };

    });

};

main = () => {

    for (let i=0; i < 128; i++) { // generate birds
        birdElement_temp = document.createElement("img");
        birdElement_temp.setAttribute("src", "./Imgs/bird.png");
        birdElement_temp.style.bottom = "300px";
        birdElement = document.getElementById("birds").appendChild(birdElement_temp);
        birds.push(new bird(birdElement, [
            newNeurons(32, 4 ), // first layer's neurons
            newNeurons(8 , 32), // second layer's neurons
            newNeurons(1 , 8 )  // output's neuron
        ]));
    };
    
    delete birdElement_temp;

         /* set the newuron's value */
    firstLayerNeurons  = newNeurons(32, 4 );
    secondLayerNeurons = newNeurons(8 , 32);
    outputNeuron       = newNeurons(1 , 8 );

    setInterval(() => { // process & render

        train(0.01);

        gameProcess();

        render();

    }, 15);

};

window.addEventListener("load", main);