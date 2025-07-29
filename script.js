// Global state
let apiKey = '';
let isApiKeySet = false;
let isLoading = false;
let geminiService = null;
let threadResult = null;

// DOM elements
const apiKeySetup = document.getElementById('api-key-setup');
const topicInputSection = document.getElementById('topic-input-section');
const threadOutput = document.getElementById('thread-output');
const apiKeyInput = document.getElementById('api-key-input');
const setApiKeyBtn = document.getElementById('set-api-key-btn');
const topicForm = document.getElementById('topic-form');
const topicTextarea = document.getElementById('topic-textarea');
const generateBtn = document.getElementById('generate-btn');
const generateText = document.getElementById('generate-text');
const loadingText = document.getElementById('loading-text');

// Gemini Service Class
class GeminiService {
    constructor() {
        this.apiKey = '';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async generateThread(topic) {
        if (!this.apiKey) {
            throw new Error('API Key সেট করা হয়নি');
        }

        const prompt = `আপনি একজন এক্সপার্ট কন্টেন্ট ক্রিয়েটর এবং সোশ্যাল মিডিয়া মার্কেটার। আপনার কাজ হল বাংলায় ভাইরাল টুইটার/X থ্রেড তৈরি করা।

বিষয়: ${topic}

নিম্নলিখিত ফর্ম্যাটে একটি সম্পূর্ণ থ্রেড তৈরি করুন:

MAIN_TWEET:
[একটি আকর্ষণীয় মূল টুইট যা মানুষের মনোযোগ আকর্ষণ করবে এবং থ্রেডের প্রিভিউ দেবে। ইমোজি ব্যবহার করুন।]

THREAD_BODY:
[৫-৮টি টুইটের একটি ধারাবাহিক থ্রেড। প্রতিটি টুইট আলাদা লাইনে থাকবে এবং নম্বর দিয়ে শুরু হবে (১/, ২/, ৩/ ইত্যাদি)। প্রতিটি টুইটে মূল্যবান তথ্য, টিপস বা অন্তর্দৃষ্টি থাকবে। ইমোজি এবং হ্যাশট্যাগ ব্যবহার করুন।]

IMAGE_IDEAS:
[থ্রেডের সাথে ব্যবহারের জন্য ৩-৫টি ইমেজ আইডিয়া। প্রতিটি আইডিয়া আলাদা লাইনে বুলেট পয়েন্ট হিসেবে দিন।]

গুরুত্বপূর্ণ নির্দেশনা:
- বাংলায় লিখুন
- আকর্ষণীয় এবং শেয়ারযোগ্য কন্টেন্ট তৈরি করুন
- প্রাসঙ্গিক ইমোজি ব্যবহার করুন
- টুইটার/X এর ক্যারেক্টার লিমিটের কথা মাথায় রাখুন
- হ্যাশট্যাগ ব্যবহার করুন যেখানে প্রয়োজন`;

        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                throw new Error('API অনুরোধে সমস্যা হয়েছে');
            }

            const data = await response.json();
            const content = data.candidates[0].content.parts[0].text;

            return this.parseThreadContent(content);
        } catch (error) {
            throw new Error(error.message || 'থ্রেড তৈরি করতে সমস্যা হয়েছে');
        }
    }

    parseThreadContent(content) {
        const mainTweetMatch = content.match(/MAIN_TWEET:\s*([\s\S]*?)(?=THREAD_BODY:|$)/);
        const threadBodyMatch = content.match(/THREAD_BODY:\s*([\s\S]*?)(?=IMAGE_IDEAS:|$)/);
        const imageIdeasMatch = content.match(/IMAGE_IDEAS:\s*([\s\S]*?)$/);

        return {
            mainTweet: mainTweetMatch ? mainTweetMatch[1].trim() : 'মূল টুইট তৈরি করতে সমস্যা হয়েছে',
            threadBody: threadBodyMatch ? threadBodyMatch[1].trim() : 'থ্রেড বডি তৈরি করতে সমস্যা হয়েছে',
            imageIdeas: imageIdeasMatch ? imageIdeasMatch[1].trim() : 'ইমেজ আইডিয়া তৈরি করতে সমস্যা হয়েছে'
        };
    }
}

// Toast functionality
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

// Format tweet content
function formatTweetContent(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return lines.map(line => {
        // Add proper spacing around emojis
        const formattedLine = line.replace(/([^\s])([🔥💡📌✅🎯🚀💰📈🔴⭐️📱💪🌟🎉🏆🎊✨💥💯⚡️🌈🎨🎭🎪🎲-])/g, '$1 $2');
        
        // Check if line starts with bullet point or emoji
        const isBulletPoint = /^[•✅🔥💡📌🎯🚀💰📈🔴⭐️📱💪🌟🎉🏆🎊✨💥💯⚡️🌈🎨🎭🎪🎲-]/.test(formattedLine);
        
        return `<div class="tweet-line ${isBulletPoint ? 'bullet' : ''}">${formattedLine}</div>`;
    }).join('');
}

// Copy to clipboard functionality
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    }
}

// Initialize the application
function init() {
    geminiService = new GeminiService();
    
    // Set API Key functionality
    setApiKeyBtn.addEventListener('click', handleSetApiKey);
    apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSetApiKey();
        }
    });
    
    // Topic form functionality
    topicForm.addEventListener('submit', handleGenerateThread);
    
    // Example topic buttons
    document.querySelectorAll('.example-topic').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const topic = e.target.getAttribute('data-topic');
            topicTextarea.value = topic;
            topicTextarea.focus();
        });
    });
    
    // Copy button functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
            const btn = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
            const copyType = btn.getAttribute('data-copy');
            handleCopy(copyType, btn);
        }
    });
}

// Handle API Key setup
function handleSetApiKey() {
    const key = apiKeyInput.value.trim();
    if (key) {
        geminiService.setApiKey(key);
        isApiKeySet = true;
        apiKeySetup.classList.add('hidden');
        topicInputSection.classList.remove('hidden');
        showToast('API Key সেট হয়েছে!');
    } else {
        showToast('একটি বৈধ API Key প্রবেশ করান', 'error');
    }
}

// Handle thread generation
async function handleGenerateThread(e) {
    e.preventDefault();
    
    const topic = topicTextarea.value.trim();
    if (!topic) {
        showToast('একটি টপিক লিখুন', 'error');
        return;
    }
    
    setLoading(true);
    threadOutput.classList.add('hidden');
    
    try {
        threadResult = await geminiService.generateThread(topic);
        displayThreadResult(threadResult);
        threadOutput.classList.remove('hidden');
        showToast('থ্রেড তৈরি হয়েছে!');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        setLoading(false);
    }
}

// Set loading state
function setLoading(loading) {
    isLoading = loading;
    generateBtn.disabled = loading;
    topicTextarea.disabled = loading;
    
    if (loading) {
        generateText.classList.add('hidden');
        loadingText.classList.remove('hidden');
    } else {
        generateText.classList.remove('hidden');
        loadingText.classList.add('hidden');
    }
}

// Display thread result
function displayThreadResult(result) {
    // Main tweet
    document.getElementById('main-tweet-content').innerHTML = formatTweetContent(result.mainTweet);
    
    // Thread body
    const threadBodyContent = document.getElementById('thread-body-content');
    const threadTweets = result.threadBody.split('\n').filter(line => line.trim().length > 0);
    
    threadBodyContent.innerHTML = threadTweets.map((tweet, index) => `
        <div class="card p-4 bg-muted/30">
            <div class="flex justify-between items-start mb-2">
                <span class="text-sm text-muted-foreground">টুইট ${index + 1}</span>
                <button class="copy-btn btn-outline" data-copy="thread-tweet-${index}">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    কপি
                </button>
            </div>
            <div class="formatted-content" data-tweet="${tweet}">${formatTweetContent(tweet)}</div>
        </div>
    `).join('');
    
    // Image ideas
    document.getElementById('image-ideas-content').innerHTML = formatTweetContent(result.imageIdeas);
}

// Handle copy functionality
async function handleCopy(copyType, button) {
    let textToCopy = '';
    
    switch (copyType) {
        case 'main-tweet':
            textToCopy = threadResult.mainTweet;
            break;
        case 'thread-body':
            textToCopy = threadResult.threadBody;
            break;
        case 'image-ideas':
            textToCopy = threadResult.imageIdeas;
            break;
        default:
            if (copyType.startsWith('thread-tweet-')) {
                const index = parseInt(copyType.split('-')[2]);
                const threadTweets = threadResult.threadBody.split('\n').filter(line => line.trim().length > 0);
                textToCopy = threadTweets[index] || '';
            }
    }
    
    if (textToCopy) {
        try {
            await copyToClipboard(textToCopy);
            
            // Update button temporarily
            const originalHTML = button.innerHTML;
            button.innerHTML = `
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                কপি হয়েছে
            `;
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 2000);
            
            showToast('কপি হয়েছে!');
        } catch (error) {
            showToast('কপি করতে সমস্যা হয়েছে', 'error');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);