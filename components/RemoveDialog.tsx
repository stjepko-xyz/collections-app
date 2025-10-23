"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface RemoveDialogProps {
  itemId: number;
  itemName?: string; // Optional: e.g., "collection", "item", "user"
  title?: string; // Optional: Custom title
  description?: string; // Optional: Custom description
  redirectPath?: string; // Optional: Where to redirect after deletion
  onDelete: (id: number) => Promise<{ success: boolean; error?: string }>;
}

const RemoveDialog = ({
  itemId,
  itemName = "item",
  title = "Are you absolutely sure?",
  description,
  redirectPath,
  onDelete,
}: RemoveDialogProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const defaultDescription =
    description ||
    `This action cannot be undone. This will permanently delete your ${itemName} and remove your data from our servers.`;

  const handleDelete = async () => {
    setError(null);

    const result = await onDelete(itemId);

    if (result.success) {
      if (redirectPath) {
        router.push(redirectPath);
      }
    } else {
      setError(result.error || `Failed to delete ${itemName}`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          {isPending ? "Removing..." : "Remove"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{defaultDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveDialog;
