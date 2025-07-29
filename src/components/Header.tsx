import { Bot } from 'lucide-react';

export const Header = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
          <Bot className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            VPC এজেন্ট
          </h1>
          <p className="text-sm text-muted-foreground">Viral Post Creator Agent</p>
        </div>
      </div>
      <p className="text-muted-foreground max-w-md mx-auto">
        AI দিয়ে তৈরি করুন ভাইরাল টুইটার/X থ্রেড বাংলায়
      </p>
    </header>
  );
};