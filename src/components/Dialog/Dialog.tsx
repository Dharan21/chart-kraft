import React, { PropsWithChildren } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function DialogComponent({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<DialogProps>) {
  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 text-text"
            onClick={onClose}
          ></div>
          <dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 overflow-y-auto max-h-[70vh] text-text bg-background"
          >
            <div className="p-5">{children}</div>
          </dialog>
        </>
      )}
    </>
  );
}
