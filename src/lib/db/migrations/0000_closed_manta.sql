CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text DEFAULT 'Community Post' NOT NULL,
	"content" text NOT NULL,
	"author_id" uuid NOT NULL,
	"media" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255) DEFAULT '',
	"last_name" varchar(255) DEFAULT '',
	"image_url" text DEFAULT '',
	"cover_image_url" text DEFAULT '',
	"bio" text DEFAULT '',
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;