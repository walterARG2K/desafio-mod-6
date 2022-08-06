import { state } from "../../state";
import { pageHandUserAndPc } from "../../pages/play/play";
import { goTo } from "../../pages/play/play";

export function counterComponent() {
    class Counter extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            //creating Elements
            const shadow = this.attachShadow({ mode: "open" });
            const style = document.createElement("style");
            const counterBarEl = document.createElement("div");
            const barProgressCountEl = document.createElement("div");
            const secondCountEl = document.createElement("div");
            const containerEl = document.createElement("div");

            //state subscribe

            //adding styles
            let counter = 0;
            let progression = setInterval(() => {
                counter++;
                counterBarEl.style.background = `conic-gradient(#000 ${
                    counter * 3.6
                }deg,rgb(83, 82, 82) ${counter * 3.6}deg)`;
                if (counter == 100) {
                    clearInterval(progression);
                }
            }, 30);

            let counterSeconds = 3;
            secondCountEl.textContent = "3";
            let progressionCountSeconds = setInterval(async () => {
                counterSeconds--;
                secondCountEl.textContent = counterSeconds.toString();

                const isEmpty = state.getState().myPlay === "false";
                if (counterSeconds == 0) {
                    var choiceFriend = await state.friendHand();

                    if (isEmpty || choiceFriend == "false") {
                        state.auxiliar = 0;
                        state.playerReady(false);
                        await state.playerHand("false");
                        state.setState({ myPlay: "false" });
                        goTo.goTo("/instructions/ready");
                    } else {
                        let laststate = state.getState();
                        var choiceFriendNumber;
                        if (choiceFriend == "tijera") {
                            choiceFriendNumber = 0;
                        } else if (choiceFriend == "piedra") {
                            choiceFriendNumber = 1;
                        } else {
                            choiceFriendNumber = 2;
                        }
                        laststate.computerPlay = choiceFriendNumber;
                        state.setState(laststate);
                        pageHandUserAndPc();
                        state.verifyPlayerWinner();
                        containerEl.style.display = "none";
                    }
                    clearInterval(progressionCountSeconds);
                }
            }, 1000);
            style.textContent = `
            .counter{ 
                width:240px;
                height:240px;
                background-color: #000;
                border-radius:50%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .progress-bar{   
            border-radius: 50%;
            width: 192px;
            height: 192px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
            }
            .container{ 
                display:flex;
                flex-direction:column;
                align-items:center;
                padding-top:50%
            }
            @media(min-width:769px){ 
                .container{ 
                    padding-top:25%
                }
            }
            .seconds{    
                font-family: "Secular One";
                font-size: 150px;
            }
            `;

            //adding attributes
            counterBarEl.classList.add("counter");
            barProgressCountEl.classList.add("progress-bar");
            containerEl.classList.add("container");
            secondCountEl.classList.add("seconds");
            //appendchilds
            barProgressCountEl.appendChild(secondCountEl);
            counterBarEl.appendChild(barProgressCountEl);
            containerEl.appendChild(counterBarEl);
            shadow.appendChild(style);
            shadow.appendChild(containerEl);
        }
    }
    customElements.define("counter-custom", Counter);
}
