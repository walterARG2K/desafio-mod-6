import { initWelcome } from "./pages/welcome/welcome";
import { initInstructions } from "./pages/instructions/instructions";
import { initInstructionsReady } from "./pages/instructions/readyPlayerInstructions";
import { initPlay } from "./pages/play/play";
import { initResults } from "./pages/results/results";
const BASE_PATH = "/desafio-m5";

function isGithubPages() {
    return location.host.includes("github.io");
}

const routes = [
    {
        path: /welcome/,
        component: initWelcome,
    },
    {
        path: /instructions\/wait/,
        component: initInstructions,
    },
    {
        path: /instructions\/ready/,
        component: initInstructionsReady,
    },
    {
        path: /play/,
        component: initPlay,
    },
    {
        path: /results/,
        component: initResults,
    },
];

export function initRouter(container: Element | null) {
    function goTo(path) {
        const completePath = isGithubPages() ? BASE_PATH + path : path;
        history.pushState({}, "", completePath);
        handleRoute(completePath);
    }

    function handleRoute(route) {
        const newRoute = isGithubPages() ? route.replace(BASE_PATH, "") : route;
        routes.forEach((i) => {
            if (i.path.test(newRoute)) {
                const page = i.component({ goTo: goTo });

                while (container?.firstChild) {
                    container.lastChild?.remove();
                }

                container?.appendChild(page);
            }
        });
    }

    if (location.pathname == BASE_PATH + "/" || "/") {
        goTo("/welcome");
    } else {
        handleRoute(location.pathname);
    }

    window.onpopstate = function (event) {
        handleRoute(location.pathname);
    };
}
