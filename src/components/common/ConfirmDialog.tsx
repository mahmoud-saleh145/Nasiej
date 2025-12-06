"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  trigger,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />

        <Dialog.Content className="DialogContent">
          <Dialog.Title className="text-lg font-semibold text-text mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-5">
            {description}
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                {cancelText}
              </button>
            </Dialog.Close>

            <Dialog.Close asChild>
              <button
                onClick={onConfirm}
                className="bg-buttons text-text px-4 py-2 rounded-lg hover:bg-buttons-hover transition"
              >
                {confirmText}
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <Cross2Icon className="w-8 h-8" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
