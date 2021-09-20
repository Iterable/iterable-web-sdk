interface Options {
  logLevel: 'none' | 'verbose';
}

const _config = () => {
  let options: Options = {
    logLevel: 'none'
  };

  return {
    getConfig: (option: keyof Options) => options[option],
    setConfig: (newOptions: Partial<Options>) => {
      options = {
        ...options,
        ...newOptions
      };
    }
  };
};

export const config = _config();

export default config;
