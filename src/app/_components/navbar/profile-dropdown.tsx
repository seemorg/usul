"use client";

import { useState } from "react";
import { EntityAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/auth";
import { navigation } from "@/lib/urls";
import { Link, useRouter } from "@/navigation";
import { BadgeCheckIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function ProfileDropdown() {
  const session = useSession();
  const router = useRouter();
  const t = useTranslations();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          throw: true,
        },
      });
      router.replace("/", undefined, { showProgressBar: false });
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (session.isPending) {
    return <Skeleton className="bg-secondary/20 block size-10 shrink-0" />;
  }

  if (!session.data) {
    return (
      <Button asChild size="icon" variant="ghost" className="shrink-0">
        <Link href={navigation.login()}>
          <LogInIcon className="size-4" />
        </Link>
      </Button>
    );
  }

  const user = session.data.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-border size-10 shrink-0 overflow-hidden rounded-full border-2 data-[state=open]:border-white">
          <EntityAvatar
            type="user"
            entity={user}
            className="size-full rounded-none"
            fallbackClassName="rounded-none"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <EntityAvatar type="user" entity={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              {user.name ? (
                <>
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </>
              ) : (
                <span className="truncate font-semibold">{user.email}</span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <BadgeCheckIcon />
            {t("common.profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          <LogOutIcon />
          {t("common.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
