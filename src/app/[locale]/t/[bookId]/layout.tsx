import Providers from "./providers";

function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="max-h-screen overflow-hidden bg-reader">{children}</div>
    </Providers>
  );
}

export default ReaderLayout;
