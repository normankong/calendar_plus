import * as response from '../lib/responses'
import * as credential from '../lib/credential'
import { objectToTable } from '../lib/objectToTable'
import fetch from 'node-fetch'

export const route = '/token/refresh/'
export const method = 'post'

const handler = async (request) => {

	let email = await credential.getEmailFromHeader(request.headers)

    // Refresh the Access Token
    const token = await credential.refreshAccessToken(email)

    // Test Access Right
    const userInfo = await getUserInfo(token.access_token)

    let result = []
    Object.keys(userInfo).map(key => {
        result[key] = userInfo[key]
    })

	const html = `${objectToTable(result)} <br/><pre>${JSON.stringify(token, null, '\t')}</pre>`

    return response.html(html)
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