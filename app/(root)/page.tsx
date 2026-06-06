import { currentUser } from "@/modules/authentication/actions";
import ChatMessageView from "@/modules/chat/components/chat-view/chat-message-view";

export default async function Home() {
  const user = await currentUser();

  return (
    <div>
      <ChatMessageView user={user} />
    </div>
  );
}
