import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface TopicInputProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

export const TopicInput = ({ onGenerate, isLoading }: TopicInputProps) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic.trim());
    }
  };

  const exampleTopics = [
    "Notion AI দিয়ে আয়",
    "CapCut Reels হ্যাক",
    "ফ্রিল্যান্সিং টিপস",
    "AI টুলস ২০২৪"
  ];

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-2">
            📝 একটি টপিক লিখুন:
          </label>
          <div className="flex gap-2">
            <Input
              id="topic"
              type="text"
              placeholder="যেমন: Notion AI দিয়ে আয়..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 bg-background border-border focus:ring-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2">তৈরি করুন</span>
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">👉 উদাহরণ টপিক:</p>
          <div className="flex flex-wrap gap-2">
            {exampleTopics.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setTopic(example)}
                className="px-3 py-1 text-xs bg-secondary hover:bg-accent rounded-md transition-colors"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Card>
  );
};