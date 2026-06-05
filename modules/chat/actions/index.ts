"use server"

import {prisma} from "@/lib/db"
import { currentUser } from "@/modules/authentication/actions"
import { revalidatePath } from "next/cache"
import { MessageRole , MessageType } from "@/prisma/generated/prisma/client"
interface IcreateChatWithMessage{
    content :string
    model : string
}


export async function createChatWithMessage({content , model}:IcreateChatWithMessage) {


    try {
        
        const user = await currentUser();
        if(!user){
            return {success:false , message:"Unauthorized"}
        }


        const title = content.slice(0,50) + (content.length > 50? "..." :"")

        const chat = await prisma.chat.create({
            data:{
                title,
                model,
                userId:user?.id,
                messages:{
                    create:{
                        content,
                        model,
                        messageRole:MessageRole.USER,
                        messageType:MessageType.NORMAL 
                    }
                }
            },
            include:{
                messages:true
            }
        })
        


        revalidatePath("/" , "page")

        return {success:true , data:chat}

    } catch (error) {
        console.error("Error creating chat:",error)
        return {success:false,message:"Failed to create chat"}
        
    }


}

export async function getAllChats() {
    const user = await currentUser();
    
        if(!user){
            return {success:false , message:"Unauthorized"}
        }
    
    try {
        const user = await currentUser()
        if(!user){
            return {success:false , message:"Unauthorized"}
        }
        
        const chats = await prisma.chat.findMany({
            where:{userId:user?.id},
            include:{messages:true},
            orderBy:{createdAt:"desc"}
        })
        return {success:true , data:chats}


    } catch (error) {
         console.error("Error getting chat:",error)
        return {success:false,message:"Failed to fetch chat"}
    }
}

export async function getChatById(chatId:string) {
    
    try {
        
        const user = await currentUser();
        if(!user){
            return {success:false , message:"Unauthorized"}
        }


       const chat = await prisma.chat.findFirst({
        where:{id:chatId,userId:user?.id},
        include:{messages:true}
       })

       if(!chat){
        return {success:false,message:"chat does not exist"}
       }

       return {success:true , data:chat}

    } catch (error) {
        console.error("Error getting chat:",error)
        return {success:false,message:"Failed to fetch chat"}
        
    }
}


export async function deleteChat(chatId:string) {
     try {
        
        const user = await currentUser();
        if(!user){
            return {success:false , message:"Unauthorized"}
        }


       const chat = await prisma.chat.delete({
        where:{id:chatId,userId:user?.id},
        include:{message:true}
       })

       if(!chat){
        return {success:false,message:"chat not found"}
       }

       return {success:true }

    } catch (error) {
        console.error("Error deleting chat:",error)
        return {success:false,message:"Failed to delete chat"}
        
    }
}

