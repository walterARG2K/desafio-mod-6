import { state } from "../../state";
var handWinUser;
var handWinPc;
const div = document.createElement("div");
function results(params) {
    const backgroundImage = document.createElement("div");
    const style = document.createElement("style");
    const containerHands = document.createElement("div");

    const winOrLost = state.whoWin.win;
    var result;
    //div style
    style.textContent = `
    .div{
    height: 100vh;
    }
    @media(min-width:769px){    
        .div{
            display:flex;
            flex-direction:column;
            justify-content:center;
        }
    }

    .containerHands{    
        display:flex;
        flex-direction:column;
        align-items:center;
    }
    `;
    div.classList.add("div");
    containerHands.classList.add("containerHands");
    //@ts-ignore
    document.querySelector(".root").style.backgroundImage = ``;
    //@ts-ignore
    const imageURL = require("url:../../images/fondo.svg");
    backgroundImage.setAttribute(
        "style",
        `position:absolute; background-image:url(${imageURL}); top:0; left:0;width: 100%;height: 100vh;z-index: -2;`
    );
    if (winOrLost == 2) {
        result = "Empate";
        div.style.backgroundColor = `rgb(106, 131, 147, 0.6)`;
    } else if (winOrLost == 1) {
        result = "Ganaste";
        div.style.backgroundColor = `rgba(13, 123, 18, 0.57)`;
    } else if (winOrLost == 3) {
        result = "Perdiste";
        div.style.backgroundColor = `rgba(137, 73, 73, 0.8)`;
    }
    // style for hands User
    let handWinnerUser = handWinUser.setAttribute(
        "style",
        "position:absolute; bottom:-20px; width:150px; height:343px;z-index:-1"
    );
    let handPaperUser = handWinUser.setAttribute(
        "style",
        "position:absolute; bottom:-20px; width:170px; height:343px;z-index:-1"
    );

    // style for hands Computer
    let handWinnerComputer = handWinPc.setAttribute(
        "style",
        "position:absolute; top:-20px; width:150px; height:343px;transform: rotate(180deg);z-index:-1"
    );
    let handPaperComputer = handWinPc.setAttribute(
        "style",
        "position:absolute; top:-20px; width:170px; height:343px;transform: rotate(180deg);z-index:-1"
    );
    //show hand
    state.getState().myPlay == 2 ? handPaperUser : handWinnerUser;
    state.getState().computerPlay == 2 ? handPaperComputer : handWinnerComputer;

    //append Child
    containerHands.appendChild(handWinUser);
    containerHands.appendChild(handWinPc);
    div.appendChild(containerHands);
    div.appendChild(style);
    div.innerHTML += `
    <star-custom>${result}</star-custom>
    <score-custom>Score</score-custom>
    <div style="display:flex;flex-direction:column;gap: 30px">
    <button-custom>Volver a Jugar</button-custom>
    </div>
    `;
    div.appendChild(backgroundImage);

    setTimeout(async () => {
        await state.playerHand("false");
        const buttonToWelcomeEl = document.querySelector("button-custom");
        let button = buttonToWelcomeEl!.shadowRoot!.querySelector("button");
        button!.addEventListener("click", async (event) => {
            event.preventDefault();
            await state.playerReady(false);
            params.goTo("/instructions/ready");
        });
    }, 0);

    window.onpopstate = function () {
        if (location.pathname.includes("/play")) {
            state.playerOnline(false);
            params.goTo("/instructions/ready");
        }
    };
}

export function initResults(params) {
    if (handWinPc && handWinUser !== undefined) {
        while (div?.firstChild) {
            div.lastChild?.remove();
        }
        results(params);
        return div;
    } else {
        const divEl = document.createElement("div");
        window.addEventListener("load", () => {
            //@ts-ignore
            const imageURL = require("url:../../images/fondo.svg");
            //@ts-ignore
            document.querySelector(".root").style.backgroundImage = `url(${imageURL})`;
            //@ts-ignore
            document.querySelector(".root").innerHTML = `
        <score-custom>Score</score-custom>
        <button-custom>Volver al inicio</button-custom>
        `;
            setTimeout(() => {
                document.querySelector("button-custom")?.addEventListener("click", () => {
                    params.goTo("/welcome");
                });
            }, 0);
        });
        return divEl;
    }
}

export function handWinner(handUser, handPc) {
    handWinUser = handUser.cloneNode(true);
    handWinPc = handPc.cloneNode(true);
}
