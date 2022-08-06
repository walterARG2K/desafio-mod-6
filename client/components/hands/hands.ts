import { state } from "../../state";
import { handsOnClickStyle } from "../../pages/play/play";

export function handsComponent() {
    class Hands extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            //creating Elements
            const shadow = this.attachShadow({ mode: "open" });
            const style = document.createElement("style");
            const imgElement = document.createElement("img");
            const handsContainerEl = document.createElement("div");
            const handContainerEl = document.createElement("div");
            const containerEl = document.createElement("div");

            //adding styles
            style.textContent = `
            .hand{ 
            }
            .containerHands{ 
            display: flex;
            position:absolute;
            bottom: 10px;
            gap:85px;
            }
            .container{
                display:flex;
                flex-direction:column;
                align-items:center;
            }
            `;

            //import images
            //@ts-ignore
            const imageScissorsURL = require("url:../../images/tijera.svg");
            //@ts-ignore
            const imageRockURL = require("url:../../images/piedra.svg");
            //@ts-ignore
            const imagePaperURL = require("url:../../images/papel.svg");
            const imagesHands = [imageScissorsURL, imageRockURL, imagePaperURL];

            //adding attributes
            imgElement.classList.add("hand");
            handsContainerEl.classList.add("containerHands");
            containerEl.classList.add("container");

            //appendchilds
            let counter = 0;
            while (counter < 3) {
                //add attributes
                imgElement.setAttribute("src", imagesHands[counter]);
                imgElement.setAttribute("class", `hand-${counter}`);
                handContainerEl.setAttribute("class", `container-${counter}`);
                //clone elements
                let cloneImg = imgElement.cloneNode(true);
                let cloneContainer = handContainerEl.cloneNode(true);
                //append childs
                cloneContainer.appendChild(cloneImg);
                handsContainerEl.appendChild(cloneContainer);
                counter++;
                //passing container in another file
                onClickHand(cloneContainer);
            }
            containerEl.appendChild(handsContainerEl);
            shadow.appendChild(style);
            shadow.appendChild(containerEl);

            // subscribe state change
            handsOnClickStyle(handsContainerEl);
        }
    }
    customElements.define("hands-custom", Hands);
}

function onClickHand(handContainer: Node) {
    if (location.pathname.includes("/play")) {
        async function eventListener() {
            //@ts-ignore
            let handSelected = handContainer.attributes[0].nodeValue;
            let handSelectedNumber = parseInt(handSelected.charAt(handSelected.length - 1));

            await state.playerHand(handSelectedNumber);
            if (state.getState().myPlay == "false") {
                state.setState({ myPlay: handSelectedNumber });
                state.animationHands();
            }
        }
        handContainer.addEventListener("click", eventListener);
    }
}
