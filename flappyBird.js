
var birds = [];

class global {
    height = 400 // The height of the stage (pixel)
    GRAVITY = 1;
};

class bird {
    constructor (element) {
        this.posY       = 100;     // How height from ground
        this.element    = element; // The html element of the bird
        this.gameover   = false;   // is the bird gameovered or not
        this.UpVelocity = 0;       // How much pixel will it move in a frame
    };
};

class pipe {
    constructor (height) {
        this.height = height; // How height is the pipe on the ground
    };
};

class array_ {
    
    array;

    constructor (array) {

        this.array = array;

    };

    push (arrayOrNumber) {

        this.array.push(arrayOrNumber)

    };

    rand (shape) {

        var result = new array_([]);

        if (shape.length != 1){

            for (let i=0; i < shape[0]; i++) {
    
                result.push(
    
                    new array_().rand(shape.slice(1, shape.length))
    
                );
    
            };

        } else {

            for (let i=0; i < shape[0]; i++) {
    
                result.push(
    
                    Math.random()
    
                );
    
            };

        };
        
        return(result);

    };

    add (a) {

        var result = new array_([]);

        this.array.forEach(function (targetArrayOrNumber, index) {

            if (targetArrayOrNumber instanceof array_) {

                result.push(

                    targetArrayOrNumber.add(a.array[index])

                );

            } else {

                result.push(

                    targetArrayOrNumber + a.array[index]

                );
                
            };

        });

        return(result);

    };

    sub (a) {

        var result = new array_([]);

        this.array.forEach(function (targetArrayOrNumber, index) {

            if (targetArrayOrNumber instanceof array) {

                result.push(

                    targetArrayOrNumber.sub(a.array[index])

                );

            } else {

                result.push(

                    targetArrayOrNumber - a.array[index]

                );

            };

        });

        return(result);

    };

    mul (a) {

        var result = new array_([]);

        this.array.forEach(function (targetArrayOrNumber, index) {

            if (targetArrayOrNumber instanceof array) {

                result.push(

                    targetArrayOrNumber.mul(a.array[index])

                );

            } else {

                result.push(

                    targetArrayOrNumber*a.array[index]

                );

            };

        });

        return(result);

    };


    div (a) {

        var result = new array_([]);

        this.array.forEach(function (targetArrayOrNumber, index) {

            if (targetArrayOrNumber instanceof array) {

                result.push(

                    targetArrayOrNumber.div(a.array[index])

                );

            } else {

                result.push(

                    targetArrayOrNumber/a.array[index]

                );

            };

        });

        return(result);

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

}

window.addEventListener("load", main);