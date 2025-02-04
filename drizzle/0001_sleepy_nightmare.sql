ALTER TABLE `messages` ADD `input_tokens` integer;--> statement-breakpoint
ALTER TABLE `messages` ADD `output_tokens` integer;--> statement-breakpoint
ALTER TABLE `messages` ADD `completion_id` text;