CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`thread_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tea_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`thread_id` text,
	`tea_type` text NOT NULL,
	`tea_style` text NOT NULL,
	`brewing_temp` integer,
	`steep_time` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tea_sessions_thread_id_unique` ON `tea_sessions` (`thread_id`);