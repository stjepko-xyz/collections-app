CREATE TABLE "items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"collectionId" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_collectionId_collections_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;