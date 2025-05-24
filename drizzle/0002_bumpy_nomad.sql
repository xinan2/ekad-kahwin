ALTER TABLE "wedding_details" ALTER COLUMN "reception_time_start" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "wedding_details" ALTER COLUMN "reception_time_start" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "wedding_details" ALTER COLUMN "reception_time_end" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "wedding_details" ALTER COLUMN "reception_time_end" DROP NOT NULL;