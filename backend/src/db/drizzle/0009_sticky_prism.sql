CREATE TABLE IF NOT EXISTS "configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text DEFAULT 'main' NOT NULL,
	"total_mem" integer DEFAULT 50 NOT NULL,
	"concurrent_creation" integer DEFAULT 2 NOT NULL,
	CONSTRAINT "configs_key_unique" UNIQUE("key")
);
