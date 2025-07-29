
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ThreadResult {
  mainTweet: string;
  threadBody: string[];
  imageIdeas: string[];
}

const PROMPT_TEMPLATE = `
আপনি একজন ভাইরাল কন্টেন্ট ক্রিয়েটর এবং সোশ্যাল মিডিয়া এক্সপার্ট। আপনার কাজ হলো "{{topic}}" টপিকের উপর একটি বিস্তারিত ভাইরাল টুইটার/X থ্রেড তৈরি করা।

নিম্নোক্ত ফরম্যাটে আউটপুট দিন:

MAIN_TWEET_START
[এখানে একটি শক্তিশালী হুক সহ বিস্তারিত মূল টুইট লিখুন (২৫০-২৮০ অক্ষর) যা মানুষকে থ্রেডটি পড়তে আগ্রহী করবে এবং একটি প্রতিশ্রুতি দেবে]
MAIN_TWEET_END

THREAD_BODY_START
[এখানে ৮-১২টি বিস্তারিত পৃথক টুইট লিখুন। প্রতিটি টুইট ২৫০-২৮০ অক্ষরের হতে হবে। প্রতিটি টুইট /// দিয়ে আলাদা করুন। প্রতিটি টুইটে গভীর তথ্য, উদাহরণ, পরিসংখ্যান বা ব্যবহারিক টিপস থাকতে হবে]
THREAD_BODY_END

IMAGE_IDEAS_START
[এখানে ৪-৬টি বিস্তারিত ইমেজ আইডিয়া দিন যা এই থ্রেডের সাথে ব্যবহার করা যাবে]
IMAGE_IDEAS_END

গুরুত্বপূর্ণ নির্দেশনা:
- সব কন্টেন্ট বাংলায় লিখুন
- প্রতিটি টুইট ২৫০-২৮০ অক্ষরের মধ্যে রাখুন (বেশি বিস্তারিত করুন)
- প্রচুর ইমোজি ব্যবহার করুন আকর্ষণীয় করতে
- প্রতিটি টুইটে পয়েন্ট আলাদা করতে নতুন লাইন ব্যবহার করুন
- বুলেট পয়েন্ট (• বা ✅) ব্যবহার করুন
- গুরুত্বপূর্ণ বিষয় হাইলাইট করতে ইমোজি ব্যবহার করুন
- ভাইরাল হওয়ার জন্য হুক, কৌতূহল এবং ভ্যালু যোগ করুন
- প্রতিটি টুইট স্বতন্ত্র অর্থপূর্ণ হতে হবে
- বিস্তারিত তথ্য, উদাহরণ, পরিসংখ্যান এবং ব্যবহারিক টিপস দিন
- প্রতিটি টুইটে কমপক্ষে ৩-৪টি বাক্য থাকতে হবে
- টেক্সট পড়তে সহজ করতে যথাযথ বিরতি দিন
- ব্যবহারিক পদক্ষেপ এবং বাস্তব উদাহরণ দিন
`;

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string = '';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateThread(topic: string): Promise<ThreadResult> {
    if (!this.genAI) {
      throw new Error('Gemini API key not set. Please provide your API key.');
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = PROMPT_TEMPLATE.replace('{{topic}}', topic);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error('Error generating thread:', error);
      throw new Error('থ্রেড তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  }

  private parseResponse(text: string): ThreadResult {
    try {
      // Extract main tweet
      const mainTweetMatch = text.match(/MAIN_TWEET_START\s*([\s\S]*?)\s*MAIN_TWEET_END/);
      const mainTweet = mainTweetMatch ? mainTweetMatch[1].trim() : 'মূল টুইট তৈরি করতে সমস্যা হয়েছে';

      // Extract thread body
      const threadBodyMatch = text.match(/THREAD_BODY_START\s*([\s\S]*?)\s*THREAD_BODY_END/);
      const threadBodyText = threadBodyMatch ? threadBodyMatch[1].trim() : '';
      const threadBody = threadBodyText.split('///').map(tweet => tweet.trim()).filter(tweet => tweet.length > 0);

      // Extract image ideas
      const imageIdeasMatch = text.match(/IMAGE_IDEAS_START\s*([\s\S]*?)\s*IMAGE_IDEAS_END/);
      const imageIdeasText = imageIdeasMatch ? imageIdeasMatch[1].trim() : '';
      const imageIdeas = imageIdeasText.split('\n').map(idea => idea.trim().replace(/^[-•]\s*/, '')).filter(idea => idea.length > 0);

      return {
        mainTweet,
        threadBody: threadBody.length > 0 ? threadBody : ['থ্রেড কন্টেন্ট তৈরি করতে সমস্যা হয়েছে'],
        imageIdeas: imageIdeas.length > 0 ? imageIdeas : ['ইমেজ আইডিয়া তৈরি করতে সমস্যা হয়েছে']
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('রেসপন্স পার্স করতে সমস্যা হয়েছে');
    }
  }
}
