import Container from "@/components/ui/container";
import data from "~/data.json";

export default function ReaderSidebar() {
  return (
    <div
      className="font-amiri top-0 hidden h-screen w-[18rem] bg-slate-50 shadow-inner lg:sticky lg:flex lg:flex-none lg:flex-col lg:pt-20 xl:w-[21rem]"
      dir="rtl"
    >
      <div className="absolute bottom-0 right-0 top-0 w-px bg-slate-300" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[50vw] max-w-full" />

      <Container className="mx-0 mt-10">
        <h2 className="text-2xl font-bold">{data.book.title_ar[0]}</h2>
        <p className="text-sm text-gray-700">{data.author.author_ar[0]}</p>
      </Container>

      <div className="relative mt-12 h-full w-full overflow-y-auto">
        {/* <div className="w-full h-full overflow-auto"> */}
        <Container className="pb-16">
          {/* w-64 max-w-full pr-8 2xl:w-72 2xl:pr-16 */}
        </Container>
        {/* </div> */}
      </div>
    </div>
  );
}
