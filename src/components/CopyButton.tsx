import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export const CopyButton = ({ text, label = "কপি" }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('কপি হয়েছে!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('কপি করতে সমস্যা হয়েছে');
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="gap-2 bg-gradient-card border-border hover:bg-gradient-primary hover:text-primary-foreground transition-all duration-300"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {label}
    </Button>
  );
};