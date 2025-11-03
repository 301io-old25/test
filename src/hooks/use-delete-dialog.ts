import { useState } from 'react';

interface UseDeleteDialogProps {
  onDelete: (id: string) => Promise<void>;
}

export function useDeleteDialog({ onDelete }: UseDeleteDialogProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  const openDeleteDialog = (id: string, name?: string) => {
    setItemToDelete({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await onDelete(itemToDelete.id);
    }
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    itemToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete
  };
}
