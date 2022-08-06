import { state } from "../../state";
import { createRoom } from "./createRoom";
import { joinRoom } from "./joinRoom";

export function initWelcome(params) {
    state.locationState = false;
    state.aux = 0;
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.innerHTML = `
    <text-custom text="h1">Piedra, Papel <span style="opacity:70%">ó</span> Tijera</text-custom>
    <div class="button-container-div">
    <button-custom class="new-game">Nuevo Juego</button-custom>
    <button-custom class="join-game">Ingresar a una sala</button-custom>
    </div>
    <hands-custom></hands-custom>`;
    //@ts-ignore
    const imageURL = require("url:../../images/fondo.svg");
    //@ts-ignore
    style.textContent = `
    .form-container{   
        display:flex;
        flex-direction:column;
        align-items:center;
        width:100%;
        gap:15px;
        padding:0 30px;
    }
    .button-container{  
        width: 100%;
        padding: 0;
        margin: 0 30px;
        max-width: 400px;
        border:none;
}
    
    .label{ 
        font-family: 'Secular One';
        font-size: 27px;
        font-weight: 500;
    }

    .input{
        height: 50px;
        width: 100%;
        max-width: 400px;
        outline: none;
        padding: 10px;
        font-size: 18px;
        font-weight: 700;
        text-align:center;
    }

    .root{
    background-image:url(${imageURL});
    }
    .button-container-div{  
        display:flex;
        flex-direction:column;
        gap:10px;
        padding: 0 30px;
        width:100%
    }

    .container{ 
        display:flex;
        flex-direction:column;
        align-items:center;
    }

    @media(min-width:769px){    
    .root{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    }
    }
    @media(max-height:500px){
        .hidden{
    display:none;
}
    }
    }`;
    div.appendChild(style);
    div.classList.add("container");
    //eventListener click Button
    setTimeout(() => {
        const buttonCreateGame = document.querySelector(".new-game");
        buttonCreateGame?.addEventListener("click", (event) => {
            event.preventDefault();
            div.innerHTML = createRoom(params);
            div.appendChild(style);
        });

        const buttonJoinGame = document.querySelector(".join-game");
        buttonJoinGame?.addEventListener("click", (event) => {
            event.preventDefault();
            while (div.lastChild) {
                div.firstChild?.remove();
            }
            div.appendChild(joinRoom(params));
            div.appendChild(style);
        });
    }, 0);
    return div;
}
