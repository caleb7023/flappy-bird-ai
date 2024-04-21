
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



xorshift = () => {
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
        }else{
            // scroll the dead bird
            targetBird.element.style.left = String(targetBird.gameoverX - progress + 25) + "px"
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
    })
    pipes.forEach(pipe_ => { // render pipes
        if (pipe_ instanceof pipe) {
            pipe_.elements[0].style.left = String(pipe_.posX-progress) + "px"
            pipe_.elements[1].style.left = String(pipe_.posX-progress) + "px"
        }
    })
}



newNeurons = (inputOutputAmounts) => {
    resultNeurons = []
    for (let i=1; i < inputOutputAmounts.length; i++) {
        resultNeurons.push([])
        for (let j=0; j < inputOutputAmounts[i]; j++) {
            resultNeurons[i-1].push([])
            weights = []
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



generateNeuronsBetween = (nn1, nn2, neuronMutationRate) => {
    resultNeurons = []
    for (let i=0; i < nn1.length ;i++) {
        weights = []
        for (let k=0; k < nn1[i].length; k++) {
            minNeuronWeight  = Math.min(nn1[i][0][k] , nn2[i][0][k])
            NeuronWeightDiff = Math.abs(nn1[i][0][k] - nn2[i][0][k])
            if (Math.random() < neuronMutationRate) {
                weight = Math.random()*5 - 2.5
            } else {
                weight = minNeuronWeight + NeuronWeightDiff*Math.random() + 0.5 - Math.random()
            }
            weights.push(weight)
        }
        minNeuronBias  = Math.min(nn1[i][1] , nn2[i][1])
        NeuronBiasDiff =          nn1[i][1] - nn2[i][1] 
        bias = minNeuronBias + Math.abs(NeuronBiasDiff*Math.random())
        resultNeurons.push([
            weights, // weights
            bias     // bias
        ])
    }
    return(resultNeurons)
}



neuronTweak = (nn, error) => {
    resultNeurons = []
    for (let i=0; i < nn.length; i++) {
        weights = []
        for (let k=0; k < nn[i].length; k++) {
            weight = nn[i][0][k] + Math.random()*error - error*0.5
            weights.push(weight)
        }
        bias = nn[i][1] + Math.random()*error - error*0.5
        resultNeurons.push([
            weights, // weights
            bias     // bias
        ])
    }
    return(resultNeurons)
}



train = () => {
    nextPipeHeight = nextPipe.height
    birds.forEach((targetBird) => {
        if (!targetBird.gameover){
            input = [
                targetBird.UpVelocity,
                targetBird.posY,
                nextPipeDistance,
                nextPipe.height - targetBird.posY
            ]
            var firstLayerOutput  = targetBird.nn[0].map((array) =>   swish(sum(mulArray(array[0], input           )) + array[1]))
            var secondLayerOutput = targetBird.nn[1].map((array) => sigmoid(sum(mulArray(array[0], firstLayerOutput)) + array[1]))
            var thirdLayerOutput  = sum(mulArray(targetBird.nn[2][0][0], secondLayerOutput)) + targetBird.nn[2][0][1]
            if (0 < thirdLayerOutput){jumpBird(targetBird)}
        }
    })
}



reset = (firstTime) => {
    fails    =  0
    pipes    = [0, 0]
    birds    = [    ]
    progress =  0
    randomNumberResult = pipeSeed
    document.getElementById("birds").innerHTML = ""
    document.getElementById("pipes").innerHTML = ""
    for (let i=0; i < BIRD_COUNT; i++) { // generate birds
        birdElement_temp = document.createElement("img")
        birdElement_temp.setAttribute("src", "./Imgs/bird.png")
        birdElement_temp.style.bottom = "300px"
        birdElement_temp.style.left   =  "25px"
        birdElement = document.getElementById("birds").appendChild(birdElement_temp)
        isClone = false
        if      (firstTime       ) {neurons = newNeurons([4, 32, 8, 1])}
        else if (BIRD_COUNT-3 < i) {
            neurons = BIRD_COUNT-2 == i ? longestLived.nn : secoundLongestLived.nn
            isClone = true
            birdElement.style.opacity = "0.5"
        } else if (BIRD_COUNT-13 < i) {
            neurons = [
                neuronTweak(longestLived.nn[0], 0),
                neuronTweak(longestLived.nn[1], 0),
                neuronTweak(longestLived.nn[2], 0),
            ]
        } else {
            neurons = [
                generateNeuronsBetween(longestLived.nn[0], secoundLongestLived.nn[0], 0.1), // first layer's neurons
                generateNeuronsBetween(longestLived.nn[1], secoundLongestLived.nn[1], 0.1), // second layer's neurons
                generateNeuronsBetween(longestLived.nn[2], secoundLongestLived.nn[2], 0.1)  // output's neuron
            ]
        }
        birds.push(new bird(birdElement, neurons, isClone))
    }
    delete(birdElement_temp)
}



main = () => {
    pipeSeed = Math.random() * 2147483647
    keydown = false
    reset(true)
    window.addEventListener("keydown", () => keydown = true )
    window.addEventListener("keyup"  , () => keydown = false)
    setInterval(() => { // process & render
        if (!keydown) {
            gameProcess()
            train ()
            render()
        }
    }, 15)
    setInterval(() => {
        if(keydown){
            gameProcess()
            train ()
            render()
        }
    }, 0)
}



window.addEventListener("load", main)