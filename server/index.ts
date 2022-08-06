import { realtimeDB, dataBase } from "./database";
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
//firebase
const usersDataBase = dataBase.collection("/users");
//express

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

//api methods datastore

app.post("/users/:username/:gameroom", (req, res) => {
    let userName = { [req.params.username]: 0, gameroom: req.params.gameroom };
    usersDataBase.add(userName);
    res.send("sala y usuario creados!");
});

app.put("/users/:username/:gameroom", (req, res) => {
    let userName = { [req.params.username]: 0 };
    var status;

    usersDataBase.get().then((result) => {
        result.forEach((doc) => {
            let lengthObject = Object.keys(doc.data()).length;
            let keysObject = Object.keys(doc.data());

            if (doc.data().gameroom == req.params.gameroom && lengthObject <= 2) {
                let referenceRoom = doc.ref;

                referenceRoom.update(userName);
                status = 200;
            } else if (keysObject.includes(req.params.username)) {
                status = 201;
            } else if (status == undefined) {
                status = 404;
            }
        });
        res.json(status);
    });
});

app.get("/users/:gameroom", (req, res) => {
    usersDataBase.get().then((result) => {
        var arrayObjects = [];

        result.forEach((doc) => {
            if (doc.data().gameroom == req.params.gameroom) {
                arrayObjects = Object.entries(doc.data());
            }
        });
        var arrayUsers = [];

        arrayObjects.forEach((i) => {
            if (!i.includes("gameroom")) {
                arrayUsers.push(i);
            }
        });

        const collectionUsers = [
            { [arrayUsers[0][0]]: arrayUsers[0][1] },
            {
                [arrayUsers[1][0]]: arrayUsers[1][1],
            },
        ];
        res.json(collectionUsers);
    });
});

app.put("/score/:username/:gameroom", (req, res) => {
    let user = req.params.username;

    usersDataBase.get().then((result) => {
        result.forEach((doc) => {
            if (doc.data().gameroom == req.params.gameroom) {
                let referenceRoom = doc.ref;
                let userScore = doc.data()[user];
                let updateUserScore = { [req.params.username]: parseInt(userScore) + 1 };
                referenceRoom.update(updateUserScore);
                res.send("score actualizado correctamente!");
            }
        });
    });
});

//api methods realtime Database
const gameroom = realtimeDB.ref("/gameroom");

//Crear gameroom y unirse a la misma
app.post("/gameroom/:username/:gameroom", (req, res) => {
    gameroom.get().then(async (r) => {
        var arrayRoom = [];
        r.forEach((resp) => {
            resp.val().roomId == req.params.gameroom ? arrayRoom.push(resp.key) : "";
        });

        if (arrayRoom[0]) {
            const roomRef = realtimeDB.ref("/gameroom/" + arrayRoom[0]);
            let userData = {
                choice: "false",
                name: req.params.username,
                online: true,
                start: false,
            };

            roomRef
                .child("/users")
                .get()
                .then((response) => {
                    var arrayNames = [];
                    response.forEach((i) => {
                        arrayNames.push(i.child("/name").val());
                    });
                    if (arrayNames.includes(req.params.username) || arrayNames.length == 2) {
                        res.send(
                            "el usuario ya existe o se ha alcanzado el máximo de usuarios permitidos"
                        );
                    } else {
                        res.send("usuario añadido al gameroom");
                        roomRef.child("/users").push(userData);
                    }
                });
        } else {
            let userData = {
                roomId: req.params.gameroom,
                users: [{ choice: "", name: req.params.username, online: true, start: false }],
            };
            gameroom.push(userData);
            res.send("gameroom y usuario creados!");
        }
    });
});

//player ha presionado "Play!"
app.put("/gameroom/:username/:gameroom/:boolean", (req, res) => {
    gameroom.get().then((resp) => {
        resp.forEach((r) => {
            if (r.val().roomId == req.params.gameroom) {
                r.child("/users").forEach((response) => {
                    if (response.val().name == req.params.username) {
                        response.child("/start").ref.set(req.params.boolean === "true");
                        res.send("jugador ha dado a empezar!");
                    }
                });
            }
        });
    });
});

//obtener nombre del rival y sala
app.get("/gameroom/:username/:gameroom", (req, res) => {
    gameroom.get().then((resp) => {
        resp.forEach((r) => {
            let friendUserKey;
            let myUserkey;
            let friendName;

            if (r.val().roomId == req.params.gameroom) {
                r.child("/users").forEach((response) => {
                    let condition = response.val().name !== req.params.username;
                    if (condition) {
                        friendUserKey = response.key;
                        friendName = response.val().name;
                    } else {
                        myUserkey = response.key;
                    }
                });

                res.json([r.key, friendUserKey, myUserkey, friendName]);
            }
        });
    });
});

//player conectado
app.put("/status/:username/:gameroom/:boolean", (req, res) => {
    gameroom.get().then((resp) => {
        resp.forEach((r) => {
            if (r.val().roomId == req.params.gameroom) {
                r.child("/users").forEach((response) => {
                    if (response.val().name == req.params.username) {
                        response.child("/online").ref.set(req.params.boolean === "true");

                        res.send("jugador está conectado!");
                    }
                });
            }
        });
    });
});

//player ha elegido una mano
app.put("/choice/:username/:gameroom/:choice", (req, res) => {
    gameroom.get().then((resp) => {
        resp.forEach((r) => {
            if (r.val().roomId == req.params.gameroom) {
                r.child("/users").forEach((response) => {
                    if (response.val().name == req.params.username) {
                        response.child("/choice").ref.set(req.params.choice);
                    }
                });
            }
        });
    });
    res.send("el jugador a elegido una opción!");
});

//enviando la mano del rival
app.get("/choice/:username/:gameroom", (req, res) => {
    gameroom.get().then((resp) => {
        resp.forEach((r) => {
            if (r.val().roomId == req.params.gameroom) {
                r.child("/users").forEach((response) => {
                    if (response.val().name == req.params.username) {
                        res.json(response.child("/choice").val());
                    }
                });
            }
        });
    });
});

const pathRef = path.join(__dirname, "..", "/build/index.html");

app.use(express.static("build"));
app.get("*", (req, res) => {
    res.sendFile(pathRef);
});

//app listener
app.listen(port, () => {
    console.log(`aplicación escuchando en el puerto ${port}`);
});
