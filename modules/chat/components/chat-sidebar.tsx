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

// 1. Define the Chat Type matching Prisma Model
interface ChatItem {
  id: string;
  title: string;
  model: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// 2. Helper function to dynamically group incoming DB chats by date
const groupChatsByDate = (chatsList: ChatItem[]) => {
  const groups: { [key: string]: ChatItem[] } = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  chatsList.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt);

    if (chatDate >= startOfToday) {
      groups["Today"].push(chat);
    } else if (chatDate >= startOfYesterday) {
      groups["Yesterday"].push(chat);
    } else if (chatDate >= sevenDaysAgo) {
      groups["Previous 7 Days"].push(chat);
    } else {
      groups["Older"].push(chat);
    }
  });

  // Clean out empty time periods dynamically so empty sections don't render
  return Object.fromEntries(
    Object.entries(groups).filter(([_, items]) => items.length > 0)
  );
};

export const ChatSidebarContent = ({
  user,
  chats = [], // Default to an empty array to prevent undefined runtime errors
  collapsed = false,
}: {
  user: React.ReactNode;
  chats?: ChatItem[];
  collapsed?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  

  // Filter chats by search query if the user types anything
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = groupChatsByDate(filteredChats);

  const [selectedId , setSelectedId] = useState("")

const handleDelete = (e:React.MouseEvent ,chatId:string)=>{
  e.preventDefault();
  e.stopPropagation();
  setSelectedId(chatId)
  
}









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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Dynamic Chats */}
          <div className="flex-1 overflow-y-auto px-2">
            {Object.keys(groupedChats).length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">
                No chats found
              </p>
            ) : (
              Object.entries(groupedChats).map(([group, groupItems]) => (
                <div key={group} className="mb-6">
                  <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                    {group}
                  </p>

                  <div className="space-y-1">
                    {groupItems.map((chat) => (
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
                          className="flex-1 truncate pr-2"
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
                              <Trash
                              onClick={()=>handleDelete(chat.id)}
                              className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
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
  chats = [], // Accepting the dynamic array from your parent page component
}: {
  user: React.ReactNode;
  chats?: ChatItem[];
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile view */}
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
            {/* Added chats prop here */}
            <ChatSidebarContent user={user} chats={chats} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop view */}
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
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>

        {/* Added chats prop here */}
        <ChatSidebarContent
          user={user}
          chats={chats}
          collapsed={collapsed}
        />
      </aside>
    </>
  );
};

export default ChatSidebar;