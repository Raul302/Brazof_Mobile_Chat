// authConfig.js
export const authConfig = {

  // Autentificacion 

  // api.brazof.space/oauth

  // Api de negocio


  // api.brazof.space/api


  clientId: '2',
  clientSecret: 'f9r2NnZCcRdBkYnlWn4a2Xlq143RlQRKZJPnRCCn',
  business_api: 'https://api.brazof.space/api/',
  redirect_uri: 'brazof://callback', // Configúralo en tu Laravel también
  server_uri:'https://api.brazof.space/oauth/',
  scopes: ['read'], // Usa el mismo scope que usabas en web
  usePKCE: false, // Laravel no soporta PKCE, desactívalo
  serviceConfiguration: {
    authorizationEndpoint: 'https://api.brazof.space/oauth/authorize',
    tokenEndpoint: 'https://api.brazof.space/oauth/token',
  },
  dangerouslyAllowInsecureHttpRequests: true, // true solo si estás en HTTP loca
  state : generateState()
};


export function generateState() {
  return (  
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}


