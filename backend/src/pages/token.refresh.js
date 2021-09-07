import * as response from '../lib/responses'
import {refreshToken} from '../lib/refreshToken'
import * as credential from '../lib/credential'
import fetch from 'node-fetch'

export const route = '/token/refresh/?'
export const method = 'post'

// Manual Endpoint to trigger Refresh Token
// Suppose the token will be automatically triggered by Scheduler
const handler = async (request) => {

	let isAdmin = await credential.isAdmin(request.headers);
    if (!isAdmin) {
        return response.json({error: "Access Denied"})
    }

    // Refresh All Token
    let tokens = await refreshToken();

    let result = [];
    for (let token of tokens){

        // Test Access Right
        const userInfo = await getUserInfo(token.access_token)
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