import { state } from "../../state";

export function createRoom(params) {
    const page = `
    <text-custom text="h1">Piedra, Papel <span style="opacity:70%">ó</span> Tijera</text-custom>
    <form class="form-container">
    <label for="input" class="label">Tu nombre</label>
    <input required id="input" class="input" placeholder="ej: pepitoGamer777"></input>
    <button class="button-container"><button-custom class="new-game">Empezar</button-custom></button>
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
        const formEl = document.querySelector(".form-container");
        formEl?.addEventListener("submit", async (event) => {
            event.preventDefault();
            await state.setGameroom(event.target![0].value);
            params.goTo("/instructions/wait");
        });
    }, 0);
    return page;
}
