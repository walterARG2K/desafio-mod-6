export function textComponent() {
    class Text extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            //creating Elements
            const textType = this.getAttribute("text") == "h1" ? "h1" : "p";
            const shadow = this.attachShadow({ mode: "open" });
            const style = document.createElement("style");
            const textElement = document.createElement(textType);

            //adding styles
            style.textContent = `
            .title{ 
                font-family:'Alegreya SC';
                font-size:55px;
                letter-spacing: 10px;
                color:#009048;
                padding:0 61px;
                text-align:center;
                margin:0 0 10px 0;
            }
            @media(min-width:769px){    
                .title{
                    text-align:center;
                }
                .paragraph{ 
                    text-align:center;
                    max-width:767px;
                }
            }
            .paragraph{ 
                font-family:"Inconsolata";
                font-size:32px;
                font-weight:700;
                text-align:center;
                padding:0 27px;
                margin: 0;
            }
            `;

            //adding attributes
            textElement.classList.add(textType == "h1" ? "title" : "paragraph");

            var counter = this.childNodes.length;
            while (counter) {
                counter--;
                textElement.appendChild(this.childNodes[0]);
            }

            //appendchilds
            shadow.appendChild(style);
            shadow.appendChild(textElement);
        }
    }
    customElements.define("text-custom", Text);
}
