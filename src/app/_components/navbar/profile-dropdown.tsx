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
import { signOut, useSession } from "@/lib/auth";
import { navigation } from "@/lib/urls";
import { Link, useRouter } from "@/navigation";
import { BadgeCheckIcon, FolderIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
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

  return { handleSignOut, isSigningOut };
}

export function ProfileDropdown() {
  const session = useSession();
  const t = useTranslations();
  const { handleSignOut, isSigningOut } = useLogout();

  if (session.isPending) {
    return (
      <Button variant="ghost" size="icon" className="shrink-0" disabled>
        <UserIcon className="size-5" />
      </Button>
    );
  }

  if (!session.data) {
    return (
      <Button asChild variant="ghost" size="icon" className="shrink-0">
        <Link href={navigation.login()}>
          <UserIcon className="size-5" />
        </Link>
      </Button>
    );
  }

  const user = session.data.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <UserIcon className="size-5" />
        </Button>
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
          <Link href={navigation.profile()}>
            <BadgeCheckIcon />
            {t("common.profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={navigation.collections.all()}>
            <FolderIcon />
            {t("entities.collections")}
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
