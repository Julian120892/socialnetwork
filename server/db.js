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

module.exports.loginIn = (email) => {
    const q = `SELECT password, id FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getEmail = (email) => {
    const q = `SELECT email FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.addResetCode = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code)
    VALUES ($1, $2)
    `;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.verifyCode = (email) => {
    const q = `SELECT code 
                FROM reset_codes 
                WHERE email = $1
                AND CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes';
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePassword = (email, password) => {
    const q = `UPDATE users 
    SET password = $2
    WHERE email = $1
    `;
    const params = [email, password];
    return db.query(q, params);
};
