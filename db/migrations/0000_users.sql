-- Migration number: 0000 	 2024-01-07T16:19:10.789Z
CREATE TABLE IF NOT EXISTS `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `avatar` varchar(255) DEFAULT NULL,
  `first` varchar(255) DEFAULT NULL,
  `last` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL
);