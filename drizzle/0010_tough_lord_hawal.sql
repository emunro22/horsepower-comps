CREATE TABLE "marketing_campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"interval_days" integer DEFAULT 30 NOT NULL,
	"last_sent_at" timestamp,
	"last_recipient_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
