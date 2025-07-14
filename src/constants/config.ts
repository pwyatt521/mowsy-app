export interface Config {
  apiUrl: string;
  stripeKey: string;
  mapApiKey?: string;
}

const configs: Record<string, Config> = {
  development: {
    apiUrl: 'https://api-dev-your-aws-gateway-url.com',
    stripeKey: 'pk_test_dev_key_here',
    mapApiKey: 'your_google_maps_api_key_dev'
  },
  staging: {
    apiUrl: 'https://api-stage-your-aws-gateway-url.com',
    stripeKey: 'pk_test_stage_key_here',
    mapApiKey: 'your_google_maps_api_key_stage'
  },
  production: {
    apiUrl: 'https://api-prod-your-aws-gateway-url.com',
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