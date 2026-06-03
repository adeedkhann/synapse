"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";

type UserButtonProps = {
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  };
};

export function UserButton({ user }: UserButtonProps) {

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none cursor-pointer">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2">
          <p className="font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}