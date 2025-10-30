import ToolTemplate from "@/components/ToolTemplate";

const TextSummarizer = () => {
  return (
    <ToolTemplate
      title="Text Summarizer"
      description="Summarize long documents into concise key points"
      placeholder="Paste your long text or document here to get a summary..."
      toolType="summarize"
    />
  );
};

export default TextSummarizer;
