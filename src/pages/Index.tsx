
import { ImageGenerator } from "@/components/ImageGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with just a few words
          </p>
        </div>
        <ImageGenerator />
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Powered by Replicate's API and your imagination</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
