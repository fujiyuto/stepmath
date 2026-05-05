type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { conversationId } = await params;
  return <div>会話画面 - {conversationId}</div>;
}
