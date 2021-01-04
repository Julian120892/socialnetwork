const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");

app.use(compression());

app.use(
    cookieSession({
        secret: "This is a secret",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
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

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
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
