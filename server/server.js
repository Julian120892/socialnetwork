const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const config = require("./config.json");
const multer = require("multer");
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

app.use(
    cookieSession({
        secret: "This is a secret",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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
    db.getUserData(req.session.userId).then(({ rows }) => {
        // console.log(rows[0]);
        res.json(rows[0]);
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

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
