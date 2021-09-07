import * as credential from '../lib/credential'

export const refreshToken = async (obj) => {
  
  let emails = await getEmails();
  let tokens = [];

  for (let email of emails){
      // Refresh the Access Token
      let token = await credential.refreshAccessToken(email);
      tokens.push(token);
  }

  return tokens;
}

async function getEmails(){
  
  // The default pagination is 1000
  let entries = await FILES.list();

  let emails = entries.keys.filter(x=>x.name.includes("-refresh")).map(x => x.name.replace("-refresh", ""));

  return emails;
}