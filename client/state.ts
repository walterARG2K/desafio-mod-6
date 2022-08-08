import randomString from "random-string";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";
//firebase Config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_PRIVATE_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
};
//global variables
var snapshoot = false;
var friendName;

//initialize realtime database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const state = {
    handPlayed: { myPlay: "false" },
    listeners: [],
    auxiliar: 0,
    locationState: false,
    aux: 0,
    counter: false,
    subscribeStart: () => {},
    subscribePlay: () => {},
    whoWin: { win: 0 },
    getState() {
        return this.handPlayed;
    },
    setState(newState: {}) {
        this.handPlayed = newState;
    },
    resetState() {
        this.handPlayed = { myPlay: "false" };
    },
    subscribe(callback: Function) {
        this.listeners.push(callback);
    },
    async setGameroom(userName) {
        const gameroom = Math.floor(Math.random() * (10000 - 1000) + 1000);
        var x = randomString({ length: 2 }).toUpperCase();

        await fetch( `/users/${userName}/${gameroom + x}`, {
            method: "post",
        });

        await fetch( `/gameroom/${userName}/${gameroom + x}`, {
            method: "post",
        });

        localStorage.setItem("userName", userName);
        localStorage.setItem("roomId", gameroom + x);
    },
    async joinGameroom(userName, gameroom) {
        var status;
        await fetch( `/users/${userName}/${gameroom}`, {
            method: "put",
        }).then(async (res) => {
            await res.json().then((resp) => {
                if (resp == "200") {
                    fetch(`/gameroom/${userName}/${gameroom}`, {
                        method: "post",
                    });
                    localStorage.setItem("userName", userName);
                    localStorage.setItem("roomId", gameroom);
                } else if (resp == "201") {
                    fetch( `/gameroom/${userName}/${gameroom}`, {
                        method: "post",
                    });
                    localStorage.setItem("userName", userName);
                    localStorage.setItem("roomId", gameroom);
                } else if (resp == "404") {
                    status = 404;
                }
            });
        });

        return status;
    },
    async players() {
        const gameroom = localStorage.getItem("roomId");
        const userName = localStorage.getItem("userName");
        var friendName;
        var myScore;

        await fetch( `/users/${gameroom}`).then(async (res) => {
            await res.json().then((r) => {
                r.forEach((e) => {
                    Object.keys(e)[0] != userName ? (friendName = e) : (myScore = e);
                });
            });
        });
        return { myUsername: myScore, friendUsername: friendName };
    },
    async playerConnected() {
        const roomId = localStorage.getItem("roomId");
        const userName = localStorage.getItem("userName");

        await fetch( `/gameroom/${userName}/${roomId}`).then(async (res) => {
            await res.json().then((resp) => {
                const roomRef = ref(database, `gameroom/${resp[0]}/users`);
                var aux = 0;
                let playerRef = ref(database, `gameroom/${resp[0]}/users/${resp[1]}/online`);
                onValue(roomRef, () => {
                    let exist = playerRef.parent?.key;

                    if (aux == 1 && exist == "null" && this.locationState) {
                        this.subscribePlay();
                    }
                    aux == 0 ? (aux = 1) : (aux = 2);
                });

                onValue(playerRef, (snap) => {
                    snapshoot = snap.val();

                    if (snapshoot && this.aux == 0 && this.locationState) {
                        this.aux = 1;
                        this.subscribePlay();
                        off(playerRef);
                    }
                });
            });
        });
    },
    async playerOnline(boolean) {
        const userName = localStorage.getItem("userName");
        const roomId = localStorage.getItem("roomId");

        await fetch( `/status/${userName}/${roomId}/${boolean}`, {
            method: "put",
        }).then(() => {
            if (snapshoot && this.auxiliar == 0) {
                this.auxiliar = 1;
                this.subscribePlay();
            }
        });
    },
    async playerReady(boolean) {
        const userName = localStorage.getItem("userName");
        const roomId = localStorage.getItem("roomId");

        await fetch( `/gameroom/${userName}/${roomId}/${boolean}`, {
            method: "put",
        });

        await fetch( `/gameroom/${userName}/${roomId}`).then(async (res) => {
            await res.json().then((resp) => {
                let playerRef = ref(database, `gameroom/${resp[0]}/users/${resp[1]}/start`);
                let myRef = ref(database, `gameroom/${resp[0]}/users/${resp[2]}/start`);
                friendName = resp[3];
                onValue(myRef, (snap) => {
                    snap.val() ? (this.counter = true) : (this.counter = false);
                });

                onValue(playerRef, (snap) => {
                    if (snap.val() && this.counter) {
                        this.counter = false;
                        off(playerRef);
                        this.subscribeStart();
                    }
                });
            });
        });
    },
    async friendHand() {
        const gameroom = localStorage.getItem("roomId");
        const promise = await fetch( `/choice/${friendName}/${gameroom}`);
        return await promise.json();
    },
    async playerHand(choice) {
        if (choice == 0) {
            choice = "tijera";
        } else if (choice == 1) {
            choice = "piedra";
        } else if (choice == 2) {
            choice = "papel";
        }
        const username = localStorage.getItem("userName");
        const gameroom = localStorage.getItem("roomId");
        await fetch( `/choice/${username}/${gameroom}/${choice}`, {
            method: "put",
        });
    },
    animationHands() {
        for (const callback of this.listeners) {
            callback();
        }
    },
    verifyPlayerWinner() {
        const lastResult = this.getState();
        const username = localStorage.getItem("userName");
        const gameroom = localStorage.getItem("roomId");
        let myPlay = lastResult.myPlay;
        let computerPlay = lastResult.computerPlay;

        //win
        if (myPlay == 0 && computerPlay == 2) {
            fetch( `/score/${username}/${gameroom}`, {
                method: "put",
            });
            this.whoWin.win = 1;
        } else if (myPlay == 1 && computerPlay == 0) {
            fetch( `/score/${username}/${gameroom}`, {
                method: "put",
            });
            this.whoWin.win = 1;
        } else if (myPlay == 2 && computerPlay == 1) {
            fetch( `/score/${username}/${gameroom}`, {
                method: "put",
            });
            this.whoWin.win = 1;
        }

        //draw
        if (myPlay == computerPlay) {
            this.whoWin.win = 2;
        }

        //loss
        if (myPlay == 2 && computerPlay == 0) {
            this.whoWin.win = 3;
        } else if (myPlay == 0 && computerPlay == 1) {
            this.whoWin.win = 3;
        } else if (myPlay == 1 && computerPlay == 2) {
            this.whoWin.win = 3;
        }
    },
};

export { state };
