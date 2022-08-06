import { initRouter } from "./route";
import { textComponent } from "./components/text/texts";
import { buttonComponent } from "./components/button/button";
import { handsComponent } from "./components/hands/hands";
import { counterComponent } from "./components/initial-counter/counter";
import { starComponent } from "./components/result-star/star";
import { scoreComponent } from "./components/score/score";
function main() {
    textComponent();
    buttonComponent();
    handsComponent();
    counterComponent();
    starComponent();
    scoreComponent();
    //background image for root container
    const rootEl = document.querySelector(".root");
    initRouter(rootEl);
}

main();
