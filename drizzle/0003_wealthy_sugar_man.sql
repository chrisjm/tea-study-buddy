CREATE TABLE `tea_steeps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tea_session_id` integer NOT NULL,
	`steep_number` integer NOT NULL,
	`temperature` integer,
	`steep_time_min` integer,
	`steep_time_max` integer,
	`actual_steep_time` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`tea_session_id`) REFERENCES `tea_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
