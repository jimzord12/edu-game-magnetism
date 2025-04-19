CREATE TABLE `quiz_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_id` integer,
	`score` integer NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
