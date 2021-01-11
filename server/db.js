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

module.exports.getUserData = (id) => {
    const q = `SELECT first, last, email, profilepic, bio 
                FROM users 
                WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.findUsers = (userInput) => {
    const q = `SELECT first, last, profilepic, bio, id 
                FROM users 
                WHERE first ILIKE $1
                LIMIT 6
    `;
    const params = [userInput + "%"];
    return db.query(q, params);
};

module.exports.getMostRecentUsers = () => {
    const q = `SELECT first, last, profilepic, bio, id 
                FROM users                    
                ORDER BY id 
                DESC LIMIT 3;
    `;
    return db.query(q);
};

module.exports.uploadProfilePic = (url, id) => {
    console.log("server upload of picture");
    const q = ` 
        UPDATE users 
        SET profilepic = $1
        WHERE id = $2
        RETURNING profilepic
        ;
    `;
    const params = [url, id];
    return db.query(q, params);
};

module.exports.updateBio = (id, bio) => {
    console.log("bio updated on Server");
    const q = ` 
        UPDATE users 
        SET bio = $2
        WHERE id = $1
        RETURNING bio
        ;
    `;
    const params = [id, bio];
    return db.query(q, params);
};
