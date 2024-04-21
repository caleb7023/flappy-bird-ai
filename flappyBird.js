
HEIGHT  = 400 // The height of the stage (pixel)
GRAVITY = 0.1;

class bird {

    constructor (element, nn) {

        this.nn         = nn;      // The neutral network
        this.posY       = 300;     // How height from ground
        this.element    = element; // The html element of the bird
        this.gameover   = false;   // Was the bird gameovered or not
        this.gameoverX  = 0;       // The progress value when the gameover
        this.UpVelocity = 0;       // How much pixel will it move in a frame

    };

};

class pipe {

    constructor (posX, height, elements) {

        this.height  = height;  // How height is the pipe on the ground
        this.posX    = posX;    // The position X.
        this.elements= elements;// The html elements of the pipe

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

jumpBird = (targetBird) => { // add one to the targetBird's Upword velocity

    targetBird.UpVelocity += 4;

};

gameProcess = () => {
    
    if (progress%160 == 0) { // add pipe
        
        height = Math.random() * (HEIGHT-100);

        pipeElementBottom      = document.createElement("div");
        pipeElementTop         = document.createElement("div");
        pipeBottomHatchElement = document.createElement("div");
        pipeBottomMainElement  = document.createElement("div");
        pipeTopHatchElement    = document.createElement("div");
        pipeTopMainElement     = document.createElement("div");

        pipeElementBottom     .classList.add("pipe"     );
        pipeElementTop        .classList.add("pipe"     );
        pipeBottomHatchElement.classList.add("pipeHatch");
        pipeBottomMainElement .classList.add("pipeMain" );
        pipeTopHatchElement   .classList.add("pipeHatch");
        pipeTopMainElement    .classList.add("pipeMain" );

        pipeElementBottom.style.bottom = String(height-HEIGHT+100) + "px";
        pipeElementTop   .style.bottom = String(height       +100) + "px";
        
        pipeElementBottom.appendChild(pipeBottomHatchElement);
        pipeElementBottom.appendChild(pipeBottomMainElement );
        pipeElementTop   .appendChild(pipeTopMainElement    );
        pipeElementTop   .appendChild(pipeTopHatchElement   );

        document.getElementById("pipes").appendChild(pipeElementBottom);
        document.getElementById("pipes").appendChild(pipeElementTop   );

        pipes.push(new pipe(progress + 233, height, [pipeElementBottom, pipeElementTop]));

        if (pipes[0] instanceof pipe) {
            pipes[0].elements[0].remove();
            pipes[0].elements[1].remove();
        }

        pipes.shift();

    };

    nextPipeDistance = 2147483647;

    pipes.forEach(pipe => {

        pipeDistance = pipe.posX - progress;
        
        if (0 < pipeDistance && pipeDistance < nextPipeDistance) {
            nextPipeDistance = pipeDistance - 42;
            nextPipe         = pipe;
        };

    });

    progress++;

    birds.forEach((targetBird) => {
        if (!targetBird.gameover) {

            targetBird.UpVelocity -= GRAVITY;               // calc gravity by subjecting the up velocity by gravity
            targetBird.posY       += targetBird.UpVelocity; // move by applying the velocity

            if (targetBird.posY < 0 || 388 < targetBird.posY) { // check is the bird touching to bottom, top.

                targetBird.gameover  = true;
                targetBird.posY      = targetBird.posY < 0 ? 0 : HEIGHT-12;
                targetBird.gameoverX = progress;
                targetBird.element.style.filter = "grayscale(1)";
                fails++;

            } else if (nextPipeDistance <= 0 && (targetBird.posY < nextPipe.height || nextPipe.height+88 < targetBird.posY)) { // check is the brid touching the pipe

                targetBird.gameover  = true;
                targetBird.posY      = targetBird.posY;
                targetBird.gameoverX = progress;
                targetBird.element.style.filter = "grayscale(1)";
                fails++;

            };

        }else{

            targetBird.element.style.left = String(targetBird.gameoverX - progress + 25) + "px";

        };
    });

    if(fails==128){reset()};
};

gameover = (targetBird) => {

    targetBird.gameover  = true;
    targetBird.gameoverX = progress;
    targetBird.element.style.filter = "grayscale(1)";
    fails++;
    if (fails==127) {secoundLogestLived = targetBird}
    if (fails==128) {LogestLived        = targetBird}


};

render = () => {

    birds.forEach(targetBird => { // render birds

        targetBird.element.style.bottom = String(targetBird.posY) + "px";

    });

    pipes.forEach(pipe_ => { // render pipes

        if (pipe_ instanceof pipe) {
            pipe_.elements[0].style.left = String(pipe_.posX-progress) + "px";
            pipe_.elements[1].style.left = String(pipe_.posX-progress) + "px";
        };

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

train = () => {
    
    nextPipeHeight = nextPipe.height;

    birds.forEach((targetBird) => {
        if (!targetBird.gameover){
        
            input = [
                targetBird.UpVelocity,
                targetBird.posY,
                nextPipeDistance,
                nextPipe.height
            ];
    
            var firstLayerOutput  = targetBird.nn[0].map((array) =>     swish(sum(mulArray(array[0], input           )) + array[1]));
            var secondLayerOutput = targetBird.nn[1].map((array) => Math.tanh(sum(mulArray(array[0], firstLayerOutput)) + array[1]));
            var thirdLayerOutput  = sum(mulArray(targetBird.nn[2][0][0], secondLayerOutput)) + targetBird.nn[2][0][1];

            if (0 < thirdLayerOutput){jumpBird(targetBird)};

        };

    });

};

reset = () => {

    fails    =  0;
    pipes    = [0, 0];
    birds    = [    ];
    progress =  0;
    document.getElementById("birds").innerHTML = "";
    document.getElementById("pipes").innerHTML = "";

    for (let i=0; i < 128; i++) { // generate birds
        birdElement_temp = document.createElement("img");
        birdElement_temp.setAttribute("src", "./Imgs/bird.png");
        birdElement_temp.style.bottom = "300px";
        birdElement_temp.style.left   =  "25px";
        birdElement = document.getElementById("birds").appendChild(birdElement_temp);
        birds.push(new bird(birdElement, [
            newNeurons(32, 4 ), // first layer's neurons
            newNeurons(8 , 32), // second layer's neurons
            newNeurons(1 , 8 )  // output's neuron
        ]));
    };
    
    delete(birdElement_temp);

};

main = () => {

    reset();

    keydown = false;

    setInterval(() => { // process & render

        if (!keydown) {
            gameProcess();
            train(0.01);
            render();
        };

    }, 15);

    window.addEventListener("keydown", () => {keydown = true });
    window.addEventListener("keyup"  , () => {keydown = false});

    setInterval(() => {

        if(keydown){

            gameProcess();
            train(0.01);
            render();

        };

    }, 0);

};

window.addEventListener("load", main);