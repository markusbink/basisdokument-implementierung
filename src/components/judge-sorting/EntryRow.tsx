export const EntryRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="rounded-lg select-none grid grid-cols-2 gap-6">
        {children}
      </div>
    </>
  );
};
