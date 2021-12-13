CREATE TABLE `book_club_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(20) NULL,
  `last_name` VARCHAR(20) NULL,
  `username` VARCHAR(20) NULL,
  `password` VARCHAR(20) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `book_club_books` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NULL,
  `author` VARCHAR(25) NULL,
  `isbn` VARCHAR(45) NULL,
  `category` VARCHAR(15) NULL,
  `agegroup` VARCHAR(15) NULL,
  `favorite_count` INT,
  PRIMARY KEY (`id`));
  
CREATE TABLE `book_club_favorites` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `book_id` INT NOT NULL,
  PRIMARY KEY (`id`));