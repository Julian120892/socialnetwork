const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
const compression = require("compression");
const path = require("path");
const db = require("./db");
const friendstatus = require("./friendstatus");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const multer = require("multer");
const config = require("./config.json");
const uidSafe = require("uid-safe");
const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 20971520,
    },
});

app.use(compression());

// app.use(
//     cookieSession({
//         secret: "This is a secret",
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `crocs are awesome`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;

    hash(password)
        .then((hash) => {
            db.newUser(first, last, email, hash)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.redirect("/");
                })
                .catch((err) => {
                    console.log("error in db.register", err);
                    res.sendStatus(300);
                });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(300);
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.loginIn(email)
        .then(({ rows }) => {
            compare(password, rows[0].password).then((result) => {
                if (result) {
                    console.log("true");
                    req.session.userId = rows[0].id;
                    res.redirect("/");
                } else {
                    res.sendStatus(404);
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(300);
        });
});

app.post("/password/reset/start", (req, res) => {
    db.getEmail(req.body.email)
        .then(({ rows }) => {
            const secretCode = cryptoRandomString({
                length: 6,
            });
            db.addResetCode(rows[0].email, secretCode)
                .then(() => {
                    sendEmail(
                        rows[0].email,
                        secretCode,
                        "Here is your Code to reset your password"
                    )
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("error in sendEmail", err);
                            res.sendStatus(400);
                        });
                })
                .catch((err) => {
                    console.log("error in db.addResetCode", err);
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log("error in db.getEmail", err);
            res.sendStatus(400);
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { code, password, email } = req.body;
    if (!password || !email) {
        res.sendStatus(400);
    }
    console.log(code, password, email);
    hash(password).then((hash) => {
        db.verifyCode(email)
            .then(({ rows }) => {
                console.log(rows);
                if (rows[0].code === code) {
                    console.log("success", rows[0].code);
                    db.updatePassword(email, hash)
                        .then(() => {
                            console.log("successfull updated");
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("error in db.updatePassword", err);
                            res.sendStatus(400);
                        });
                } else {
                    res.sendStatus(400);
                }
            })
            .catch((err) => {
                console.log("error in db.verifyCode", err);
                res.sendStatus(400);
            });
    });
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/userData", (req, res) => {
    db.getUserData(req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error in get user data ", err);
        });
});

app.get("/user/:id/getUserData", (req, res) => {
    db.getUserData(req.query.id)
        .then(({ rows }) => {
            if (rows[0] === undefined) {
                console.error("No user Found");
                res.json({ success: false });
            } else {
                rows[0].currentId = req.session.userId;
                res.json(rows[0]);
            }
        })
        .catch((err) => {
            console.log("Error in getting Other User Data", err);
            res.sendStatus(400);
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    if (req.file) {
        const url = config.s3Url + req.file.filename;
        let id = req.session.userId;

        db.uploadProfilePic(url, id)
            .then(({ rows }) => {
                console.log(rows);
                res.json(rows);
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/updateBio", (req, res) => {
    db.updateBio(req.session.userId, req.body.draftBio)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error in updateBio", err);
            res.sendStatus(400);
        });
});

app.get("/users/search/:username", (req, res) => {
    db.findUsers(req.params.username)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error in db.findUsers", err);
            res.sendStatus(500);
        });
});

app.get("/users/most-recent", (req, res) => {
    db.getMostRecentUsers()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in db getMostRecentUseres", err);
            res.sendStatus(500);
        });
});

app.get("/friendship-status/:otherUserId", (req, res) => {
    let id = req.session.userId;
    let otherUserId = Number(req.params.otherUserId);
    console.log("request to friendship status", otherUserId, id);

    friendstatus
        .getFriendshipStatus(id, otherUserId)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getFriendshipStatus", err);
            res.sendStatus(500);
        });
});

app.post("/friends/accept/:otherUserId", (req, res) => {
    let id = req.session.userId;
    let otherUserId = Number(req.body.otherUserId);
    friendstatus
        .acceptRequest(id, otherUserId)
        .then(() => {
            res.json({ otherUserId });
        })
        .catch((err) => console.log(err));
});

app.post("/friends/unfriend/:otherUserId", (req, res) => {
    let id = req.session.userId;
    let otherUserId = Number(req.body.otherUserId);
    friendstatus
        .unfriend(id, otherUserId)
        .then(() => {
            res.json({ otherUserId });
        })
        .catch((err) => console.log(err));
});

app.post("/friendship-status/update/:otherUserId", (req, res) => {
    let id = req.session.userId;
    let otherUserId = Number(req.body.otherUserId);

    console.log("updated friendship status for: ", otherUserId);

    if (req.body.buttonText == "add as Friend") {
        let newStatus = "cancel request";
        friendstatus
            .addFriend(id, otherUserId)
            .then(() => {
                res.json({ otherUserId, newStatus });
            })
            .catch((err) => console.log(err));
    } else if (req.body.buttonText == "Unfriend") {
        let newStatus = "add as Friend";
        friendstatus
            .unfriend(id, otherUserId)
            .then(() => {
                res.json({ otherUserId, newStatus });
            })
            .catch((err) => console.log(err));
    } else if (req.body.buttonText == "cancel request") {
        let newStatus = "add as Friend";
        friendstatus
            .cancelRequest(id, otherUserId)
            .then(() => {
                res.json({ otherUserId, newStatus });
            })
            .catch((err) => console.log(err));
    } else if (req.body.buttonText == "accept Request") {
        let newStatus = "Unfriend";
        friendstatus
            .acceptRequest(id, otherUserId)
            .then(() => {
                res.json({ otherUserId, newStatus });
            })
            .catch((err) => console.log(err));
    }
});

app.get("/getListOfFriendsAndRequests", (req, res) => {
    friendstatus
        .getListOfFriends(req.session.userId)
        .then(({ rows }) => {
            if (!rows[0]) {
                console.log("no requests or Friends");
            } else {
                res.json(rows);
            }
        })
        .catch((err) =>
            console.log("error in friendstatus.getListofFriends", err)
        );
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

io.on("connection", (socket) => {
    // console.log(`socket woth id ${socket.id}`);
    // console.log("socket.request.session", socket.request.session);

    socket.on("disconnect", function () {
        // console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    db.getMostRecentMessages().then(({ rows }) => {
        socket.emit("mostRecentMessages", rows);
    });

    socket.on("messageSend", (message) => {
        db.addMessage(message, socket.request.session.userId).then((result) => {
            db.getUserData(socket.request.session.userId).then(({ rows }) => {
                io.sockets.emit("updateChat", {
                    messages: message,
                    profilepic: rows[0].profilepic,
                    first: rows[0].first,
                    last: rows[0].last,
                    timestamp: result.rows[0].timestamp,
                });
            });
        });
    });
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
