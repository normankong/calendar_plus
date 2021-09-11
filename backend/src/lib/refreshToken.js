import * as credential from '../lib/credential'

export const refreshToken = async (refreshEmail) => {
  
  console.log(`Refresh Token started`);

  let emails = (refreshEmail != "ALL") ? [refreshEmail] : await credential.getEmails();
  let tokens = [];

  for (let email of emails){
      // Refresh the Access Token
      let token = await credential.refreshAccessToken(email);
      tokens.push(token);
  }

  console.log(`Refresh Token completed`);

  return tokens;
}