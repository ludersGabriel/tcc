ALTER TABLE "guac_schema"."users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guac_schema"."users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guac_schema"."users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");