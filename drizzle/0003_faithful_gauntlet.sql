CREATE TABLE "collections_to_items" (
	"collection_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	CONSTRAINT "collections_to_items_collection_id_item_id_pk" PRIMARY KEY("collection_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_collectionId_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "collections_to_items" ADD CONSTRAINT "collections_to_items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections_to_items" ADD CONSTRAINT "collections_to_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "collectionId";