import Providers from "./providers";

function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="bg-reader max-h-lvh overflow-hidden">{children}</div>
    </Providers>
  );
}

export default ReaderLayout;
