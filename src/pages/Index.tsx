import { ImageGenerator } from "@/components/ImageGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">AI Image Generator</h1>
        <p className="text-muted-foreground text-center mb-8">
          Create amazing images with the power of AI
        </p>
        <ImageGenerator />
      </div>
    </div>
  );
};

export default Index;