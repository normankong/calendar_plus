import * as response from '../lib/responses'
import {refreshToken} from '../lib/refreshToken'
import * as credential from '../lib/credential'
import fetch from 'node-fetch'

export const route = '/token/refresh/(?<email>.+)'
export const method = 'get'

// Manual Endpoint to trigger Refresh Token
// Suppose the token will be automatically triggered by Scheduler
const handler = async (request) => {

	let isAdmin = await credential.isAdmin(request.headers);
    if (!isAdmin) {
        return response.json({error: "Access Denied"})
    }

	let email = request.params.email;

    // Refresh All Token
    let tokens = await refreshToken(email);

    let result = [];
    for (let token of tokens){

        // Test Access Right
        const userInfo = await getUserInfo(token.access_token)
        userInfo.token = token;
        result.push(userInfo);
    }

  return response.json(result)
}

async function getUserInfo(accessToken) {
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )
    return response.json()
}

export default handler