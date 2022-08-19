import { DotsThree, Eye } from "phosphor-react";
import { Button } from "../Button";
import cx from "classnames";

export interface NoteProps {
  id: string;
  title: string;
  content?: string;
  author: string;
  timestamp: Date;
  referenceTo?: string;
}

export const Note: React.FC<NoteProps> = (note: NoteProps) => (
  <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
    {note.referenceTo && (
      <div className="flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 bg-darkGrey text-lightGrey text-[10px] font-semibold rounded-xl self-end w-fit">
        <Eye size={16} weight="bold" className="inline"></Eye>
        {`${note.referenceTo}`}
      </div>
    )}

    <div className={cx("mx-3", { "mt-3": !note.referenceTo })}>
      <div className="mb-2 text-sm font-extrabold">{note.title}</div>
      <div className="mb-2">{note.content}</div>

      <div className="flex justify-between items-center mb-3">
        <div className="">
          <div className="font-bold">{note.author}</div>
          <div className="opacity-40">
            {`${String(note.timestamp.getDate()).padStart(2, "0")}.
            ${String(note.timestamp.getMonth()).padStart(2, "0")}.
            ${note.timestamp.getFullYear()}`}
          </div>
        </div>
        <div className="self-end">
          <Button
            key="createNote"
            bgColor="bg-lightGrey"
            size="sm"
            textColor="text-darkGrey"
            hasText={false}
            alternativePadding="p-1"
            icon={<DotsThree size={16} weight="bold" />}
          ></Button>
        </div>
      </div>
    </div>
  </div>
);
