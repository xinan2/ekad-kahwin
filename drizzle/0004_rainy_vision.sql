ALTER TABLE "wedding_details" ADD COLUMN "groom_father_title_en" varchar(255) DEFAULT 'Father of the Groom';--> statement-breakpoint
ALTER TABLE "wedding_details" ADD COLUMN "groom_father_title_ms" varchar(255) DEFAULT 'Ayah Pengantin Lelaki';--> statement-breakpoint
ALTER TABLE "wedding_details" ADD COLUMN "groom_mother_title_en" varchar(255) DEFAULT 'Mother of the Groom';--> statement-breakpoint
ALTER TABLE "wedding_details" ADD COLUMN "groom_mother_title_ms" varchar(255) DEFAULT 'Ibu Pengantin Lelaki';--> statement-breakpoint
ALTER TABLE "wedding_details" ADD COLUMN "bride_father_title_en" varchar(255) DEFAULT 'Father of the Bride';--> statement-breakpoint
ALTER TABLE "wedding_details" ADD COLUMN "bride_father_title_ms" varchar(255) DEFAULT 'Ayah Pengantin Perempuan';--> statement-breakpoint
ALTER TABLE "wedding_details" ADD COLUMN "bride_mother_title_en" varchar(255) DEFAULT 'Mother of the Bride';--> statement-breakpoint
ALTER TABLE "wedding_details" ADD COLUMN "bride_mother_title_ms" varchar(255) DEFAULT 'Ibu Pengantin Perempuan';