export interface HintProps {
  id: string;
  title: string;
  content?: string;
  author: string;
  timestamp: Date;
  referenceTo?: string;
}

export const Hint: React.FC<HintProps> = (hint: HintProps) => {
  return (
    <div className="font-normal">
      <div>{hint.title}</div>
      <div>{hint.content}</div>
      <div>{hint.author}</div>
      <div>{hint.timestamp.getDate()}</div>
      <div>{hint.referenceTo}</div>
    </div>
  );
};
