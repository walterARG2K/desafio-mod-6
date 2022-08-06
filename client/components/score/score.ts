import { state } from "../../state";

export function scoreComponent() {
    class Score extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        async render() {
            //creating Elements
            const shadow = this.attachShadow({ mode: "open" });
            const style = document.createElement("style");
            const scoreElement = document.createElement("p");
            const playerVsComputerScore = document.createElement("p");
            const containerElement = document.createElement("div");
            //adding styles
            style.textContent = `
            .score{ 
                font-family:'Secular One';
                font-size:24px;
                margin:0
            }

            .content-score, .rival-score{ 
                font-family:'Secular One';
                font-size:24px;
                margin:0;
            }

            .content-score .rival-score{    
            display:block;
            }

            .container{ 
                border: solid 6px;
                text-align: center;
                margin: 15px 50px;
                background-color: #fff;
                border-radius: 5px;
                width:240px
            }
            @media(min-width:769px){    
                .container{ 
                    margin:40px 50px;
                }
            }
            `;
            this.setAttribute("style", "display: flex;flex-direction: column;align-items: center;");

            //adding attributes
            scoreElement.classList.add("score");
            scoreElement.textContent = this.textContent;

            playerVsComputerScore.innerHTML = `<p class="content-score"></p><span class="rival-score"></span>`;
            await state.players().then((res) => {
                const nameEl = playerVsComputerScore.querySelector(".content-score")!;
                const friendEl = playerVsComputerScore.querySelector(".rival-score");
                const userName =
                    Object.keys(res.myUsername)[0].length > 7
                        ? Object.keys(res.myUsername)[0].slice(0, 7)
                        : Object.keys(res.myUsername)[0];

                const friendName =
                    Object.keys(res.friendUsername)[0].length > 7
                        ? Object.keys(res.friendUsername)[0].slice(0, 7)
                        : Object.keys(res.friendUsername)[0];
                nameEl.textContent = userName + ": " + Object.values(res.myUsername)[0];
                friendEl!.textContent = friendName + ": " + Object.values(res.friendUsername)[0];
            });
            containerElement.classList.add("container");
            //appendchilds
            containerElement.appendChild(scoreElement);
            containerElement.appendChild(playerVsComputerScore);
            shadow.appendChild(style);
            shadow.appendChild(containerElement);
        }
    }
    customElements.define("score-custom", Score);
}
