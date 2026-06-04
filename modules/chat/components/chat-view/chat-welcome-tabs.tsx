"use client";
import React, { useState } from 'react'

    const data = [
  {
    "tab": "Create",
    "icon": "sparkles",
    "prompts": [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction"
    ]
  },
  {
    "tab": "Explore",
    "icon": "compass",
    "prompts": [
      "Explain the concept of quantum computing using a simple analogy",
      "What are the most interesting historical facts about ancient civilizations?",
      "Recommend top travel destinations for hiking and outdoor photography",
      "Summarize the major philosophical differences between Stoicism and Epicureanism"
    ]
  },
  {
    "tab": "Code",
    "icon": "code",
    "prompts": [
      "Write a TypeScript function to deeply clone a nested object",
      "How do I set up custom middleware in a Next.js App Router project?",
      "Debug this SQL query performance issue and suggest indexes",
      "Explain the difference between useEffect and useLayoutEffect in React"
    ]
  },
  {
    "tab": "Learn",
    "icon": "academic-cap",
    "prompts": [
      "Give me a 4-week study plan to learn the basics of linear algebra",
      "How does the human immune system recognize and fight off new viruses?",
      "Explain macroeconomics principles and how inflation affects interest rates",
      "Walk me through the step-by-step process of cell division (Mitosis)"
    ]
  }
]


const ChatWelcomeTabs = ({username="adeed khan" , onMessageSelect}) => {

const [activeTab, setActiveTab] = useState('Create');

  // Find prompts for the currently active tab
  const activePromptData = data.find((item) => item.tab === activeTab);

return (
  <div className="w-full max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center gap-4 sm:gap-6">
      
      {/* Heading */}
      <h1
        className="
          text-center
          font-bold
          tracking-tight
          text-zinc-900
          dark:text-white
          text-2xl
          sm:text-3xl
          md:text-4xl
          transition-colors
        "
      >
        How can I help you?
      </h1>

      {/* Tabs */}
      <div
        className="
          flex
          flex-wrap
          justify-center
          gap-2
          sm:gap-3
          w-full
        "
      >
        {data.map((item) => {
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`
                whitespace-nowrap
                rounded-full
                border
                transition-all
                duration-200
                font-medium

                px-3 py-2
                text-xs

                sm:px-4
                sm:text-sm

                ${
                  isActive
                    ? `
                      bg-purple-100
                      text-purple-700
                      border-purple-300
                      dark:bg-purple-950/40
                      dark:text-purple-300
                      dark:border-purple-500/30
                    `
                    : `
                      bg-zinc-100
                      text-zinc-600
                      border-zinc-200
                      hover:bg-zinc-200
                      dark:bg-zinc-900/40
                      dark:text-zinc-400
                      dark:border-zinc-800
                      dark:hover:bg-zinc-800
                    `
                }
              `}
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      {/* Prompt Cards */}
      <div className="w-full space-y-2 sm:space-y-3">
        {activePromptData?.prompts.map((prompt, index) => (
          <button
            key={index}
            className="
              w-full
              text-left
              rounded-2xl
              border
              transition-all
              duration-200

              px-4 py-3
              sm:px-5 sm:py-4

              text-sm
              sm:text-[15px]

              bg-white
              text-zinc-700
              border-zinc-200
              shadow-sm

              hover:bg-zinc-50
              hover:border-zinc-300
              hover:shadow-md

              dark:bg-zinc-900/30
              dark:text-zinc-300
              dark:border-zinc-800/50
              dark:hover:bg-zinc-800/40
              dark:shadow-none
            "
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  </div>
);
}
export default ChatWelcomeTabs