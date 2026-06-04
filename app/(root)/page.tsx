import { Button } from "@/components/ui/button";
import Image from "next/image";
import {UserButton} from "@/modules/authentication/components/userButton"
import { authClient } from "@/lib/auth-client";
import { currentUser } from "@/modules/authentication/actions";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import ChatMessageView from "@/modules/chat/components/chat-view/chat-message-view";



export const user = await currentUser()
export default async function Home() {

  return (
    <div>
      <ChatMessageView user={user}/>
    </div>
  );
}
