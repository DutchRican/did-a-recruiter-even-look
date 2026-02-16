export type LanguageModelType = {
    availability: string;
    create: Function;
    params: Function;
}

export type SettingsType = {
    ollamaUrl: string;
    llmType: 'chrome_ai' | 'ollama' | '';
    model?: string;
}


export const messageMap:{[key: string]: string} = {
    downloading: 'The model appears to be downloading, please wait',
    chrome_only: 'You can only use the built-in Chrome model when using Chrome',
    enable_flag: 'You will have to enable the "Prompt API for Gemini Nano" on chrome://flags/ to use the Chrome model'
}