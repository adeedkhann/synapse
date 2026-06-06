"use client";
import {useChat} from "@ai-sdk/react"
import { DefaultChatTransport , type UIMessage} from "ai";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useGetChatById } from "../../hooks/use-chats";
import { useAiModels } from "../../hooks/use-ai-models";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import { Spinner } from "@/components/ui/spinner";
import ModelSelector from "../chat-view/model-selector";
import { RotateCcwIcon, StopCircleIcon } from "lucide-react";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { toast } from "sonner";

function parseMessageToUI(msg) {
  const basePart = { type: "text", text: msg.content };

  try {
    const parts = JSON.parse(msg.content);
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: Array.isArray(parts) ? parts : [basePart],
      createdAt: msg.createdAt,
    };
  } catch (error) {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [basePart],
      createdAt: msg.createdAt,
    };
  }
}

type DBMessage = {
  id: string;
  content: string;
  messageRole: "USER" | "ASSISTANT";
  createdAt: string | Date;
};

type MessagePartShape = {
  type: string;
  text?: string;
  [key: string]: unknown;
};




function MessagePart({ part, messageId, partIndex, role ,isStreaming}:{
  part : MessagePartShape,
  messageId:string,
  partIndex:number,
  role:UIMessage["role"],
  isStreaming:boolean;
}) {
  const key = `${messageId}-${partIndex}`;

  if (part.type === "text") {
    return (
      <Message from={role} key={key}>
        <MessageContent>
          <MessageResponse>{part.text}</MessageResponse>
        </MessageContent>
      </Message>
    );
  }

  if (part.type === "reasoning") {
    return (
      <Reasoning
        className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
        key={key}
        isStreaming={isStreaming}
      >
        <ReasoningTrigger />
        <ReasoningContent className="mt-1 italic font-light text-muted-foreground">
          {part.text}
        </ReasoningContent>
      </Reasoning>
    );
  }

  if (part.type === "step-start" && partIndex > 0) {
    return (
      <div className="my-4 text-gray-500">
        <hr className="border-gray-300" />
      </div>
    );
  }

  return null;
}

const MessageViewWithForm = ({ chatId }: {chatId:string}) => {
 const {data:chatData , isPending} = useGetChatById(chatId);

 console.log(chatData)

 if(isPending){
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner/>
    </div>
  )
 }

 if(!chatData?.success || !chatData?.data){
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Chat Not Found
    </div>
  )
 }

 const rawMessages = (chatData.data.messages ?? [])
 const initialMessages:UIMessage[] = rawMessages.filter((m)=>m?.id && m?.content?.trim())
 .map(parseMessageToUI);

 return (
  <ChatView
  chatId={chatId}
  initialMessages={initialMessages}
  initialModel={chatData.data.model}
  />
 )
};

const ChatView = ({
  chatId,
  initialMessages,
  initialModel,
}:{
  chatId:string,
  initialMessages:UIMessage[],
  initialModel: string | null

})=>{

   const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";
  const hasAutoTrigger = useRef(false);
  const [selectedModel  ,setSelectedModel]=useState<string | null>(initialModel)
  const {data : modelsData , isPending:isModelLoading } = useAiModels()

    const transport = useMemo(()=> new DefaultChatTransport({
    api:"/api/chat"
  }),[])


  const {messages , status , sendMessage , regenerate , stop, error} = useChat({
    id:chatId,
    messages:initialMessages,
    transport,
    onError:(error)=>{
      console.log("chat error" , error)
    toast.error(error.message

    )

    }
  })

  
  const isBusy = status==="submitted" || status === "streaming";

  
    useEffect(() => {
    if (!shouldAutoTrigger) return;
    if (hasAutoTrigger.current) return;
    if (!selectedModel) return;
    if (messages.length === 0) return;
    if (messages.at(-1)?.role !== "user") return;

    hasAutoTrigger.current = true;

    regenerate({
      body: {
        chatId,
        model: selectedModel,
        skipUserMessage: true,
      },
    }).catch((err) => {
      console.error("Auto-trigger failed:", err);
      toast.error("Failed to generate response");
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("autoTrigger");
    const query = params.toString();
    router.replace(`/chat/${chatId}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [
    shouldAutoTrigger,
    selectedModel,
    messages,
    chatId,
    regenerate,
    router,
    searchParams,
  ]);


  const handleSubmit = async(message:PromptInputMessage)=>{

    const text = message.text?.trim();

    if(!text) return;

    if(!selectedModel){
      toast.error("please select a model first")
      return;
    }

    if(isBusy){
      return;
    }

    try {
      await sendMessage(
        {text},
        {
          body:{
            chatId,
            model:selectedModel,
            skipUserMessage:false,
          }
        }
      )
    } catch (error) {
        console.error("send message failed" , error)
        toast.error("failed to send message")
    }


  }


  return (
      <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Conversation className="h-full flex-1">
          <ConversationContent className="max-w-2xl mx-auto">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Start the conversation"
                description="Send a message to get started."
              />
            ) : (
              messages.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => (
                    <MessagePart
                      key={`${message.id}-${i}`}
                      part={part as MessagePartShape}
                      messageId={message.id}
                      partIndex={i}
                      role={message.role}
                      isStreaming={
                        isBusy &&
                        message === messages.at(-1) &&
                        i === message.parts.length - 1
                      }
                    />
                  ))}
                </Fragment>
              ))
            )}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive">
                {error.message || "Something went wrong."}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

        <div className="shrink-0  bg-background px-3 py-3 flex justify-center">
          <div className="max-w-xl w-full">
            <PromptInput onSubmit={handleSubmit} className="">
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder="Type your message..."
                  disabled={isBusy}
                />
              </PromptInputBody>

              <PromptInputFooter>
                <PromptInputTools className="flex items-center justify-between gap-2 w-full">
                  <div className="flex-1">
                    {isModelLoading ? (
                      <Spinner />
                    ) : (
                      <ModelSelector
                        models={modelsData?.models ?? []}
                        selectedModelId={selectedModel}
                        onModelSelect={setSelectedModel}
                        className=""
                      />
                    )}
                  </div>
                  <PromptInputSubmit status={status} onStop={stop} />
                </PromptInputTools>
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
  )


}


export default MessageViewWithForm;
