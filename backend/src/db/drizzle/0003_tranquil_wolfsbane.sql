CREATE TABLE IF NOT EXISTS "vms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"hostname" text NOT NULL,
	"port" integer NOT NULL,
	"width" integer DEFAULT 1280 NOT NULL,
	"height" integer DEFAULT 720 NOT NULL,
	"security" text DEFAULT 'any' NOT NULL,
	"ignore_cert" boolean DEFAULT true NOT NULL,
	"enable_wallpaper" boolean DEFAULT true NOT NULL,
	"disable_auth" boolean DEFAULT true NOT NULL,
	"server_layout" text DEFAULT 'en-us-qwerty' NOT NULL
);
