import { PropsWithChildren } from "react";
import { FaPlus } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Edit, Trash2 } from "lucide-react";

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
    <div className="flex flex-col items-center gap-2">
      {isDisplayPrevAdd && (
        <div>
          <Button onClick={handlePrevAdd} type="button">
            Add
          </Button>
        </div>
      )}
      <Card className="w-[350px] flex gap-2 p-2">
        <div className="w-10/12">{children}</div>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={isDeleteDisabled}
          onClick={() => {
            !isDeleteDisabled && onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Card>
      {isDisplayNextAdd && (
        <div>
          <Button onClick={handleNextAdd} type="button">
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
