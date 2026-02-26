import Container from "@/components/ui/container";
import { ExpandableDescription } from "@/components/expandable-description";

export default function RootEntityPage({
  children,
  title,
  subtitle,
  description,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  description?: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-muted-primary flex h-fit min-h-[250px] w-full items-center justify-center pt-16 text-white sm:min-h-[300px] sm:pt-24">
        <Container className="flex flex-col sm:flex-row justify-start">
          <Container className="flex-1/3 flex flex-col items-center">
            <h1 className="text-6xl font-bold sm:text-7xl">{title}</h1>
            {subtitle && (
              <p className="text-secondary mt-5 text-lg dark:text-gray-300">
                {subtitle}
              </p>
            )}
          </Container>
          <Container>
            {description && (
              <ExpandableDescription className="mt-5">{description}</ExpandableDescription>
            )}
          </Container>
        </Container>
      </div>

      <Container className="bg-background mt-10 sm:mt-20">{children}</Container>
    </>
  );
}
