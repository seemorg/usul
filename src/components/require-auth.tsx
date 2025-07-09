"use client";

import { useSession } from "@/lib/auth";
import { navigation } from "@/lib/urls";
import { usePathname, useRouter } from "@/navigation";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

import Spinner from "./ui/spinner";

type Data = NonNullable<ReturnType<typeof useSession>["data"]>;

export default function RequireAuth({
  children,
  skeleton,
}: {
  children: React.ReactNode | ((session: Data) => React.ReactNode);
  skeleton?: React.ReactNode;
}) {
  const { data, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const loadingState = skeleton || (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );

  useIsomorphicLayoutEffect(() => {
    if (!isPending && !data) {
      const url = navigation.login() + "?r=" + pathname;
      router.push(url, undefined, { showProgressBar: false });
    }
  }, [isPending, data]);

  // show loading state when redirecting so that the user doesn't see a blank page
  if (isPending || !data) {
    return loadingState;
  }

  return typeof children === "function" ? children(data) : children;
}
