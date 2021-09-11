import * as credential from '../lib/credential'

export const refreshToken = async (time) => {
  
  console.log(`Refresh Token : ${time} started`);

  let emails = await credential.getEmails();
  let tokens = [];

  for (let email of emails){
      // Refresh the Access Token
      let token = await credential.refreshAccessToken(email);
      tokens.push(token);
  }

  console.log(`Refresh Token : ${time} completed`);

  return tokens;
}