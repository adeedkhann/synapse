"use client";

import React, { useMemo, useState } from "react";

import {
  ChevronDown,
  Check,
  CircleDollarSign,
  Info,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AIModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  architecture?: any;
  pricing?: {
    prompt?: string;
    completion?: string;
    request?: string;
  };
  provider?: { name?: string };
  top_provider?: { name?: string };
}

interface ModelSelectorProps {
  models?: AIModel[];
  selectedModelId: string;
  onModelSelect: (id: string) => void;
  className?: string;
}

const ModelSelector = ({
  models = [],
  selectedModelId,
  onModelSelect,
  className,
}: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] = useState<AIModel | null>(null);

  const selectedModel = models.find((model) => model.id === selectedModelId);

  const formatContextLength = (length: number | undefined) => {
    if (!length) return "-";

    if (length >= 1000000) {
      return `${(length / 1000000).toFixed(1)}M`;
    }

    if (length >= 1000) {
      return `${Math.round(length / 1000)}K`;
    }

    return length.toString();
  };

  const isFreeModel = (model: AIModel) => {
    return (
      model?.pricing?.prompt === "0" &&
      model?.pricing?.completion === "0" &&
      model?.pricing?.request === "0"
    );
  };

  const freeModels = useMemo(() => models.filter(isFreeModel), [models]);

  const paidModels = useMemo(
    () => models.filter((m) => !isFreeModel(m)),
    [models],
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`
      h-9
      w-full sm:w-auto
      max-w-[180px] sm:max-w-none
      rounded-full
      border
      border-zinc-200
      bg-zinc-100
      px-3
      text-sm
      text-zinc-700
      hover:bg-zinc-200
      dark:border-zinc-800
      dark:bg-zinc-900
      dark:text-zinc-300
      dark:hover:bg-zinc-800
      ${className}
    `}
          >
            <span className="truncate">
              {selectedModel?.name || "Select Model"}
            </span>

            <ChevronDown className="ml-1.5 h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          sideOffset={8}
          className="
    w-[95vw]
    sm:w-[380px]
    p-0
    border-zinc-200
    dark:border-zinc-800
  "
        >
          <Command>
            <CommandInput
              placeholder="Search models..."
              className="h-12 text-base"
            />

            <CommandList className="max-h-[60vh] sm:max-h-[400px]">
              <CommandEmpty>No models found.</CommandEmpty>

              {freeModels.length > 0 && (
                <CommandGroup heading="Free Models">
                  {freeModels.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.name}
                      onSelect={() => {
                        onModelSelect(model.id);
                        setOpen(false);
                      }}
                      className="
    group
    min-h-[52px]
    py-2
    px-2
  "
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">{model.name}</span>

                          <span className="text-xs text-muted-foreground">
                            {model.provider?.name || model.top_provider?.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="
                              rounded-full
                              bg-purple-100
                              px-2
                              py-0.5
                              text-[10px]
                              font-medium
                              text-purple-700
                              dark:bg-purple-950/40
                              dark:text-purple-300
                            "
                          >
                            FREE
                          </span>

                          <Button
                            size="icon"
                            variant="ghost"
                            className=" h-8
    w-8
    shrink-0
    opacity-100
    md:opacity-0
    md:group-hover:opacity-100
    transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedForDetails(model);
                              setDetailsOpen(true);
                            }}
                          >
                            <Info className="h-4 w-4" />
                          </Button>

                          {selectedModelId === model.id && (
                            <Check className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {paidModels.length > 0 && (
                <CommandGroup heading="Paid Models">
                  {paidModels.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.name}
                      onSelect={() => {
                        onModelSelect(model.id);
                        setOpen(false);
                      }}
                      className="
    group
    min-h-[52px]
    py-2
    px-2
  "
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col">
                          <span>{model.name}</span>

                          <span className="text-xs text-muted-foreground">
                            {model.provider?.name || model.top_provider?.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedForDetails(model);
                              setDetailsOpen(true);
                            }}
                          >
                            <Info className="h-4 w-4" />
                          </Button>

                          {selectedModelId === model.id && (
                            <Check className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          className="
    w-[95vw]
    max-w-lg
    max-h-[85vh]
    overflow-y-auto
    rounded-2xl
    p-4
    sm:p-6
  "
        >
          <DialogHeader>
            <DialogTitle>{selectedForDetails?.name}</DialogTitle>
          </DialogHeader>

          {selectedForDetails && (
            <div className="space-y-4">
              <div className="rounded-xl border p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Context</p>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {formatContextLength(selectedForDetails.context_length)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Pricing</p>

                    <p className="font-medium">
                      {isFreeModel(selectedForDetails) ? "Free" : "Paid"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedForDetails.description && (
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedForDetails.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModelSelector;
