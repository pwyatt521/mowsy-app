export interface Config {
  apiUrl: string;
  stripeKey: string;
  mapApiKey?: string;
}

const configs: Record<string, Config> = {
  development: {
    apiUrl: 'https://p2mw409ce8.execute-api.us-east-2.amazonaws.com/dev',
    stripeKey: 'pk_test_dev_key_here',
    mapApiKey: 'your_google_maps_api_key_dev'
  },
  staging: {
    apiUrl: 'https://p2mw409ce8.execute-api.us-east-2.amazonaws.com/staging',
    stripeKey: 'pk_test_stage_key_here',
    mapApiKey: 'your_google_maps_api_key_stage'
  },
  production: {
    apiUrl: 'https://p2mw409ce8.execute-api.us-east-2.amazonaws.com/prod',
    stripeKey: 'pk_live_prod_key_here',
    mapApiKey: 'your_google_maps_api_key_prod'
  }
};

const getEnvironment = (): string => {
  if (__DEV__) {
    return 'development';
  }
  return process.env.NODE_ENV || 'development';
};

export const config: Config = configs[getEnvironment()];