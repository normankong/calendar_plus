import * as response from '../lib/responses'
import * as credential from '../lib/credential'
import fetch from 'node-fetch'

export const route = '/oauth2callback?.*'

const handler = async request => {

  const myUrl = new URL(request.url);
  let params = new URLSearchParams(myUrl.search);
  let code = params.get('code')

  // Use the callback code to retrieve OAuth Token
  let token = await getOAuthToken(code)

  // Use Access Token to retrieve User Profile
  const userInfo = await getUserInfo(token.access_token)
  let email = userInfo["email"]

  // Save OAuth Token and Refresh Token
  await credential.updateToken(email, token)

  let jwt = await credential.signJWT(email);

  let json = {jwt, userInfo, token};

  return response.json(json)
}

async function getOAuthToken(code) {

  const CLIENT_ID = await credential.getClientId();
  const CLIENT_SECRET = await credential.getClientSecret();

  const response = await fetch(
    `https://www.googleapis.com/oauth2/v4/token`,
    {
      method: 'POST',
      body: JSON.stringify({
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: 'https://calendar.normankong.workers.dev/oauth2callback',
        grant_type: 'authorization_code'
      })
    }
  )
  return response.json()
}


async function getUserInfo(accessToken) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  return response.json()
}

export default handler