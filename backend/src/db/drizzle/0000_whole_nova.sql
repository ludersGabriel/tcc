CREATE SCHEMA "guac_schema";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guac_schema"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text,
	"password" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "username_idx" ON "guac_schema"."users" ("username");