ALTER TABLE "collections_to_items" DROP CONSTRAINT "collections_to_items_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "collections_to_items" DROP CONSTRAINT "collections_to_items_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "collections_to_items" ADD CONSTRAINT "collections_to_items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections_to_items" ADD CONSTRAINT "collections_to_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;