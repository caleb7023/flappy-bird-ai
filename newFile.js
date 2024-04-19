import { bird, birds } from "./flappyBird";

main = function () {

    for (let i = 0; i < 128; i++) { // generate birds
        birdElement_temp = document.createElement("img");
        birdElement_temp.setAttribute("src", "./Imgs/bird.png");
        birdElement = document.getElementById("birds").appendChild(birdElement_temp);
        delete birdElement_temp;
        birds.push([new bird(birdElement)]);
    };

};
