export const EntryRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 bg-slate-300 text-white rounded-lg border border-slate-400 shadow-lg select-none grid grid-cols-2 gap-6">
      {children}
    </div>
  );
};
