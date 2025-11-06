import ToolTemplate from "@/components/ToolTemplate";

const ChatAI = () => {
  return (
    <ToolTemplate
      title="AI Chat Assistant"
      description="Chat with AI to get answers, ideas, and assistance on any topic"
      placeholder="Ask me anything... (e.g., 'Explain quantum computing in simple terms')"
      toolType="chat"
    />
  );
};

export default ChatAI;
