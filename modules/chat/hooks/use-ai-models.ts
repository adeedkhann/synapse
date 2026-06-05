import { useQuery } from "@tanstack/react-query";
import { Festive } from "next/font/google";

export const useAiModels = ()=>{


    return useQuery({
        queryKey:["ai-models"],
        queryFn:()=> fetch("/api/ai/get-models").then(res=>res.json())
    })


}

