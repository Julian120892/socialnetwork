const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:julian:pet@localhost:5432/socialnetwork"
);
//("WhoAreWeTalkingTo:WichDBuserWillRunCommands:TheUserPassword@WhichPort/nameOfDatabase")

module.exports.newUser = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id `;
    const params = [first, last, email, password];
    return db.query(q, params);
};
