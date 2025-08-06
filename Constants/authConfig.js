// authConfig.js
export const authConfig = {
  client_id: '2',
  client_secret: '4TmBquXDjNlGXzykUjEOfK2MtwRyE5zpl89YPvkH',
  redirect_uri: 'https://lrpm.space/oauth/callback', // Configúralo en tu Laravel también
  oauth_server:'https://lrpm.space/oauth',
  api_server: 'https://lrpm.space/api',
  api_negocio_server: 'https://lrpm.space/negocio/api',
  scopes: ['read'], // Usa el mismo scope que usabas en web
  response_type: 'code',
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


