export function buttonComponent() {
    class Button extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            //creating Elements
            const shadow = this.attachShadow({ mode: "open" });
            const style = document.createElement("style");
            const buttonElement = document.createElement("button");
            const containerElement = document.createElement("div");
            //adding styles
            style.textContent = `
            .button, .score-button{ 
                font-family:'Secular One';
                font-size:27px;
                font-weight:700;
                letter-spacing:2px;
                color:#fff;
                background-color:#006CFC;
                border:solid 10px #001997;
                border-radius:2px;
                width:100%;
                margin: 0px;
                position:relative;
                max-width:400px;
            }
            .score-button{  
                border:solid 10px #5b1f1f;
                background-color:#C62222;
                font-size: 25px;
            }

            .container{ 
            display:flex;
            flex-direction:column;
            align-items:center;
            }
            `;

            //adding attributes
            const typeButton =
                this.getAttribute("type") == "score-button" ? "score-button" : "button";
            buttonElement.classList.add(typeButton);
            buttonElement.textContent = this.textContent;
            containerElement.classList.add("container");
            //appendchilds
            containerElement.appendChild(buttonElement);
            shadow.appendChild(style);
            shadow.appendChild(containerElement);
        }
    }
    customElements.define("button-custom", Button);
}
