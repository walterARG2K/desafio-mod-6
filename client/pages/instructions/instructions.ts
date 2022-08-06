import { state } from "../../state";

export function initInstructions(params) {
    state.locationState = true;
    (async () => {
        await state.playerOnline(true);
    })();
    const roomId = localStorage.getItem("roomId");
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.innerHTML = `
    <div style="display:flex; justify-content: space-between;">
    <text-custom><span class="name"></span><br><span class="span" style="color:#FF6442"></span></text-custom>
    <text-custom>Sala<br><span>${roomId}</span></text-custom>
    </div>
    <text-custom style="margin-top:100px;margin-bottom:15px" text="p">Compartí el código: <span style="color:#FF6442; font-weight:900; font-size:40px">
    <br>
    ${roomId}
    <br>
    </span> Con tu contrincante.</text-custom>
    <div style="margin-bottom:70px"></div>
    <hands-custom></hands-custom>`;
    //@ts-ignore
    const imageURL = require("url:../../images/fondo.svg");
    //@ts-ignore
    style.textContent = `
    .container{
        display: flex;
        flex-direction: column;
        gap: 30px;
}

.name{
    text-align:left;
    font-size:20px;
}
    .root{
    background-image:url(${imageURL});
    }
    @media(min-width:769px){    
    .root{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    }
    }`;

    div.appendChild(style);
    div.classList.add("container");
    playerSates(div, params);
    return div;
}

async function playerSates(div, params) {
    //eventListener click Button
    state.subscribePlay = () => {
        while (div.lastChild) {
            div.firstChild?.remove();
        }
        params.goTo("/instructions/ready");
        return "todo correcto";
    };

    window.onpopstate = function () {
        if (location.pathname.includes("/welcome")) {
            state.playerOnline(false);
            params.goTo(location.pathname);
        }
    };
    await state.playerConnected();
}
