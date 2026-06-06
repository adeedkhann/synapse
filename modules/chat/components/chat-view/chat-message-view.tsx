"use client";

import React, { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

interface ChatMessageViewProps {
  user?: { name?: string | null; image?: string | null; email?: string | null } | null;
}

const ChatMessageView = ({ user }: ChatMessageViewProps) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
  };

  const handleMessageChange = () => {
    setSelectedMessage("");
  };

  return (
    <div
      className="
        w-full
        h-full
        flex
        flex-col
      "
    >
      <div
        className="
          flex-1
          overflow-y-auto
          scrollbar-hide
          flex
          flex-col
          items-center
          justify-center
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        <ChatWelcomeTabs
          username={user?.name ?? undefined}
          onMessageSelect={handleMessageSelect}
        />
      </div>

      <div className="shrink-0 px-4 py-4 sm:px-6 lg:px-8 bg-background flex justify-center">
        <div className="w-full max-w-4xl">
          <ChatMessageForm
            initialMessage={selectedMessage}
            onMessageChange={handleMessageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageView;