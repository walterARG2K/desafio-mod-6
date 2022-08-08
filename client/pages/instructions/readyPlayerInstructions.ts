import { state } from "../../state";

const roomId = localStorage.getItem("roomId");
state.counter = true;

export function initInstructionsReady(params) {
    state.subscribePlay = () => {};
    const div = document.createElement("div");
    const style = document.createElement("style");

    const imageURL = require("url:../../images/fondo.svg");
    style.textContent = `
    .root{
    background-image:url(${imageURL});
    }
    `;
    div.innerHTML = `
    <div style="display:flex; justify-content: space-between;">
    <text-custom><span class="name"></span><br><span class="span" style="color:#FF6442"></span></text-custom>
    <text-custom>Sala<br><span>${roomId}</span></text-custom>
    </div>
    <div style="display:flex; align-items:center; margin-top:100px">
    <text-custom text="p">Presioná jugar
y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</text-custom>
    </div>
    <div style="padding:0 30px; margin-bottom:200px"><button-custom>Jugar!</button-custom></div>
    <hands-custom></hands-custom>
    `;

    playersReady(div, style, params);
    div.appendChild(style);
    return div;
}

async function playersReady(div, style, params) {
    await state.players().then((res) => {
        const shadowEl = document.querySelector("text-custom")!;
        const friendEl = shadowEl.shadowRoot?.querySelector(".span");
        const nameEl = shadowEl.shadowRoot?.querySelector(".name")!;
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

        setTimeout(() => {
            const buttonEl = document.querySelector("button-custom");
            buttonEl?.addEventListener("click", () => {
                state.auxiliar = 1;
                state.playerReady(true);
                div.innerHTML = `
    <div style="display:flex; justify-content: space-between;">
    <text-custom><span class="name"></span><br><span class="span" style="color:#FF6442"></span></text-custom>
    <text-custom>Sala<br><span>${roomId}</span></text-custom>
    </div>
    <div style="margin-top:100px">
    <text-custom text="p">Esperando a que <span style="font-weight:900; color:#FF6442">${friendName}</span> presione ¡Jugar!...</text-custom>
    </div>
    <hands-custom></hands-custom>
    `;
                div.appendChild(style);
                nameEl.textContent = userName + ": " + Object.values(res.myUsername)[0];
                friendEl!.textContent = friendName + ": " + Object.values(res.friendUsername)[0];
                state.subscribeStart = () => {
                    params.goTo("/play");
                };
            });
        }, 0);
    });
    window.onpopstate = function () {
        if (location.pathname.includes("/instructions/wait")) {
            state.playerOnline(false);
            params.goTo("/welcome");
        }
    };
}
