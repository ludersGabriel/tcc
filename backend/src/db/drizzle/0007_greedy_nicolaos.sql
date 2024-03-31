ALTER TABLE "vms" ADD CONSTRAINT "vms_vbox_name_unique" UNIQUE("vbox_name");--> statement-breakpoint
ALTER TABLE "vms" ADD CONSTRAINT "vms_vbox_id_unique" UNIQUE("vbox_id");