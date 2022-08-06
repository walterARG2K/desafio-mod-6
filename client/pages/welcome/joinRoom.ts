import { state } from "../../state";

export function joinRoom(params) {
    state.aux = 0;
    const div = document.createElement("div");
    div.innerHTML = `
    <text-custom text="h1">Piedra, Papel <span style="opacity:70%">ó</span> Tijera</text-custom>
    <form class="form-container">
    <input required style="font-size:32px" id="input" class="input" placeholder="Código"></input>
    <button class="button-container"><button-custom class="join-game">Ingresar a la sala</button-custom></button>
    </form>
    <hands-custom></hands-custom>
    `;
    setTimeout(() => {
        let form = document.querySelector("form");
        let input = form?.querySelector("input");

        input?.addEventListener("focus", () => {
            let hands = document.querySelector("hands-custom");
            hands?.classList.add("hidden");
        });

        input?.addEventListener("blur", () => {
            let hands = document.querySelector("hands-custom");
            hands?.classList.remove("hidden");
        });
    }, 0);

    setTimeout(() => {
        var roomId;
        const formEl = document.querySelector(".form-container");
        formEl?.addEventListener("submit", (event) => {
            event.preventDefault();
            roomId = event.target![0].value;
            // state.joinGame()
            div.innerHTML = `
    <text-custom text="h1">Piedra, Papel <span style="opacity:70%">ó</span> Tijera</text-custom>
    <form class="form-container">
    <label for="input" class="label">Tu nombre</label>
    <input required id="input" class="input" placeholder="ej: pepitoGamer777"></input>
    <button class="button-container"><button-custom class="new-game">Empezar</button-custom></button>
    </form>
    <hands-custom></hands-custom>
            `;

            function notFound() {
                div.innerHTML = `
    <text-custom text="h1">Piedra, Papel <span style="opacity:70%">ó</span> Tijera</text-custom>
    <form class="form-container">
    <text-custom text="p">Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.</text-custom>
    <button class="button-container"><button-custom class="new-game">Volver</button-custom></button>
    </form>
    <hands-custom></hands-custom>
            `;
                const buttonEl = document.querySelector(".button-container");
                buttonEl?.addEventListener("click", async (evento) => {
                    evento.preventDefault();
                    params.goTo("/welcome");
                });
            }

            const formName = document.querySelector(".form-container");
            formName?.addEventListener("submit", async (evento) => {
                evento.preventDefault();
                const status = await state.joinGameroom(evento.target![0].value, roomId);
                console.log(status);

                status !== 404 ? params.goTo("/instructions/wait") : notFound();
            });
        });
    }, 0);
    return div;
}
