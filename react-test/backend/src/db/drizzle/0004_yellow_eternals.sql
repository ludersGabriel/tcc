ALTER TABLE "vms" ADD COLUMN "owner" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vms" ADD CONSTRAINT "vms_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
