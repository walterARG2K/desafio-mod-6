export function starComponent() {
    class Star extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            //creating Elements
            const shadow = this.attachShadow({ mode: "open" });
            const style = document.createElement("style");
            const starEl = document.createElement("img");
            const textEl = document.createElement("div");
            const containerElement = document.createElement("div");
            //adding styles
            style.textContent = `
            .star{ 
                width:300px;
            }

            .text{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 50px;
                color:#fff;
                font-family:"Secular One"
            }

            .container{ 
            padding:10px 35px 0;
            position:relative;
            text-align:center;
            }
            `;
            //win or loss star
            if (this.textContent == "Ganaste") {
                //@ts-ignore
                const imageURL = require("url:../../images/ganaste.svg");
                starEl.setAttribute("src", imageURL);
            } else if (this.textContent == "Perdiste") {
                //@ts-ignore
                const imageURL = require("url:../../images/perdiste.svg");
                starEl.setAttribute("src", imageURL);
            } else if (this.textContent == "Empate") {
                //@ts-ignore
                const imageURL = require("url:../../images/empate.svg");
                starEl.setAttribute("src", imageURL);
            }
            //adding attributes
            starEl.classList.add("star");
            textEl.classList.add("text");
            textEl.textContent = this.textContent;
            containerElement.classList.add("container");
            //appendchilds
            containerElement.appendChild(starEl);
            containerElement.appendChild(textEl);
            shadow.appendChild(style);
            shadow.appendChild(containerElement);
        }
    }
    customElements.define("star-custom", Star);
}
