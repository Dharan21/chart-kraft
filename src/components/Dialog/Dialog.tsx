import React from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DialogComponent: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose}
          ></div>
          <dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 overflow-y-auto max-h-[70vh]"
          >
            <div className="p-5">{children}</div>
          </dialog>
        </>
      )}
    </>
  );
};

export default DialogComponent;
