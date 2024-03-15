ALTER TABLE "vms" RENAME COLUMN "owner" TO "owner_id";--> statement-breakpoint
ALTER TABLE "vms" DROP CONSTRAINT "vms_owner_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vms" ADD CONSTRAINT "vms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
