import type { SettingsType } from "@/types";
import { getLocalStorageSettings, isThisChrome } from "./utils";

const prompt = (body: string) => 
    ({
    role: 'user', content: `You are an email classifier. Analyze the email body and determine if it's a template, personal message, or AI-generated response.

ANALYSIS CRITERIA:
- Template: Generic structure, placeholder-like language, formal boilerplate
- Personal Message: Specific details, conversational tone, unique phrasing
- AI Generated: Overly polished, verbose pleasantries, generic enthusiasm

IMPORTANT CONSIDERATIONS:
- Using the recipient's name does NOT make it personal (name is on resume)
- Check the signature for authenticity signals
- Watch for impersonal, placating language
- References to previous conversations suggest personal communication
- Don't overthink it - no trick questions

RESPONSE FORMAT:
You must respond with ONLY valid JSON. No markdown, no explanation outside the JSON, no code blocks, no reasoning, no explanation.

{
    "analysis": "Template" | "Personal Message" | "AI Generated",
    "confidence_score": "XX%",
    "reasoning": "Brief explanation in 1-2 sentences max"
}

Example valid response:
{"analysis":"Template","confidence_score":"85%","reasoning":"Generic structure with boilerplate language. Standard corporate sign-off with no personal details."}

Any other form or response will be considered bad and unacceptable.
This is the email body to analyse: ${body}
`
} as LanguageModelMessage);


export const llmCheck = async (body: string) => {
    const maxTries = 3;
    let tries = 0;
    const settings = getLocalStorageSettings();
    let error;
    if (settings.llmType === 'ollama' && !settings.model) return Promise.reject('Select a model for Ollama first!');
    // just presetting this to allow multiple llm at some point. useless for now
    if (true) {
        while (tries < maxTries) {
            try {
                return await generateResponse(body, settings);
            } catch (e: any) {
                tries++;
                error =e;
            }
        }
        return Promise.reject(error.message ?? error);
    }
}

const generateResponse = async (body: string, settings: SettingsType) => {
    const history = [prompt(body)];
    try {
        switch (settings.llmType) {
            case 'chrome_ai':
                const model = await LanguageModel.create({});
                let response = await model.prompt(history);
                response = response.replace('```json', '').replace('```', '').trim();
                return JSON.parse(response);
            case 'ollama':
                const resp = await fetch('api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'target': `${settings.ollamaUrl}/api/chat`
                    },
                    body: JSON.stringify({
                        model: settings.model,
                        format: 'json',
                        stream: false,
                        messages: history,
                        prompt: `Please parse the following email body for me: ${body}`
                    })
                });
                if (!resp.ok) {
                    throw new Error(`Is Ollama running? err: ${resp.status}`)
                }
                const { message } = await resp.json();
                return JSON.parse(message.content);
        }

    } catch (e) {
        return Promise.reject(e);
    }
}
