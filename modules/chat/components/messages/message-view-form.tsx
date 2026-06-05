"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { useGetChatById } from '../../hooks/use-chats';
import { useAiModels } from '../../hooks/use-ai-models';

const MessageViewWithForm = (chatId:string) => {
    const router  = useRouter();
    const searchParams  = useSearchParams();
    const shouldAutoTrigger = searchParams.get("autoTrigger")=== "true";
    const hasAutoTrigger = useRef(false)


    const [selectedModel , setSelectedModel] = useState(null)
    const [input , setInput] = useState("")


    const {data:models , isPending:isModelLoading} = useAiModels();
    const {data , isPending} = useGetChatById(chatId)


  return (
    <div>

    </div>
  )
}

export default MessageViewWithForm