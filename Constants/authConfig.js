// authConfig.js
export const authConfig = {
  clientId: '2',
  clientSecret: '4TmBquXDjNlGXzykUjEOfK2MtwRyE5zpl89YPvkH',
  redirectUrl: 'brazof://callback', // Configúralo en tu Laravel también
  server_uri:'https://lrpm.space/oauth/',
  scopes: ['read'], // Usa el mismo scope que usabas en web
  usePKCE: false, // Laravel no soporta PKCE, desactívalo
  serviceConfiguration: {
    authorizationEndpoint: 'https://lrpm.space/oauth/authorize',
    tokenEndpoint: 'https://lrpm.space/oauth/token',
  },
  dangerouslyAllowInsecureHttpRequests: false, // true solo si estás en HTTP loca
  state : generateState()
};


export function generateState() {
  return (  
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}


