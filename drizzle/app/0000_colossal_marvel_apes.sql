CREATE TYPE "public"."object_type" AS ENUM('Edge', 'Hub', 'Device', 'Group', 'Gateway', 'Storage', 'Processor');--> statement-breakpoint
CREATE TABLE "data_stream" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"object_id" uuid NOT NULL,
	"name" text NOT NULL,
	"data_type" text NOT NULL,
	"unit" text,
	"frequency" integer,
	"config" text
);
--> statement-breakpoint
CREATE TABLE "edge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	"label" text,
	"data_type" text,
	"config" text
);
--> statement-breakpoint
CREATE TABLE "event_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"object_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"message" text,
	"severity" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "object" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "object_type" NOT NULL,
	"parent_id" uuid,
	"level" integer NOT NULL,
	"config" text
);
--> statement-breakpoint
CREATE TABLE "permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "permission_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "role_job_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_job_user" (
	"user_id" uuid NOT NULL,
	"role_job_id" uuid NOT NULL,
	CONSTRAINT "role_job_user_user_id_role_job_id_pk" PRIMARY KEY("user_id","role_job_id")
);
--> statement-breakpoint
CREATE TABLE "role_permission" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permission_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "user_role_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"hashed_password" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"active" boolean DEFAULT false NOT NULL,
	"avatar" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "data_stream" ADD CONSTRAINT "data_stream_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edge" ADD CONSTRAINT "edge_source_id_object_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."object"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edge" ADD CONSTRAINT "edge_target_id_object_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."object"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_log" ADD CONSTRAINT "event_log_object_id_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object" ADD CONSTRAINT "object_parent_id_object_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."object"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_job_user" ADD CONSTRAINT "role_job_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_job_user" ADD CONSTRAINT "role_job_user_role_job_id_role_job_id_fk" FOREIGN KEY ("role_job_id") REFERENCES "public"."role_job"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_object_parent" ON "object" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_object_type_level" ON "object" USING btree ("type","level");--> statement-breakpoint
CREATE INDEX "idx_role_job_user_user_id" ON "role_job_user" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_role_job_user_role_job_id" ON "role_job_user" USING btree ("role_job_id");--> statement-breakpoint
CREATE INDEX "idx_role_permission_role_id" ON "role_permission" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_role_permission_permission_id" ON "role_permission" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_expires_at" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_user_role_user_id" ON "user_role" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_role_role_id" ON "user_role" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_updated_at" ON "users" USING btree ("updated_at");