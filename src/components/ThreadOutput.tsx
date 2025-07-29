
import { Card } from '@/components/ui/card';
import { CopyButton } from './CopyButton';
import { FormattedTweet } from './FormattedTweet';
import { Twitter, MessageSquare, Image } from 'lucide-react';

interface ThreadResult {
  mainTweet: string;
  threadBody: string[];
  imageIdeas: string[];
}

interface ThreadOutputProps {
  result: ThreadResult;
}

export const ThreadOutput = ({ result }: ThreadOutputProps) => {
  const { mainTweet, threadBody, imageIdeas } = result;

  return (
    <div className="space-y-6">
      {/* Main Tweet */}
      <Card className="p-6 bg-gradient-card border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Twitter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">📌 মূল টুইট</h3>
        </div>
        <div className="bg-background/50 p-4 rounded-lg mb-4 border border-border">
          <FormattedTweet content={mainTweet} />
        </div>
        <CopyButton text={mainTweet} />
      </Card>

      {/* Thread Body */}
      <Card className="p-6 bg-gradient-card border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">📚 থ্রেড টুইটস</h3>
        </div>
        <div className="space-y-4">
          {threadBody.map((tweet, index) => (
            <div key={index} className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-muted-foreground font-medium bg-primary/10 px-2 py-1 rounded">
                  টুইট {index + 2}
                </span>
                <CopyButton text={tweet} />
              </div>
              <FormattedTweet content={tweet} />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <CopyButton 
            text={threadBody.join('\n\n')} 
            label="সব টুইট কপি করুন"
          />
        </div>
      </Card>

      {/* Image Ideas */}
      <Card className="p-6 bg-gradient-card border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Image className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">🖼️ ইমেজ আইডিয়া</h3>
        </div>
        <div className="bg-background/50 p-4 rounded-lg mb-4 border border-border">
          <div className="space-y-3">
            {imageIdeas.map((idea, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-primary mt-1 font-bold">•</span>
                <span className="leading-relaxed">{idea}</span>
              </div>
            ))}
          </div>
        </div>
        <CopyButton text={imageIdeas.join('\n')} label="সব আইডিয়া কপি করুন" />
      </Card>
    </div>
  );
};
