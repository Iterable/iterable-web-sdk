interface Options {
    logLevel: 'none' | 'verbose';
    baseURL: string;
}
export declare const config: {
    getConfig: (option: keyof Options) => string;
    setConfig: (newOptions: Partial<Options>) => void;
};
export default config;
