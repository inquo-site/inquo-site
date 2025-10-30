import ToolTemplate from "@/components/ToolTemplate";

const BlogGenerator = () => {
  return (
    <ToolTemplate
      title="Blog Generator"
      description="Generate engaging blog posts on any topic in seconds"
      placeholder="Enter your blog topic or outline (e.g., '5 Tips for Remote Work Productivity')"
      toolType="blog"
    />
  );
};

export default BlogGenerator;
