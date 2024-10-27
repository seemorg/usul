import ReaderContextProviders from "./_components/context";

function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReaderContextProviders>
      <div className="max-h-screen overflow-hidden">{children}</div>
    </ReaderContextProviders>
  );
}

export default ReaderLayout;
