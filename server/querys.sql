CREATE TABLE friendships(
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  recipient_id INT REFERENCES users(id) NOT NULL,
  accepted BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX ON friendships (least(sender_id, recipient_id), greatest(sender_id, recipient_id));

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 103, false);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (265, 102, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (104, 265, true);

INSERT INTO friendships (sender_id, recipient_id, accepted)
VALUES (105, 265, false);

SELECT * FROM friendships
  WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1);