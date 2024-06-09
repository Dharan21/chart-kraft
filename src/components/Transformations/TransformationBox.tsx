import { PropsWithChildren } from "react";
import { FaPlus } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";

type TransformationBoxProps = {
  isDisplayPrevAdd?: boolean;
  isDisplayNextAdd?: boolean;
  isDeleteDisabled?: boolean;
  handlePrevAdd: () => void;
  handleNextAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TransformationBoxComponent({
  isDisplayPrevAdd = true,
  isDisplayNextAdd = true,
  isDeleteDisabled = false,
  handlePrevAdd,
  handleNextAdd,
  onEdit,
  onDelete,
  children,
}: PropsWithChildren<TransformationBoxProps>) {
  return (
    <div className="min-h-12 w-full rounded-2xl border-2 border-white relative">
      {isDisplayPrevAdd && (
        <div
          className="absolute top-0 left-[50%] border-2 border-white rounded-full p-1 bg-primary cursor-pointer"
          style={{ transform: "translate(-50%, -50%)", zIndex: 1 }}
          onClick={handlePrevAdd}
        >
          <FaPlus className="text-white" />
        </div>
      )}
      {isDisplayNextAdd && (
        <div
          className="absolute bottom-0 left-[50%] border-2 border-white rounded-full p-1 bg-primary cursor-pointer"
          style={{ transform: "translate(-50%, 50%)", zIndex: 1 }}
          onClick={handleNextAdd}
        >
          <FaPlus className="text-white" />
        </div>
      )}
      <div className="flex p-2 gap-2">
        <div className="w-10/12">{children}</div>
        <button
          type="button"
          className="w-1/12 flex justify-center items-center"
          onClick={onEdit}
        >
          <MdModeEditOutline className="h-8 w-8" />
        </button>
        <button
          type="button"
          className={`w-1/12 flex justify-center items-center ${
            isDeleteDisabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            !isDeleteDisabled && onDelete();
          }}
        >
          <MdDelete className={`h-8 w-8 ${isDeleteDisabled ? " text-gray-500" : ""}`} />
        </button>
      </div>
    </div>
  );
}
