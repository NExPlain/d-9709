
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useApiKey } from '@/hooks/useApiKey';
import { generateImage, checkGenerationStatus } from '@/lib/replicate';
import { Loader2, Wand2, Key, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { debounce } from '@/lib/lodashUtils';

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const {
    apiKey,
    updateApiKey
  } = useApiKey();

  // Use debounced function for API key updates to avoid unnecessary localStorage writes
  const debouncedUpdateApiKey = debounce((value: string) => {
    updateApiKey(value);
  }, 300);

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error('Please enter your Replicate API key');
      return;
    }
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const response = await generateImage(prompt, apiKey);

      // Poll for results
      const pollInterval = setInterval(async () => {
        const result = await checkGenerationStatus(response.urls.get, apiKey);
        if (result.status === 'succeeded' && result.output) {
          clearInterval(pollInterval);
          setGeneratedImage(result.output[0]);
          setIsGenerating(false);
          toast.success('Image generated successfully!');
        } else if (result.status === 'failed') {
          clearInterval(pollInterval);
          setIsGenerating(false);
          toast.error('Failed to generate image');
        }
      }, 1000);
    } catch (error) {
      setIsGenerating(false);
      toast.error('An error occurred while generating the image');
    }
  };

  return <div className="w-full max-w-3xl mx-auto space-y-8">
      <Card className="overflow-hidden border-2 bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6 my-[5px]">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary/80" />
                <Label htmlFor="apiKey" className="text-sm font-medium mx-[5px]">
                  Replicate API Key
                </Label>
              </div>
              <Input 
                id="apiKey" 
                type="password" 
                value={apiKey} 
                onChange={e => debouncedUpdateApiKey(e.target.value)} 
                placeholder="Enter your API key" 
                className="w-full transition-all focus:ring-2 focus:ring-primary/30" 
              />
              <p className="text-sm text-muted-foreground mt-1 mx-0 text-zinc-100">
                Get your API key from{' '}
                <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline font-medium transition-all">
                  Replicate API Tokens
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary/80" />
                <Label htmlFor="prompt" className="text-sm font-medium bg-zinc-950">
                  What would you like to create?
                </Label>
              </div>
              <div className="flex gap-3">
                <Input id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter your prompt here (e.g., 'A serene lake with mountains in the background')" className="flex-1 transition-all focus:ring-2 focus:ring-primary/30" disabled={isGenerating} />
                <Button onClick={handleGenerate} disabled={isGenerating || !prompt || !apiKey} className="transition-all">
                  {isGenerating ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </> : <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate
                    </>}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative min-h-[400px] w-full rounded-lg overflow-hidden">
        {isGenerating ? <Card className="absolute inset-0 flex items-center justify-center bg-muted/50 border-0 animate-pulse">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-lg font-medium animate-pulse-slow">Creating your masterpiece...</p>
              <p className="text-sm text-muted-foreground max-w-md">
                This usually takes 10-20 seconds depending on complexity
              </p>
            </div>
          </Card> : generatedImage ? <div className="overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl border-2 border-card">
            <img src={generatedImage} alt="Generated image" className="w-full h-auto object-cover transition-all hover:scale-[1.02] duration-500" loading="lazy" />
          </div> : <Card className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              Your created image will appear here
            </p>
            <p className="text-muted-foreground/70 text-sm max-w-md text-center mt-2">
              Create something amazing with the power of AI
            </p>
          </Card>}
      </div>
    </div>;
};
