import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useApiKey } from '@/hooks/useApiKey';
import { generateImage, checkGenerationStatus, type GenerationResponse } from '@/lib/replicate';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { apiKey, updateApiKey } = useApiKey();

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
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="block text-sm font-medium">
            Replicate API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => updateApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Get your API key from{' '}
            <a
              href="https://replicate.com/account/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              Replicate API Tokens
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-medium">
            Prompt
          </label>
          <div className="flex gap-2">
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              className="flex-1"
              disabled={isGenerating}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt || !apiKey}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative min-h-[300px] w-full">
        {isGenerating ? (
          <Card className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-sm animate-pulse-slow">Generating your image...</p>
            </div>
          </Card>
        ) : generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated image"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        ) : (
          <Card className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <p className="text-muted-foreground">
              Your generated image will appear here
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};