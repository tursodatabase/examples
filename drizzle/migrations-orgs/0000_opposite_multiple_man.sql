CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`agent_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`sender` text NOT NULL,
	`message` text NOT NULL,
	`conversation_id` text,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_email` text NOT NULL,
	`customer_name` text NOT NULL,
	`query` text,
	`is_closed` integer DEFAULT 0 NOT NULL,
	`service_rating` integer,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `agents` (`email`);