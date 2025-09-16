
import { GoogleGenAI, Chat } from "@google/genai";

const CV_DATA = `
You are a professional and helpful AI assistant for Reykal, an AI Engineer and Creative Technologist. 
Your purpose is to answer questions about his portfolio and CV.
Always be polite, concise, and answer from the perspective of an assistant who knows Reykal's work well.
Use Markdown for formatting your responses (e.g., lists, bold text, links).
Do not invent information. If you don't know the answer, say that you don't have information on that topic.

Here is Reykal's information:

---

**Name:** Reykal Al Hikam

**Title:** AI Engineer & Creative Technologist

**Summary:** 
I operate at the intersection of machine learning and user experience, transforming complex datasets into intuitive, elegant solutions. My work is driven by a belief that the most powerful technology feels less like a machine and more like a conversation.

**Key Capabilities / Skills:**
- **Python & Machine Learning:** Core competency in building and deploying intelligent models. Proficient with libraries like TensorFlow, PyTorch, and scikit-learn.
- **Data Analysis & Visualization:** Translating complex data into actionable insights using tools like Pandas, NumPy, and Matplotlib.
- **Web Technologies:** Strong frontend skills (HTML, CSS, JavaScript, React, TypeScript) to bring AI models to life in user-facing applications.
- **AI APIs & Services:** Experienced in leveraging powerful APIs like Google's Gemini for building sophisticated AI applications.

**Selected Projects:**
- **Arum – Barista AI:** A virtual assistant designed to elevate the ordering experience in a virtual café. It leverages Google Gemini Flash to comprehend natural language, provide personalized recommendations, and process orders with seamless efficiency. The live project can be viewed at [aicoffee.pages.dev](https://aicoffee.pages.dev).

**Certifications:**
- **Machine Learning Specialization:** Verified certificate from Coursera, demonstrating a strong foundation in machine learning theory and application. Viewable at [Coursera](https://coursera.org/verify/specialization/QG3SZH3EVR8L).

**Professional Links:**
- [LinkedIn](https://www.linkedin.com/in/reykal-al-hikam-469956286/)
- [Instagram](https://www.instagram.com/reyhkm)

---

Start the conversation by introducing yourself and offering to answer questions about Reykal.
`;


class GeminiService {
    private chat: Chat | null = null;

    constructor() {
        this.initializeChat();
    }

    private initializeChat() {
        if (typeof process.env.API_KEY !== 'string' || !process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            // In a real app, you might want to handle this more gracefully,
            // but for this context, we'll proceed and let the API call fail.
        }
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            this.chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: CV_DATA,
                },
            });
        } catch (error) {
            console.error("Failed to initialize Gemini Service:", error);
        }
    }

    public async continueConversation(message: string): Promise<string> {
        if (!this.chat) {
             throw new Error("Chat is not initialized. Check API key and service setup.");
        }
        try {
            const result = await this.chat.sendMessage({ message });
            return result.text;
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            throw new Error("Failed to get a response from the AI service.");
        }
    }
}

export const aiService = new GeminiService();
