export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 flex h-screen flex-none flex-col overflow-y-auto bg-slate-50 pb-16 pt-20 shadow-inner transition-transform will-change-transform dark:bg-card sm:pt-10">
      {children}
    </div>
  );
}
