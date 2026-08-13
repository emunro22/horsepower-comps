ALTER TABLE "competitions" ADD COLUMN "original_draw_date" timestamp;--> statement-breakpoint
UPDATE "competitions" SET "original_draw_date" = "draw_date" WHERE "original_draw_date" IS NULL;