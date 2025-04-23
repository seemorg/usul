"use client";

import dynamic from "next/dynamic";
import YearFilterSkeleton from "./skeleton";

const YearFilterClient = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => <YearFilterSkeleton defaultRange={[0, 0]} maxYear={0} />,
});

export default YearFilterClient;
