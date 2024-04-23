
HEIGHT  = 400 // The height of the stage (pixel)
GRAVITY = 0.1
BIRD_COUNT = 512



class bird {
    constructor (element, nn, isClone) {
        this.nn         = nn      // The neutral network
        this.posY       = 300     // How height from ground
        this.isClone    = isClone // Is the bird clone of the best bird or not
        this.element    = element // The html element of the bird
        this.gameover   = false   // Was the bird gameovered or not
        this.gameoverX  = 0       // The progress value when the gameover
        this.UpVelocity = 0       // How much pixel will it move in a frame
    }
}



class pipe {
    constructor (posX, height, elements) {
        this.height  = height  // How height is the pipe on the ground
        this.posX    = posX    // The position X.
        this.elements= elements// The html elements of the pipe
    }
}



mulArray = (a, b) => {
    // multiply arrays
    return a.map((value, index) => value * b[index])
}



sum = (a) => {
    // sum array
    return a.reduce((result, value) => result + value, 0)
}



swish = (a) => {
    return a / sigmoid(a)
}



sigmoid = (a) => {
    return 1 / (Math.exp(-a) + 1)
}



jumpBird = (targetBird) => {
    // add one to the targetBird's Upword velocity
    targetBird.UpVelocity += 4
}



xorshift = () => { // random number generator
    randomNumberResult ^= randomNumberResult <<  7
    randomNumberResult ^= randomNumberResult >>> 9
    return(randomNumberResult)
}



gameProcess = () => {
    if (progress%160 == 0) { // add pipe
        height = Math.abs(xorshift() % (HEIGHT-100))
        // create the pipe's html element
        pipeElementBottom      = document.createElement("div")
        pipeElementTop         = document.createElement("div")
        pipeBottomHatchElement = document.createElement("div")
        pipeBottomMainElement  = document.createElement("div")
        pipeTopHatchElement    = document.createElement("div")
        pipeTopMainElement     = document.createElement("div")
        // add class to the html element that was created
        pipeElementBottom     .classList.add("pipe"     )
        pipeElementTop        .classList.add("pipe"     )
        pipeBottomHatchElement.classList.add("pipeHatch")
        pipeBottomMainElement .classList.add("pipeMain" )
        pipeTopHatchElement   .classList.add("pipeHatch")
        pipeTopMainElement    .classList.add("pipeMain" )
        // set the pos of the pipe
        pipeElementBottom.style.bottom = String(height-HEIGHT+100) + "px"
        pipeElementTop   .style.bottom = String(height       +100) + "px"
        // combie the pipe's parts
        pipeElementBottom.appendChild(pipeBottomHatchElement)
        pipeElementBottom.appendChild(pipeBottomMainElement )
        pipeElementTop   .appendChild(pipeTopMainElement    )
        pipeElementTop   .appendChild(pipeTopHatchElement   )
        // add to the document
        document.getElementById("pipes").appendChild(pipeElementBottom)
        document.getElementById("pipes").appendChild(pipeElementTop   )
        // create the pipe object
        pipes.push(new pipe(progress + 233, height, [pipeElementBottom, pipeElementTop]))
        // remove the last pipe to prvent html elements overflowing
        if (pipes[0] instanceof pipe) {
            pipes[0].elements[0].remove()
            pipes[0].elements[1].remove()
        }
        // shift the last pipe cus it doesnt need to exist
        pipes.shift()
    }
    nextPipeDistance = 2147483647
    // get the next pipe that the birds gonna head
    pipes.forEach(pipe => {
        // get the distance between the birds and the pipe
        pipeDistance = pipe.posX - progress
        // check is the pipe is closer for the birds to hit
        if (0 < pipeDistance && pipeDistance < nextPipeDistance) {
            nextPipeDistance = pipeDistance - 42
            nextPipe         = pipe
        }
    })
    // add progress (scroll)
    progress++
    birds.forEach((targetBird) => {
        if (!targetBird.gameover) {
            // calc gravity by subjecting the up velocity by gravity
            targetBird.UpVelocity -= GRAVITY
            // move by applying the velocity
            targetBird.posY       += targetBird.UpVelocity
            // check is the bird touching to bottom or top.
            if (targetBird.posY < 0 || 388 < targetBird.posY) {
                // when the birds touches the bottom of the screen or the top
                gameover_(targetBird)
                targetBird.posY = targetBird.posY < 0 ? 0 : HEIGHT-12

            } else if (nextPipeDistance <= 0 && (targetBird.posY < nextPipe.height || nextPipe.height+88 < targetBird.posY)) {
                // when the brid touches a pipe
                gameover_(targetBird)
                targetBird.posY = targetBird.posY

            }
        }
    })
    // reset the birds when the last bird dies
    if(fails==BIRD_COUNT){reset(false)}
}



gameover_ = (targetBird) => {
    targetBird.gameover  = true
    targetBird.gameoverX = progress
    // grayscale the bird to tell that the bird is dead
    targetBird.element.style.filter = "grayscale(1)"
    // add to the death cound
    fails++
    // save if the bird was the secound or the longest lived on the round
    if (fails==BIRD_COUNT-1) {secoundLongestLived = targetBird}
    if (fails==BIRD_COUNT  ) {longestLived        = targetBird}
}



render = () => {
    birds.forEach(targetBird => { // render birds
        targetBird.element.style.bottom = String(targetBird.posY) + "px"
        if (targetBird.gameover) {
            targetBird.element.style.left = String(targetBird.gameoverX - progress + 25) + "px" // scroll the dead bird
        }
    })
    pipes.forEach(pipe_ => { // render pipes
        if (pipe_ instanceof pipe) {
            pipe_.elements[0].style.left = String(pipe_.posX-progress) + "px"
            pipe_.elements[1].style.left = String(pipe_.posX-progress) + "px"
        }
    })
    document.getElementById("score"     ).innerHTML = progress
    document.getElementById("generation").innerHTML = generation
    if (bestProgress < progress) {
        bestProgress = progress
        document.getElementById("bestScore").innerHTML = bestProgress
    }
}


// crate a new neural network with random weights and biases
newNeurons = (inputOutputAmounts) => {
    resultNeurons = [] // create a new neural network
    for (let i=1; i < inputOutputAmounts.length; i++) {
        resultNeurons.push([]) // push a new neuron array
        for (let j=0; j < inputOutputAmounts[i]; j++) {
            resultNeurons[i-1].push([]) // create the array to store the neuron's weights and biases
            weights = [] // create the array to store the neuron's weights
            for (let k=0; k < inputOutputAmounts[i-1]; k++) {
                weight = Math.random()*5 - 2.5;
                weights.push(weight)
            }
            bias = Math.random()*5 - 2.5
            resultNeurons[i-1][j] = [weights, bias]
        }
    }
    return(resultNeurons)
}


// create a new neural network with random change weight and bias chaging and shuffle the two weights and biases
generateNeuronsBetween = (nn1, nn2, neuronMutationRate) => {
    resultNeurons = [] // create a new neural network
    for (let i=0; i < nn1.length; i++) {
        resultNeurons.push([]) // create a new neuron array
        for (let j=0; j < nn1[i].length; j++) {
            resultNeurons[i].push([]) // create the array to store the neuron's weights and biases
            weights = [] // create the array to store the neuron's weights
            for (let k=0; k < nn1[i][j][0].length; k++) {
                if (Math.random() < neuronMutationRate) { // mute the weight if the random number is less than the mutation rate
                    weight = Math.random()*5 - 2.5 // mutate the weight
                } else {
                    weight = Math.random() < 0.5 ? nn1[i][j][0][k] : nn2[i][j][0][k] // shuffle the weight
                }
                weights.push(weight) // push the weight into the neuron array
            }
            if (Math.random() < neuronMutationRate) { // mute the bias if the random number is less than the mutation rate
                bias = Math.random()*5 - 2.5 // mute the bias
            } else {
                bias = Math.random() < 0.5 ? nn1[i][j][1] : nn2[i][j][1] // shuffle the bias
            }
            resultNeurons[i][j] = [weights, bias] // push the bias into the neuron array
        }
    }
    return(resultNeurons)
}



processBirdsNeuralNetwork = () => {
    nextPipeHeight = nextPipe.height
    birds.forEach((targetBird) => { // calculate the neural network's input and output
        if (!targetBird.gameover){ // if the bird is not dead
            input = [ // set the neural network's input
                targetBird.UpVelocity, // up word velocity
                targetBird.posY, // bird's y position
                nextPipeDistance, // distance to the next pipe
                nextPipe.height - targetBird.posY // bird's y position - pipe's y position
            ]
            var firstLayerOutput  = targetBird.nn[0].map((array) =>   swish(sum(mulArray(array[0], input           )) + array[1])) // calculate the first layer output
            var secondLayerOutput = targetBird.nn[1].map((array) => sigmoid(sum(mulArray(array[0], firstLayerOutput)) + array[1])) // calculate the second layer output
            var thirdLayerOutput  = sum(mulArray(targetBird.nn[2][0][0], secondLayerOutput)) + targetBird.nn[2][0][1] // calculate the third layer output
            if (0 < thirdLayerOutput){jumpBird(targetBird)} // jump the bird if the third layer output is positive
        }
    })
}



reset = (firstTime) => {
    fails    =  0 // reset the death counter
    pipes    = [0, 0] // reset the pipe count
    birds    = [    ] // reset the birds
    progress =  0 // reset the progress
    generation++; // increase the generation counter
    bestProgress = Math.max(bestProgress, progress) // calulate the best progress
    document.getElementById("bestScore").innerHTML = bestProgress // update the best progress on the screen
    randomNumberResult = pipeSeed // reset the random number generator
    document.getElementById("birds").innerHTML = "" // remove all bird's html element
    document.getElementById("pipes").innerHTML = "" // remove all pipe's html elements
    for (let i=0; i < BIRD_COUNT; i++) { // generate birds
        birdElement_temp = document.createElement("img") // create a new bird's html element
        birdElement_temp.setAttribute("src", "./Imgs/bird.png") // set the bird's image
        birdElement_temp.style.bottom = "300px" // set the bird's y position
        birdElement_temp.style.left   =  "25px" // set the bird's x position
        birdElement = document.getElementById("birds").appendChild(birdElement_temp) // add the bird's html element to the birds html element
        isClone = false // set the clone variable to false
        if (firstTime) { // if it's the first generation
            neurons = newNeurons([4, 32, 8, 1]) // create a new random neural network
        }
        else if (BIRD_COUNT-3 < i) {
            neurons = BIRD_COUNT-2 == i ? longestLived.nn : secoundLongestLived.nn // create a clone of the best birds neural network
            isClone = true // set the clone variable to true cus we cloned it in the last code
        } else {
            neurons = generateNeuronsBetween(longestLived.nn, secoundLongestLived.nn, Math.random() * 0.04) // create a new neural network between the best and the secound best birds with  a random mutation rate
        }
        birds.push(new bird(birdElement, neurons, isClone)) // add the new bird to the birds array
    }
    delete(birdElement_temp) // remove the temp bird's html element
}



main = () => {
    generation = 0 // reset the generation counter
    bestProgress = 0 // reset the best progress
    pipeSeed = Math.random() * 2147483647 // set a random seed for pipe generation
    keydown = false // set the keydown variable to false
    reset(true) // reset the game
    window.addEventListener("keydown", () => keydown = true ) // add a keydown event listener
    window.addEventListener("keyup"  , () => keydown = false) // add a keyup event listener
    setInterval(() => { // process & render
        if (!keydown) {
            gameProcess()
            processBirdsNeuralNetwork()
            render()
        }
    }, 15)
    setInterval(() => {
        if(keydown){
            gameProcess()
            processBirdsNeuralNetwork()
            render()
        }
    }, 0)
}



window.addEventListener("load", main)

//323157714.4525343