import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TopicInput } from '@/components/TopicInput';
import { ThreadOutput } from '@/components/ThreadOutput';
import { GeminiService, type ThreadResult } from '@/services/geminiService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Key, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ThreadResult | null>(null);
  const [geminiService] = useState(() => new GeminiService());

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      geminiService.setApiKey(apiKey.trim());
      setIsApiKeySet(true);
      toast.success('API Key সেট হয়েছে!');
    } else {
      toast.error('একটি বৈধ API Key প্রবেশ করান');
    }
  };

  const handleGenerateThread = async (topic: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const threadResult = await geminiService.generateThread(topic);
      setResult(threadResult);
      toast.success('থ্রেড তৈরি হয়েছে!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'কিছু সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-hind">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        {!isApiKeySet ? (
          <Card className="p-6 bg-gradient-card border-border shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Gemini API Key সেটআপ</h3>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">API Key প্রয়োজন</p>
                  <p className="text-muted-foreground">
                    Gemini API ব্যবহার করতে আপনার API Key প্রয়োজন। 
                    <a 
                      href="https://makersuite.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      এখানে ক্লিক করে
                    </a> API Key নিন।
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="আপনার Gemini API Key এখানে পেস্ট করুন..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-background border-border focus:ring-primary"
              />
              <Button 
                onClick={handleSetApiKey}
                disabled={!apiKey.trim()}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                সেট করুন
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <TopicInput onGenerate={handleGenerateThread} isLoading={isLoading} />
            
            {result && (
              <div className="mt-8">
                <ThreadOutput result={result} />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;