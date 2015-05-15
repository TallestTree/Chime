-- Run 'psql -U myuser mydb' with appropriate user, db, and password on prompt
-- Run '\i path/to/testData.sql' to insert rows locally

-- Email: peggy@kingofthehill.com
-- Password: test
INSERT INTO users (first_name, last_name, email, photo, title, password_hash) VALUES ('Peggy', 'Hill', 'peggy@kingofthehill.com', 'http://i.imgur.com/gnzS7G5.jpg', 'Homemaker', '$2a$10$v9koGC8WUXRCsfNAtC3xGeq1z2pYuakgQp3Qd.GQqyjvO5q1F9lAu');
INSERT INTO organizations (admin_id, name) VALUES (1, 'Makersquare');
UPDATE users SET organization_id='1' WHERE id=1;

INSERT INTO users (first_name, last_name, email, photo, title, organization_id) VALUES ('Hank', 'Hill', 'hank@kingofthehill.com', 'http://i.imgur.com/sY47Zl6.jpg', 'Propane Salesman', 1);
INSERT INTO users (first_name, last_name, email, photo, title, organization_id) VALUES ('Luanne', 'Platter', 'luanne@kingofthehill.com', 'http://i.imgur.com/hUoJph9.jpg', 'Beautician', 1);
INSERT INTO users (first_name, last_name, email, photo, title, organization_id) VALUES ('Bobby', 'Hill', 'bobby@kingofthehill.com', 'http://i.imgur.com/KQjdi0i.jpg', 'Student', 1);
INSERT INTO users (first_name, last_name, email, photo, title, organization_id) VALUES ('Dale', 'Dribble', 'dale@kingofthehill.com', 'http://i.imgur.com/FJw1Nbb.jpg', 'Exterminator', 1);
