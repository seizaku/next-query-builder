-- CREATE SCHEMA api;

-- Create the Gender enum type
CREATE TYPE gender AS ENUM ('Male', 'Female');

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the profiles table
CREATE TABLE profiles (
    avatar VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    user_id INT UNIQUE NOT NULL,
    age INT NOT NULL,
    sex gender NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users (id)
);

CREATE VIEW user_profiles AS
SELECT users.*, profiles.*
FROM users
JOIN profiles ON users.id = profiles.user_id;

-- Create query function
CREATE OR REPLACE FUNCTION query(sql TEXT DEFAULT '')
RETURNS SETOF user_profiles AS $$
BEGIN
    IF sql = '' THEN
        RETURN QUERY SELECT * FROM user_profiles;
    ELSE
        RETURN QUERY EXECUTE 'SELECT * FROM user_profiles WHERE ' || sql;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create the role with login capability and a demo password
CREATE ROLE "user" LOGIN PASSWORD 'password';
-- Grant access to the schema
GRANT USAGE ON SCHEMA public TO "user";
-- Grant access to all tables in the schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO "user";
-- Optionally grant access to future tables in the schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO "user";

-- Seed users
INSERT INTO users VALUES (1, 'Brionna69@yahoo.com', 'Sue Walsh-Howe', '2023-09-10 14:45:14.848', '2024-01-26 10:23:33.308');
INSERT INTO users VALUES (2, 'Pietro.Lindgren7@hotmail.com', 'Jared Schamberger', '2024-06-02 00:05:42.378', '2024-06-04 03:04:50.993');
INSERT INTO users VALUES (3, 'Cody90@yahoo.com', 'Kelvin Barrows Jr.', '2024-03-03 19:29:03.042', '2024-07-10 08:25:41.504');
INSERT INTO users VALUES (4, 'Annabelle_Orn42@gmail.com', 'Mark Kshlerin', '2023-09-19 17:43:06.431', '2024-02-08 15:52:52.616');
INSERT INTO users VALUES (5, 'Abdiel_Kemmer18@gmail.com', 'Eddie Morar', '2024-03-14 05:28:49.053', '2024-06-07 06:57:17.67');
INSERT INTO users VALUES (6, 'Carter36@yahoo.com', 'Damon Mertz', '2024-06-11 11:37:25.36', '2024-06-19 00:48:30.278');
INSERT INTO users VALUES (7, 'Kari44@gmail.com', 'Iris Anderson', '2024-03-01 17:30:58.589', '2024-05-23 20:52:57.713');
INSERT INTO users VALUES (8, 'Jacquelyn49@yahoo.com', 'Mattie Denesik', '2024-03-26 02:22:46.241', '2024-07-19 18:18:28.66');
INSERT INTO users VALUES (9, 'Laurianne.Bergstrom56@gmail.com', 'Emma Mohr', '2024-04-08 01:25:27.787', '2024-07-11 09:38:56.803');
INSERT INTO users VALUES (10, 'Fay.Gerhold7@yahoo.com', 'Carlton Hills', '2024-06-20 14:09:24.868', '2024-06-25 01:17:22.465');
INSERT INTO users VALUES (11, 'Leta_Heidenreich@hotmail.com', 'Marty Pouros', '2023-09-25 14:15:00.049', '2024-01-14 21:36:28.976');
INSERT INTO users VALUES (12, 'Marlee.Braun69@gmail.com', 'Bonnie Towne', '2023-08-01 05:52:34.852', '2024-04-02 11:29:48.382');
INSERT INTO users VALUES (13, 'Christiana_Kuhlman@gmail.com', 'Dr. Claire Hermiston', '2024-05-20 05:10:40.847', '2024-07-24 03:45:44.909');
INSERT INTO users VALUES (14, 'Keaton_Mohr@yahoo.com', 'Mike Jones', '2024-07-06 03:24:29.126', '2024-07-09 21:38:03.143');
INSERT INTO users VALUES (15, 'Bettye.Gerhold-Reynolds@gmail.com', 'Alan Hane', '2024-06-14 21:04:02.361', '2024-07-20 13:42:12.142');
INSERT INTO users VALUES (16, 'Rosella7@hotmail.com', 'Clayton Carroll', '2023-09-16 00:26:20.806', '2024-04-18 15:53:45.921');
INSERT INTO users VALUES (17, 'Melyna14@gmail.com', 'Frankie Christiansen', '2024-02-08 06:43:33.99', '2024-05-20 10:38:28.813');
INSERT INTO users VALUES (18, 'Bethany_Pagac@yahoo.com', 'Terry Gerhold', '2024-05-18 13:48:23.942', '2024-05-27 14:53:21.154');
INSERT INTO users VALUES (19, 'Bernice_Stamm@gmail.com', 'Jordan Predovic', '2024-07-11 13:42:51.081', '2024-07-17 14:03:19.768');
INSERT INTO users VALUES (20, 'Lacy.Altenwerth63@gmail.com', 'Ricardo Rutherford-Schimmel', '2024-05-02 12:08:32.88', '2024-06-20 21:37:54.153');
INSERT INTO users VALUES (21, 'Morgan.Padberg74@hotmail.com', 'Frances Cassin-Ferry', '2024-05-21 12:53:39.312', '2024-06-19 07:31:47.18');
INSERT INTO users VALUES (22, 'Jazmyne_Corwin20@yahoo.com', 'Pauline Daniel', '2023-08-24 01:18:02.597', '2023-09-22 13:30:09.617');
INSERT INTO users VALUES (23, 'Herminio_Pouros@yahoo.com', 'Blanca Schmidt', '2024-03-10 13:28:44.424', '2024-04-01 09:09:24.355');
INSERT INTO users VALUES (24, 'Mose.Shields17@hotmail.com', 'Steven Stehr Jr.', '2023-11-13 00:41:13.175', '2024-02-01 00:11:26.37');
INSERT INTO users VALUES (25, 'Isai.Skiles52@yahoo.com', 'Ronnie McLaughlin', '2024-01-03 10:36:33.791', '2024-05-16 09:50:15.676');
INSERT INTO users VALUES (26, 'Mario27@yahoo.com', 'Mr. Roman Cruickshank', '2024-02-08 01:51:04.953', '2024-03-19 20:00:16.264');
INSERT INTO users VALUES (27, 'Claudie_Zulauf64@hotmail.com', 'Linda Nicolas', '2024-05-31 10:01:27.252', '2024-06-25 20:15:10.05');
INSERT INTO users VALUES (28, 'Annetta_Bartoletti@gmail.com', 'Mr. Tomas Murazik DDS', '2024-06-01 13:04:29.925', '2024-06-30 10:00:46.489');
INSERT INTO users VALUES (29, 'Isabelle7@gmail.com', 'Anita Tromp', '2023-11-06 22:16:48.57', '2023-12-13 10:19:52.798');
INSERT INTO users VALUES (30, 'Iliana_Kuvalis@gmail.com', 'Kristen McGlynn', '2024-02-06 10:57:38.987', '2024-05-20 09:56:50.281');
INSERT INTO users VALUES (31, 'Estella_Sipes-Nienow@hotmail.com', 'Frankie Gibson', '2024-06-14 04:24:22.635', '2024-07-06 13:42:29.858');
INSERT INTO users VALUES (32, 'Terrance.Harvey50@yahoo.com', 'Austin Renner', '2023-10-15 08:22:23.864', '2024-04-25 19:27:44.565');
INSERT INTO users VALUES (33, 'Justen23@gmail.com', 'Christina Blanda', '2024-05-14 17:44:29.616', '2024-07-08 13:00:16.237');
INSERT INTO users VALUES (34, 'Elisa.Roob@gmail.com', 'Maxine Carter', '2024-03-09 00:14:46.937', '2024-07-21 02:09:44.333');
INSERT INTO users VALUES (35, 'Tom.Rath68@gmail.com', 'Joanne Cruickshank', '2024-04-05 19:24:40.904', '2024-05-25 00:24:46.923');
INSERT INTO users VALUES (36, 'Alessandro22@hotmail.com', 'Anna Corkery', '2023-09-07 08:19:32.993', '2024-02-21 03:25:41.353');
INSERT INTO users VALUES (37, 'Jessika.Jacobson54@yahoo.com', 'Juan Dibbert', '2023-10-13 05:50:31.619', '2024-01-08 22:46:31.408');
INSERT INTO users VALUES (38, 'Triston_Daugherty66@gmail.com', 'Glenda O''Keefe', '2024-02-14 20:48:38.663', '2024-05-02 17:19:29.176');
INSERT INTO users VALUES (39, 'Gwen88@yahoo.com', 'Mr. Wallace Batz DVM', '2024-05-07 16:38:12.119', '2024-05-20 07:03:38.792');
INSERT INTO users VALUES (40, 'Aisha49@hotmail.com', 'Jan Franey', '2024-06-26 12:07:10.14', '2024-06-30 13:34:00.469');
INSERT INTO users VALUES (41, 'Mary_Paucek-Heaney45@hotmail.com', 'Erika Swift', '2024-01-13 03:20:00.614', '2024-04-26 19:09:57.185');
INSERT INTO users VALUES (42, 'Antone2@yahoo.com', 'Frank Goldner', '2023-12-01 21:58:39.163', '2024-05-29 01:40:17.12');
INSERT INTO users VALUES (43, 'Florian.Dooley75@hotmail.com', 'Jean Anderson', '2024-06-18 22:04:52.547', '2024-07-21 08:59:22.581');
INSERT INTO users VALUES (44, 'Edward.Halvorson69@yahoo.com', 'Yvette Marvin', '2023-12-13 21:16:18.337', '2024-04-21 03:39:34.986');
INSERT INTO users VALUES (45, 'Ottis4@hotmail.com', 'Willis Kunde MD', '2023-09-22 05:48:20.897', '2024-06-28 12:11:29.73');
INSERT INTO users VALUES (46, 'Camryn_Kreiger@hotmail.com', 'Derek Goyette', '2024-05-17 22:52:40.59', '2024-07-07 20:48:56.683');
INSERT INTO users VALUES (47, 'Jedidiah79@gmail.com', 'Marco Gutmann III', '2023-09-10 21:01:04.504', '2023-11-25 13:34:43.988');
INSERT INTO users VALUES (48, 'Victoria.Gulgowski@hotmail.com', 'Candice Bode DDS', '2024-07-10 00:31:46.929', '2024-07-25 02:08:26.587');
INSERT INTO users VALUES (49, 'Llewellyn.Graham26@gmail.com', 'Gilbert Jerde', '2024-03-31 03:41:02.656', '2024-04-11 23:24:24.898');
INSERT INTO users VALUES (50, 'Dell.Howe@gmail.com', 'Lorenzo Sporer', '2024-01-20 21:58:10.912', '2024-03-16 18:30:07.894');
INSERT INTO users VALUES (51, 'Germaine77@yahoo.com', 'Israel Bruen', '2023-08-20 04:07:13.135', '2024-07-05 20:08:07.526');
INSERT INTO users VALUES (52, 'Gavin.Schumm55@gmail.com', 'Abraham Skiles I', '2023-11-02 22:45:59.652', '2024-06-06 05:09:03.81');
INSERT INTO users VALUES (53, 'Tevin.Hills73@hotmail.com', 'Byron Moen-Windler', '2024-04-08 02:10:47.371', '2024-05-29 14:44:16.874');
INSERT INTO users VALUES (54, 'Travon2@yahoo.com', 'Carlton Parisian II', '2023-10-28 23:09:14.877', '2024-02-02 13:41:13.185');
INSERT INTO users VALUES (55, 'Dee_Torphy@gmail.com', 'Wanda Boyer-Goodwin', '2023-12-08 09:21:23.513', '2024-05-06 21:38:37.641');
INSERT INTO users VALUES (56, 'Viva10@hotmail.com', 'Fred Rath', '2024-07-21 23:15:10.976', '2024-07-24 07:24:05.893');
INSERT INTO users VALUES (57, 'Amya.Sanford@hotmail.com', 'Naomi Koss', '2024-06-05 02:19:56.138', '2024-07-03 21:49:27.503');
INSERT INTO users VALUES (58, 'Gabe4@gmail.com', 'Oscar Tillman IV', '2024-06-08 12:31:55.575', '2024-06-18 07:57:18.175');
INSERT INTO users VALUES (59, 'Chelsie29@hotmail.com', 'Kerry Flatley II', '2024-03-28 20:04:02.353', '2024-06-07 00:35:36.156');
INSERT INTO users VALUES (60, 'Carolanne.Moen@hotmail.com', 'Cody Stark', '2024-07-23 03:02:26.478', '2024-07-25 03:01:40.827');
INSERT INTO users VALUES (61, 'Samanta_OConnell36@hotmail.com', 'Randal Rosenbaum', '2023-09-25 03:37:12.277', '2024-06-02 04:08:32.672');
INSERT INTO users VALUES (62, 'Andreane_Hegmann42@hotmail.com', 'Lena Rath', '2023-11-13 08:41:57.569', '2023-12-30 08:24:23.259');
INSERT INTO users VALUES (63, 'Ashly.Sauer84@yahoo.com', 'Penny Steuber', '2023-11-13 10:13:14.963', '2024-05-08 15:49:26.894');
INSERT INTO users VALUES (64, 'Cyrus_Runolfsdottir92@hotmail.com', 'Kristen Kshlerin', '2023-09-25 16:45:17.626', '2023-10-01 11:39:18.612');
INSERT INTO users VALUES (65, 'Marcelina18@hotmail.com', 'Jonathon Stark', '2024-05-09 18:09:45.742', '2024-06-26 20:54:52.493');
INSERT INTO users VALUES (66, 'Amparo80@gmail.com', 'Annie Feest DDS', '2023-09-04 08:48:41.753', '2024-06-26 23:47:15.444');
INSERT INTO users VALUES (67, 'Eva.Schaden91@yahoo.com', 'Wilson Schroeder', '2023-11-04 14:41:50.526', '2023-11-25 10:29:56.988');
INSERT INTO users VALUES (68, 'Khalid_Huels77@hotmail.com', 'Perry Mueller', '2024-06-13 11:36:38.422', '2024-06-19 00:17:12.132');
INSERT INTO users VALUES (69, 'Nakia.Keeling@yahoo.com', 'Dr. Leah Wolff', '2024-04-20 07:43:15.189', '2024-06-04 06:09:44.338');
INSERT INTO users VALUES (70, 'Matilda70@gmail.com', 'Bernice Baumbach', '2023-12-23 09:38:34.007', '2024-01-09 15:26:42.395');
INSERT INTO users VALUES (71, 'Shayne.Wehner53@hotmail.com', 'Georgia Macejkovic', '2024-05-22 15:40:58.695', '2024-06-20 21:05:12.981');
INSERT INTO users VALUES (72, 'Eusebio.OReilly39@gmail.com', 'Brian Gusikowski', '2024-04-07 14:09:22.37', '2024-06-11 11:26:40.438');
INSERT INTO users VALUES (73, 'Geovanni_Heidenreich@yahoo.com', 'Elmer Kiehn', '2023-07-29 17:56:49.863', '2024-05-12 16:29:56.247');
INSERT INTO users VALUES (74, 'Wilfred_Heidenreich52@hotmail.com', 'Josephine Lesch', '2024-01-05 03:24:46.765', '2024-02-09 17:16:24.79');
INSERT INTO users VALUES (75, 'Toney.Feeney42@gmail.com', 'Brent Halvorson', '2023-12-07 12:11:30.459', '2024-05-14 08:06:11.839');
INSERT INTO users VALUES (76, 'Britney.Farrell39@gmail.com', 'Debra Hagenes-Buckridge', '2023-09-01 11:24:05.514', '2024-02-12 10:58:15.005');
INSERT INTO users VALUES (77, 'Rodger.Hartmann@yahoo.com', 'Marianne Keeling', '2024-04-18 19:02:45.118', '2024-07-25 15:33:10.442');
INSERT INTO users VALUES (78, 'Georgianna95@gmail.com', 'Stephen Zieme', '2024-06-01 14:21:47.903', '2024-06-03 11:58:12.181');
INSERT INTO users VALUES (79, 'Jesse_Wehner@gmail.com', 'Roberta Schiller', '2024-01-29 01:25:43.875', '2024-06-11 18:06:49.248');
INSERT INTO users VALUES (80, 'Jairo_Lindgren@hotmail.com', 'Dr. Jessie Mante MD', '2024-02-22 02:14:41.536', '2024-07-10 07:59:46.333');
INSERT INTO users VALUES (81, 'Alba_Lindgren@hotmail.com', 'Randal Schneider-O''Reilly', '2024-03-05 00:18:39.431', '2024-05-11 21:31:20.024');
INSERT INTO users VALUES (82, 'Magali43@yahoo.com', 'Wilbert Luettgen', '2023-11-22 14:55:52.021', '2024-01-01 06:08:08.208');
INSERT INTO users VALUES (83, 'Percival.Schiller98@yahoo.com', 'Tonya Monahan', '2023-09-04 11:58:26.274', '2024-02-16 18:53:29.426');
INSERT INTO users VALUES (84, 'Garrison_Rodriguez@gmail.com', 'Georgia Jenkins I', '2023-12-30 22:17:49.922', '2024-06-29 09:21:03.478');
INSERT INTO users VALUES (85, 'Devin.Bednar82@yahoo.com', 'Jenna Collier', '2024-05-25 18:02:57.277', '2024-06-27 04:15:56.324');
INSERT INTO users VALUES (86, 'Gunnar.Ziemann91@hotmail.com', 'Miss Rosie Predovic', '2023-11-03 16:58:27.353', '2024-02-17 14:54:02.74');
INSERT INTO users VALUES (87, 'Harrison.Kuvalis41@hotmail.com', 'Sean Toy', '2024-01-24 22:23:36.105', '2024-03-27 00:11:19.261');
INSERT INTO users VALUES (88, 'Fidel_Fay@hotmail.com', 'Dr. Duane Nitzsche', '2023-12-19 00:44:31.343', '2024-03-13 17:33:28.266');
INSERT INTO users VALUES (89, 'Jaylon.Koepp7@hotmail.com', 'Dr. Josephine Cruickshank III', '2024-03-14 05:37:50.304', '2024-05-25 17:55:54.717');
INSERT INTO users VALUES (90, 'Era13@hotmail.com', 'Alan Hodkiewicz', '2023-08-04 03:22:01.211', '2023-12-27 05:02:07.419');
INSERT INTO users VALUES (91, 'Asia.Bernier81@yahoo.com', 'Jody Weber-Botsford', '2023-11-17 06:09:29.595', '2023-11-22 13:31:33.718');
INSERT INTO users VALUES (92, 'Cindy.Pfannerstill70@yahoo.com', 'Elizabeth Hudson', '2023-11-02 21:33:42.983', '2023-11-22 22:24:14.56');
INSERT INTO users VALUES (93, 'Curt68@gmail.com', 'Hugh Krajcik', '2024-07-06 20:17:37.748', '2024-07-08 17:39:21.872');
INSERT INTO users VALUES (94, 'Sophia.Greenholt@gmail.com', 'Miss Carmen Huels', '2024-03-23 13:34:25.748', '2024-05-09 23:56:59.039');
INSERT INTO users VALUES (95, 'Assunta_Rohan18@yahoo.com', 'Margaret Hermiston II', '2023-09-08 18:59:57.7', '2023-11-08 03:41:54.378');
INSERT INTO users VALUES (96, 'Destin.Rosenbaum53@gmail.com', 'Leo Schmitt', '2024-02-01 00:22:41.784', '2024-03-27 02:51:19.73');
INSERT INTO users VALUES (97, 'Kip.Romaguera@hotmail.com', 'Roman Wunsch-Carroll', '2024-03-07 11:27:52.557', '2024-05-08 10:13:31.657');
INSERT INTO users VALUES (98, 'Thad73@gmail.com', 'Hector Murazik', '2023-08-10 15:41:38.052', '2023-10-24 09:19:54.946');
INSERT INTO users VALUES (99, 'Deshawn_Wuckert9@yahoo.com', 'Thelma Donnelly', '2023-08-02 02:56:27.872', '2023-08-06 06:27:54.019');
INSERT INTO users VALUES (100, 'Santino_Purdy77@gmail.com', 'Rolando Weimann Jr.', '2024-03-03 14:23:57.067', '2024-03-04 04:13:23.752');

-- Seed profiles
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1028.jpg', 'Lakin, Swaniawski and Harber', '05171', 'Jordan', 'Maine', 'South Linwood', 1, 55, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/47512745', 'Cartwright Inc', '39630', 'French Guiana', 'Idaho', 'West Emmetport', 2, 43, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/177.jpg', 'Rau Inc', '24536', 'Liberia', 'Arizona', 'Dibbertland', 3, 45, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/811.jpg', 'Hickle LLC', '95959-9772', 'Sri Lanka', 'Kentucky', 'Strosinfort', 4, 37, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/36850533', 'Walker - Kuhic', '26408', 'Isle of Man', 'West Virginia', 'San Leandro', 5, 55, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/40816541', 'Schimmel, Miller and Swift', '70905', 'Haiti', 'Georgia', 'Providence', 6, 67, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/30380191', 'Crona, Armstrong and Marks', '59939-0813', 'Guyana', 'Maine', 'East Berta', 7, 35, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/750.jpg', 'Lockman - Ortiz', '75444-6881', 'Angola', 'New Jersey', 'West Derek', 8, 74, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/16814891', 'Boehm Inc', '21708-2385', 'Trinidad and Tobago', 'Georgia', 'Bauchview', 9, 36, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1060.jpg', 'Fay, Cronin and Altenwerth', '09795', 'Germany', 'Nebraska', 'Davenport', 10, 39, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1149.jpg', 'Cronin - Carroll', '19150-4289', 'Burundi', 'Vermont', 'Grantview', 11, 42, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1171.jpg', 'Farrell Inc', '53202', 'North Macedonia', 'Tennessee', 'Bossier City', 12, 50, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/71265345', 'Armstrong Group', '60169-8366', 'New Zealand', 'Michigan', 'Lake Leonorfort', 13, 34, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/96620155', 'Bruen, Abshire and Toy', '42607', 'Guinea', 'Texas', 'Hillsboro', 14, 27, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/787.jpg', 'Mertz Group', '25931-5513', 'Haiti', 'Alaska', 'Lake Jalonfield', 15, 30, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1217.jpg', 'Nitzsche - Paucek', '41382', 'Faroe Islands', 'Pennsylvania', 'New Sydney', 16, 47, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/336.jpg', 'Jakubowski, Stroman and Nitzsche', '63176-0459', 'Jordan', 'Arkansas', 'West Marjoryport', 17, 26, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/65479277', 'Greenholt Group', '92179', 'Palestine', 'Kansas', 'Highlands Ranch', 18, 50, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/1494393', 'Grimes - Rippin', '78110-0552', 'Virgin Islands, British', 'New Mexico', 'Lutherview', 19, 57, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/76015911', 'Erdman, Adams and Russel', '70197', 'United States of America', 'Hawaii', 'Fort Rosalind', 20, 42, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/522.jpg', 'Murray - Ruecker', '58281-1707', 'Bouvet Island', 'Texas', 'North Kayli', 21, 21, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/56539603', 'Funk - White', '49668-9692', 'Lesotho', 'New Mexico', 'Jonshire', 22, 59, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/9098722', 'Kozey - Jacobs', '08848', 'New Zealand', 'Utah', 'Jailynboro', 23, 21, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/68110124', 'Hand Inc', '72373', 'Guam', 'New Hampshire', 'South Anitaboro', 24, 54, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/22540707', 'Vandervort and Sons', '69043', 'Comoros', 'North Carolina', 'Chino', 25, 76, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/84227337', 'Lindgren, Baumbach and Gleichner', '22052', 'French Polynesia', 'Nevada', 'Faheyburgh', 26, 35, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/692.jpg', 'Cremin, DuBuque and Ryan', '56525-2329', 'Nigeria', 'South Carolina', 'Avondale', 27, 44, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/52327329', 'Stark LLC', '14850', 'United Arab Emirates', 'New Hampshire', 'Kettering', 28, 47, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/96355177', 'Braun, Pacocha and Torp', '60320', 'Costa Rica', 'Utah', 'Shieldsfield', 29, 65, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/592.jpg', 'Stark - Bode', '06845', 'French Southern Territories', 'Missouri', 'Boyleville', 30, 32, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/929.jpg', 'Boyle, Weissnat and Von', '49361-4927', 'Bhutan', 'California', 'Sauerburgh', 31, 23, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/673.jpg', 'Hermann - Brekke', '21981', 'Togo', 'North Dakota', 'Metzview', 32, 57, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/201.jpg', 'Boyle Inc', '79638', 'Senegal', 'Massachusetts', 'Nataliafurt', 33, 45, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/973.jpg', 'Marvin - Schaden', '24321', 'Norway', 'Alaska', 'Fort Jovanport', 34, 66, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/27415947', 'O''Conner, Barrows and Maggio', '34383', 'Croatia', 'Kentucky', 'Lake Damion', 35, 58, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/697.jpg', 'Mills, Barrows and Roberts', '42433-2841', 'Democratic Republic of the Congo', 'Alabama', 'North Elyssa', 36, 44, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/63936380', 'Zemlak - Klein', '14161', 'Taiwan', 'Texas', 'Sarahfurt', 37, 56, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/217.jpg', 'Cole and Sons', '60084-2714', 'Angola', 'Alaska', 'Batzworth', 38, 39, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/260.jpg', 'Schulist, Botsford and Olson', '68133-2068', 'Mozambique', 'Maryland', 'Fort Rebeka', 39, 43, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1061.jpg', 'Schowalter - Marquardt', '12089-4899', 'Norway', 'Nevada', 'Warwick', 40, 79, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/462.jpg', 'Cole - Hickle', '58950', 'South Africa', 'Arizona', 'East Peterstead', 41, 24, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/97520246', 'Schuppe, Toy and Price', '61014', 'Turkmenistan', 'Kansas', 'East Monroestad', 42, 49, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1113.jpg', 'Strosin Inc', '70944-2626', 'Papua New Guinea', 'Texas', 'Antoniohaven', 43, 73, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/16431948', 'Lind LLC', '23781-2737', 'Guadeloupe', 'Louisiana', 'Melbourne', 44, 48, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/58986325', 'Heller, Koelpin and Kohler', '27694-2803', 'Cocos (Keeling) Islands', 'Oregon', 'Lake Lavernatown', 45, 74, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/353.jpg', 'McGlynn - Larson', '62649-1653', 'Zimbabwe', 'Arkansas', 'West Eviebury', 46, 32, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/545.jpg', 'Ritchie LLC', '74762-4756', 'Central African Republic', 'Colorado', 'Port Daniellafield', 47, 47, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/89104211', 'Sporer - Larkin', '70380', 'Timor-Leste', 'Virginia', 'Santa Cruz', 48, 22, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/35.jpg', 'Lockman - Casper', '47446-7272', 'China', 'Wisconsin', 'Treutelborough', 49, 60, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1048.jpg', 'Koss - Lubowitz', '66472-7707', 'Bermuda', 'Maryland', 'Greysonton', 50, 29, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/35318417', 'Smith and Sons', '89664-7540', 'Northern Mariana Islands', 'Wisconsin', 'Millsburgh', 51, 63, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/9204342', 'Smith - Kessler', '15421-0878', 'Belize', 'Nebraska', 'Lake Jamaalborough', 52, 21, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/978.jpg', 'Toy Inc', '53971', 'Micronesia', 'Hawaii', 'Schultzfield', 53, 67, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/196.jpg', 'Bergstrom, Botsford and Pfeffer', '67696', 'Eritrea', 'Oregon', 'Port Louie', 54, 48, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/71596000', 'Nitzsche Group', '32466-7631', 'Christmas Island', 'South Carolina', 'Maddisonton', 55, 41, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/356.jpg', 'Effertz - Schowalter', '74888-5962', 'Antarctica', 'Maryland', 'Lake Treverhaven', 56, 59, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/513.jpg', 'Hirthe - Huels', '28791-3940', 'Guam', 'South Dakota', 'Hilo', 57, 36, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/52180819', 'Sipes, Beier and Rath', '05809-2674', 'Chad', 'Montana', 'Wymanshire', 58, 70, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/581.jpg', 'O''Connell Group', '27785', 'Botswana', 'Illinois', 'North Hipolito', 59, 31, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/279.jpg', 'Kuhn and Sons', '71623-8608', 'Aruba', 'Massachusetts', 'Cruickshankside', 60, 35, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/96468434', 'Kohler Group', '49801-8449', 'Peru', 'Idaho', 'Dangeloside', 61, 43, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/57747041', 'Lehner - Green', '02652', 'Lao People''s Democratic Republic', 'Kansas', 'Portage', 62, 78, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/720.jpg', 'Weber Inc', '84207', 'Spain', 'South Carolina', 'Waelchiboro', 63, 58, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/980.jpg', 'Reilly and Sons', '18020-4499', 'Cocos (Keeling) Islands', 'Montana', 'Torranceborough', 64, 31, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/95759428', 'Larkin, Green and Turcotte', '92774', 'Italy', 'Indiana', 'Dasiamouth', 65, 63, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/255.jpg', 'Leffler - Turcotte', '57266-6999', 'Benin', 'Louisiana', 'Milford', 66, 31, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/77005342', 'Hartmann Inc', '82687', 'Germany', 'South Dakota', 'Fort Emmettview', 67, 50, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/96908363', 'Brown LLC', '93314', 'Virgin Islands, U.S.', 'Illinois', 'Lauderhill', 68, 62, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/524.jpg', 'Reinger LLC', '64771', 'Micronesia', 'New York', 'Wichita', 69, 47, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1128.jpg', 'Cormier LLC', '64506', 'Australia', 'Oklahoma', 'University', 70, 42, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/59541160', 'Haag LLC', '55728', 'Western Sahara', 'Wisconsin', 'Lindgrenport', 71, 41, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/428.jpg', 'Hessel Inc', '76640-5161', 'Congo', 'Illinois', 'North Clairehaven', 72, 71, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/52925226', 'Hayes - Ondricka', '19200-8116', 'Tajikistan', 'Georgia', 'North Daphne', 73, 48, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/903.jpg', 'Kuvalis - Carter', '82889', 'Bulgaria', 'Alaska', 'North Jeffry', 74, 40, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1246.jpg', 'Krajcik, Bailey and Corwin', '43488-5023', 'Albania', 'Delaware', 'Lake William', 75, 53, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/24643295', 'Keeling, Blanda and Beier', '69305-1410', 'Mongolia', 'New Jersey', 'Plainfield', 76, 74, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/27869779', 'Ryan and Sons', '70134', 'Dominican Republic', 'Indiana', 'Blaine', 77, 53, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/14.jpg', 'Weissnat, Johnson and Bernier', '80725', 'Sweden', 'Florida', 'Faystad', 78, 18, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/699.jpg', 'Murray and Sons', '92588', 'Niger', 'Maryland', 'Bloomington', 79, 74, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/723.jpg', 'Hermann - Streich', '36198', 'Puerto Rico', 'Maine', 'Juniusworth', 80, 78, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/427.jpg', 'Jakubowski, Watsica and Stehr', '06122', 'Saint Lucia', 'Vermont', 'Andreannestad', 81, 25, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/44769927', 'Krajcik - Bruen', '53393-1754', 'Solomon Islands', 'New Mexico', 'West Leonel', 82, 34, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/34370572', 'Willms, Feest and Price', '91600-5036', 'Senegal', 'New Mexico', 'Krisbury', 83, 30, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1102.jpg', 'Bernhard, Bernhard and Lebsack', '48662-2292', 'Germany', 'Kentucky', 'Salliebury', 84, 58, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1104.jpg', 'Dickens and Sons', '99828-0932', 'Mali', 'New York', 'Flaviohaven', 85, 32, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/23250134', 'Crona, Kuvalis and Hilpert', '31755', 'El Salvador', 'New Jersey', 'Gottliebland', 86, 33, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/67585348', 'Cole - Hills', '45339', 'Namibia', 'Pennsylvania', 'Lake Marcellastad', 87, 39, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/95610272', 'Haley - Hamill', '08092-7066', 'Cocos (Keeling) Islands', 'Oklahoma', 'Fort Sofiaworth', 88, 69, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/6676087', 'Dach LLC', '62517-9573', 'Aland Islands', 'Hawaii', 'New Ineshaven', 89, 47, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/441.jpg', 'Douglas and Sons', '44799-9921', 'Latvia', 'Arizona', 'North Newellview', 90, 32, 'Female');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/595.jpg', 'O''Reilly, Rempel and Lynch', '54204', 'Russian Federation', 'North Carolina', 'Nigelworth', 91, 69, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/4946861', 'Fahey, McCullough and Robel', '14200-2026', 'Gibraltar', 'Kentucky', 'Wehnerhaven', 92, 56, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/25675142', 'Nienow, Beatty and Dooley', '72798-4006', 'Philippines', 'Hawaii', 'Strosinstad', 93, 71, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1117.jpg', 'Romaguera Inc', '75970', 'Solomon Islands', 'Utah', 'Alyssonfurt', 94, 23, 'Male');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/54571971', 'Spinka and Sons', '30984', 'Honduras', 'Michigan', 'Langoshport', 95, 50, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/366.jpg', 'Stanton and Sons', '50218', 'United States Minor Outlying Islands', 'Wisconsin', 'Lucyville', 96, 36, 'Female');
INSERT INTO profiles VALUES ('https://avatars.githubusercontent.com/u/62661793', 'Gutmann, Durgan and Pfannerstill', '52201', 'Faroe Islands', 'New Hampshire', 'O''Connellstad', 97, 39, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/35.jpg', 'Russel - Adams', '91844-8392', 'Costa Rica', 'Pennsylvania', 'East Darrickside', 98, 59, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1131.jpg', 'Koch, Bahringer and Koss', '02295-8993', 'Holy See (Vatican City State)', 'Arkansas', 'East Annamae', 99, 25, 'Male');
INSERT INTO profiles VALUES ('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1149.jpg', 'Tillman - Greenfelder', '99145-3800', 'Georgia', 'Iowa', 'Hilmastad', 100, 45, 'Male');