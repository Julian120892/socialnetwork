const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:julian:pet@localhost:5432/socialnetwork"
);
//("WhoAreWeTalkingTo:WichDBuserWillRunCommands:TheUserPassword@WhichPort/nameOfDatabase")

module.exports.getFriendshipStatus = (id, otherUserId) => {
    const q = `
        SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1);
    `;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.addFriend = (id, otherUserId) => {
    const q = `
    
    INSERT INTO friendships (sender_id, recipient_id, accepted)
    VALUES ($1, $2, false);
    `;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.cancelRequest = (id, otherUserId) => {
    const q = `
    
    DELETE FROM friendships
    WHERE recipient_id = $2 AND sender_id = $1; 
    `;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.unfriend = (id, otherUserId) => {
    const q = `
    
    DELETE FROM friendships
    WHERE recipient_id = $2 AND sender_id = $1
    OR recipient_id = $1 AND sender_id = $2
    `;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.acceptRequest = (id, otherUserId) => {
    const q = `
    UPDATE friendships
    SET accepted = true
    WHERE recipient_id = $2 AND sender_id = $1
    OR recipient_id = $1 AND sender_id = $2
    ; 
    `;
    const params = [id, otherUserId];
    return db.query(q, params);
};
