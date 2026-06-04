"use client";

import React, { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

const ChatMessageView = ({ user }) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
  };

  const handleMessageChange = () => {
    setSelectedMessage("");
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-[calc(100vh-3rem)]
          w-full
          max-w-5xl
          flex-col
          items-center
          justify-center
          gap-6
          sm:gap-8
          md:gap-10
        "
      >
        <ChatWelcomeTabs
          username={user?.name}
          onMessageSelect={handleMessageSelect}
        />

        <ChatMessageForm
          initialMessage={selectedMessage}
          onMessageChange={handleMessageChange}
        />
      </div>
    </div>
  );
};

export default ChatMessageView;