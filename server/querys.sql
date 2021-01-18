CREATE TABLE friendships(
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  recipient_id INT REFERENCES users(id) NOT NULL,
  accepted BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX ON friendships (least(sender_id, recipient_id), greatest(sender_id, recipient_id));

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 134, false);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 199, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (90, 265, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (174, 265, false);

SELECT * FROM friendships
  WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1);




INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 144, false);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 192, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (180, 265, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (124, 265, false);
INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 124, false);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 172, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (212, 265, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (99, 265, false);
INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 100, false);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 139, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (195, 265, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (144, 265, false);
INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 174, false);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 165, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (210, 265, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (144, 265, false);


CREATE TABLE chat_messages(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) NOT NULL,
  messages VARCHAR NOT NULL
);

INSERT INTO chat_messages (user_id, messages)
VALUES (98, 'Das noch eine ist eine Test Nachricht');