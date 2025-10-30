import ToolTemplate from "@/components/ToolTemplate";

const CodeGenerator = () => {
  return (
    <ToolTemplate
      title="Code Generator"
      description="Generate clean, functional code in multiple programming languages"
      placeholder="Describe what code you need (e.g., 'Create a React component for a login form')"
      toolType="code"
    />
  );
};

export default CodeGenerator;
