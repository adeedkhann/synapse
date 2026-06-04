"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@/modules/authentication/components/userButton";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  PlusIcon,
  SearchIcon,
  EllipsisIcon,
  Trash,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dummyChats = [
  { id: "1", title: "Build a Next.js SaaS", group: "Today" },
  { id: "2", title: "Prisma Interview Questions", group: "Today" },
  { id: "3", title: "Leetcode Clone Roadmap", group: "Yesterday" },
  { id: "4", title: "System Design Notes", group: "Previous 7 Days" },
];

export const ChatSidebarContent = ({
  user,
  collapsed = false,
}: {
  user: React.ReactNode;
  collapsed?: boolean;
}) => {
  const groupedChats = {
    Today: dummyChats.filter((c) => c.group === "Today"),
    Yesterday: dummyChats.filter((c) => c.group === "Yesterday"),
    "Previous 7 Days": dummyChats.filter(
      (c) => c.group === "Previous 7 Days"
    ),
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* New Chat */}
      <div className="p-3">
        <Button
          variant="secondary"
          className={`w-full ${
            collapsed ? "justify-center px-0" : "justify-start gap-2"
          }`}
        >
          <PlusIcon className="size-4 shrink-0" />

          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* Search */}
          <div className="px-3 pb-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search chats..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Chats */}
          <div className="flex-1 overflow-y-auto px-2">
            {Object.entries(groupedChats).map(([group, chats]) => (
              <div key={group} className="mb-6">
                <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                  {group}
                </p>

                <div className="space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        rounded-lg
                        px-2
                        py-2
                        text-sm
                        hover:bg-muted
                        transition-colors
                      "
                    >
                      <Link
                        href={`/chat/${chat.id}`}
                        className="flex-1 truncate"
                      >
                        {chat.title}
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="
                              size-7
                              opacity-0
                              transition-opacity
                              group-hover:opacity-100
                              data-[state=open]:opacity-100
                            "
                          >
                            <EllipsisIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-auto border-t border-border p-3">
        {collapsed ? (
          <div className="flex justify-center">
            <UserButton user={user} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Account
            </span>

            <UserButton user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

const ChatSidebar = ({
  user,
}: {
  user: React.ReactNode;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile */}
      <div className="fixed left-3 top-3 z-50 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[280px] p-0"
          >
            <ChatSidebarContent user={user} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <aside
        className={`
          hidden
          md:flex
          h-screen
          shrink-0
          flex-col
          border-r
          border-border
          bg-background
          transition-all
          duration-300

          ${collapsed ? "w-16" : "w-72"}
        `}
      >
        {/* Collapse Toggle */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCollapsed((prev) => !prev)
            }
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>

        <ChatSidebarContent
          user={user}
          collapsed={collapsed}
        />
      </aside>
    </>
  );
};

export default ChatSidebar;