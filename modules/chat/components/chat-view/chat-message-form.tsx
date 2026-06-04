"use client";

import TextareaAutosize from "react-textarea-autosize";

import { useEffect, useMemo, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useAiModels } from "../../hooks/use-ai-models";
import ModelSelector from "./model-selector";

const ChatMessageForm = ({
  initialMessage,
  onMessageChange,
}) => {
  const { data, isPending } = useAiModels();

const models = data?.models ?? [];

  const [message, setMessage] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (!selectedModelId && models.length > 0) {
      setSelectedModelId(models[0].id);
    }
  }, [models, selectedModelId]);

const selectedModel = useMemo(
  () => models.find((model) => model.id === selectedModelId),
  [models, selectedModelId]
);
  const handleChange = (e) => {
    setMessage(e.target.value);
    onMessageChange?.();
  };

  const handleSubmit = () => {
    if (!message.trim()) return;

    console.log({
      message,
      modelId: selectedModelId,
      model: selectedModel,
    });

    // TODO:
    // mutate({
    //   content: message,
    //   modelId: selectedModelId
    // })

    setMessage("");
  };

  return (
  <div className="w-full max-w-3xl px-3 sm:px-4">
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        sm:rounded-3xl
        border
        border-zinc-200
        bg-white
        shadow-sm
        dark:border-zinc-800
        dark:bg-zinc-900/50
      "
    >
      <TextareaAutosize
  minRows={1}
  maxRows={8}
  value={message}
  onChange={handleChange}
  placeholder="Ask anything..."
  className="
    w-full
    resize-none
    border-0
    bg-transparent
    px-4
    py-4
    text-sm
    outline-none
  "
/>

      <div
        className="
          flex
          items-center
          justify-between
          gap-2

          px-3
          pb-3

          sm:px-4
          sm:pb-4
        "
      >
        <ModelSelector
          models={models}
          selectedModelId={selectedModelId}
          onModelSelect={setSelectedModelId}
          className="
            max-w-[140px]
            sm:max-w-[220px]
          "
        />

        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!message.trim() || isPending}
          className="
            h-9
            w-9

            sm:h-10
            sm:w-10

            rounded-full

            bg-purple-600
            text-white
            hover:bg-purple-700

            disabled:opacity-50
            disabled:cursor-not-allowed

            shrink-0
          "
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);
};

export default ChatMessageForm;