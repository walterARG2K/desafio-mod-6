import { state } from "../../state";
import { handWinner } from "../results/results";

var auxiliarContainerHands;
var goTo;
export function initPlay(params) {
    goTo = params;
    const div = document.createElement("div");
    div.innerHTML = `
    <counter-custom></counter-custom>
    <hands-custom></hands-custom>
    `;
    //@ts-ignore
    const imageURL = require("url:../../images/fondo.svg");
    //@ts-ignore
    document.querySelector(".root").style.backgroundImage = `url(${imageURL})`;

    window.onpopstate = function () {
        if (location.pathname.includes("/instructions/ready")) {
            state.playerOnline(false);
            params.goTo(location.pathname);
        }
    };

    return div;
}

export function handsOnClickStyle(handsContainer) {
    //style when status change
    auxiliarContainerHands = handsContainer;
    const style = document.createElement("style");
    style.textContent = `
        @keyframes handMovePc{
        from { 
        bottom:200px;
        }

        to{        
            bottom:20px;
        }
    }

    @keyframes moveUp{
        from { 
        bottom:0px;
        }

        to{        
            bottom:80px;
        }
    }

    @keyframes handMovePlayer{
        from { 
        bottom:-200px;
        }

        to{        
            bottom:-20px;
        }


    `;
    //append child
    handsContainer.appendChild(style);

    //call method subscribe
    state.subscribe(() => {
        let lastState = state.getState();
        let handsEls = handsContainer.childNodes;

        //hand styles and animation
        if (lastState.myPlay == 0) {
            handsEls[0].lastChild.setAttribute(
                "style",
                `animation: moveUp 0.5s linear; position:relative; bottom:80px`
            );
            handsEls[1].lastChild.setAttribute("style", "opacity:50%");
            handsEls[2].lastChild.setAttribute("style", "opacity:50%");
        } else if (lastState.myPlay == 1) {
            handsEls[1].lastChild.setAttribute(
                "style",
                `animation: moveUp 0.5s linear; position:relative; bottom:80px`
            );
            handsEls[0].lastChild.setAttribute("style", "opacity:50%");
            handsEls[2].lastChild.setAttribute("style", "opacity:50%");
        } else if (lastState.myPlay == 2) {
            handsEls[2].lastChild.setAttribute(
                "style",
                `animation: moveUp 0.5s linear; position:relative; bottom:80px`
            );
            handsEls[1].lastChild.setAttribute("style", "opacity:50%");
            handsEls[0].lastChild.setAttribute("style", "opacity:50%");
        }
    });
}

export function pageHandUserAndPc() {
    let lastState = state.getState();
    let handsEls = auxiliarContainerHands.childNodes;
    let cloneHandsContainer = auxiliarContainerHands.cloneNode(true);
    let handsCloned = cloneHandsContainer.childNodes;

    //set attribute for container
    cloneHandsContainer.setAttribute(
        "style",
        "display:flex;flex-direction:column; align-items:center;"
    );

    //show myPlay in screen
    if (lastState.myPlay == 0) {
        handWinner(handsEls[0].lastChild, handsCloned[lastState.computerPlay].lastChild);

        handsEls[0].lastChild.setAttribute(
            "style",
            `animation: handMovePlayer 1s linear; position:relative; bottom:-20px; width:150px; height:343px;`
        );
        handsEls[1].setAttribute("style", "display:none");
        handsEls[2].setAttribute("style", "display:none");
    } else if (lastState.myPlay == 1) {
        handWinner(handsEls[1].lastChild, handsCloned[lastState.computerPlay].lastChild);
        handsEls[1].lastChild.setAttribute(
            "style",
            `animation: handMovePlayer 1s linear; position:relative; bottom:-20px; width:150px; height:343px;`
        );
        handsEls[0].setAttribute("style", "display:none");
        handsEls[2].setAttribute("style", "display:none");
    } else if (lastState.myPlay == 2) {
        handWinner(handsEls[2].lastChild, handsCloned[lastState.computerPlay].lastChild);
        handsEls[2].lastChild.setAttribute(
            "style",
            `animation: handMovePlayer 1s linear; position:relative; bottom:-30px; width:170px; height:343px;`
        );
        handsEls[1].setAttribute("style", "display:none");
        handsEls[0].setAttribute("style", "display:none");
    }

    //show computerPlay in screen
    let rootElement = document.querySelector(".root");
    rootElement?.appendChild(cloneHandsContainer);

    if (lastState.computerPlay == 0) {
        handsCloned[0].lastChild.setAttribute(
            "style",
            `animation: handMovePc 1s linear; position:relative; bottom:20px; width:150px; height:343px; transform: rotate(180deg); opacity:100%`
        );
        handsCloned[1].setAttribute("style", "display:none");
        handsCloned[2].setAttribute("style", "display:none");
    } else if (lastState.computerPlay == 1) {
        handsCloned[1].lastChild.setAttribute(
            "style",
            `animation: handMovePc 1s linear; position:relative; bottom:20px; width:150px; height:343px; transform: rotate(180deg); opacity:100%`
        );
        handsCloned[0].setAttribute("style", "display:none");
        handsCloned[2].setAttribute("style", "display:none");
    } else if (lastState.computerPlay == 2) {
        handsCloned[2].lastChild.setAttribute(
            "style",
            `animation: handMovePc 1s linear; position:relative; bottom:30px; width:170px; height:343px; transform: rotate(180deg); opacity:100%`
        );
        handsCloned[0].setAttribute("style", "display:none");
        handsCloned[1].setAttribute("style", "display:none");
    }
    setTimeout(() => {
        state.resetState();
        goTo.goTo("/results");
    }, 2000);
}
export { goTo };
