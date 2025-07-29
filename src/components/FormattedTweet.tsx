
import React from 'react';

interface FormattedTweetProps {
  content: string;
  className?: string;
}

export const FormattedTweet = ({ content, className = '' }: FormattedTweetProps) => {
  const formatTweetContent = (text: string) => {
    // Split by line breaks and process each line
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return lines.map((line, index) => {
      // Add proper spacing around emojis
      const formattedLine = line.replace(/([^\s])([🔥💡📌✅🎯🚀💰📈🔴⭐️📱💪🌟🎉🏆🔥🎊✨💥🔥🚀💯⚡️🌈🎨🎭🎪🎯🎲🎪🎯🔥🎊💰🎨🏆🎯🔥💡📌✅🎯🚀💰📈🔴⭐️📱💪🌟🎉🏆🔥🎊✨💥🔥🚀💯⚡️🌈🎨🎭🎪🎯🎲🎪🎯])/g, '$1 $2');
      
      // Check if line starts with bullet point or emoji
      const isBulletPoint = /^[•✅🔥💡📌🎯🚀💰📈🔴⭐️📱💪🌟🎉🏆🎊✨💥💯⚡️🌈🎨🎭🎪🎲-]/.test(formattedLine);
      
      return (
        <div key={index} className={`${isBulletPoint ? 'ml-2' : ''} ${index > 0 ? 'mt-2' : ''}`}>
          {formattedLine}
        </div>
      );
    });
  };

  return (
    <div className={`leading-relaxed ${className}`}>
      {formatTweetContent(content)}
    </div>
  );
};
