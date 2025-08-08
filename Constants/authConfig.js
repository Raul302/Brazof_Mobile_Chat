// authConfig.js
export const baseUrl = 'https://api.brazof.space';
export const authConfig = {
  client_id: '2',
  client_secret: 'f9r2NnZCcRdBkYnlWn4a2Xlq143RlQRKZJPnRCCn',
  api_url: baseUrl,
  scope: 'read',
  response_type: 'code',
  usePKCE: false, // Laravel no soporta PKCE, desactívalo
  dangerouslyAllowInsecureHttpRequests: false, // true solo si estás en HTTP loca
  state : generateState()
};
  

export function generateState() {
  return (  
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}


