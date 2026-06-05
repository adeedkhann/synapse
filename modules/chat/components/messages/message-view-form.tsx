"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useGetChatById } from "../../hooks/use-chats";
import { useAiModels } from "../../hooks/use-ai-models";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
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

function MessagePart({ part, messageId, partIndex, role }) {
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

interface MessageViewWithFormProps {
  chatId: string;
}

const MessageViewWithForm = ({ chatId }: MessageViewWithFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";
  const hasAutoTrigger = useRef(false);

  const [selectedModel, setSelectedModel] = useState(null);
  const [input, setInput] = useState("");

  const { data: modelsData, isPending: isModelLoading } = useAiModels();
  const { data, isPending } = useGetChatById(chatId);

  const models = Array.isArray(modelsData?.models) ? modelsData.models : [];

  const initialMessages = useMemo(() => {
    if (!data?.data?.messages) return [];

    return data.data.messages
      .filter((msg) => msg.content?.trim() && msg.id)
      .map(parseMessageToUI);
  }, [data]);

  useEffect(() => {
    if (data?.data?.model && !selectedModel) {
      setSelectedModel(data.data.model);
    }
  }, [data, selectedModel]);

  if (isPending) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  const handleSubmit = () => {};

  const isStreaming = false;
  const allMessages = [...initialMessages];
  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {allMessages.length === 0 ? (
              <div>Start a conversation</div>
            ) : (
              allMessages.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => (
                    <MessagePart
                      key={`${message.id}-${i}`}
                      part={part}
                      messageId={message.id}
                      partIndex={i}
                      role={message.role}
                    />
                  ))}
                </Fragment>
              ))
            )}
          </ConversationContent>
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message.."
              disabled={isStreaming}
            ></PromptInputTextarea>
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools className="flex items-center gap-2 w-full">
              {isModelLoading ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                  className="
                    max-w-[140px]
                    sm:max-w-[220px]
                  "
                />
              )}
            </PromptInputTools>
            <PromptInputSubmit status="ready" />
          </PromptInputFooter>

          {/* {isStreaming ? (

                <PromptInputButton onClick={stop}>
                  <StopCircleIcon size={16}/>
                  <span>Stop</span>
                </PromptInputButton>
              ):(
                allMessages.length >0 && (
                  <PromptInputButton onClick={regenerate}>
                    <RotateCcwIcon size={16}/>
                    <span>Retry</span>
                  </PromptInputButton>
                )
              )} */}
        </PromptInput>
      </div>
    </div>
  );
};

export default MessageViewWithForm;
