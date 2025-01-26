import Container from "@/components/ui/container";

export default function RootEntityPage({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-muted-primary flex h-[250px] w-full items-center justify-center pt-16 text-white sm:h-[300px] sm:pt-24">
        <Container className="flex flex-col items-center">
          <h1 className="text-6xl font-bold sm:text-7xl">{title}</h1>
          {description && (
            <p className="mt-5 text-lg text-secondary dark:text-gray-300">
              {description}
            </p>
          )}
        </Container>
      </div>

      <Container className="mt-10 bg-background sm:mt-20">{children}</Container>
    </>
  );
}
