
import jwt from 'jsonwebtoken'

/**
 * Get Email Address from JWT Token, from Header
 */
export const getEmailFromHeader = async(headers, headerName = "token") => {
	let map = new Map(headers)
	let token = map.get(headerName)
	let PUBLIC_KEY = await CRENDENTIALS.get("PUBLIC_KEY");
	let decrypted = jwt.verify(token, PUBLIC_KEY);
	return decrypted.email
}

/**
 * Get Access Token from Cloudflare KV
 * Assume return Token JSON Object
 */
export const getAccessToken = async(email) => {
	let token = await FILES.get(email + "-access")
	// console.log(`Access Token ${token}`)
	return JSON.parse(token)
}

/**
 * Update Access Token into Cloudflare KV
 */
async function _updateAccessToken (email, token) {
	await FILES.put(email + "-access", token)
}

/**
 * Update Refresh Token into Cloudflare KV
 */
export const _updateRefreshToken = async(email, token) => {
	await FILES.put(email + "-refresh", token)
}

async function _getRefreshToken(email) {
	return await FILES.get(email + "-refresh")
}

/**
 * Update Token into Cloudflare KV
 */
export const updateToken = async (email, token) => {
	
	// Update Access Token
	await _updateAccessToken(email, JSON.stringify(token))

	// Update Refresh Token if it is not empty (i.e. first time)
	if (token.refresh_token != null) {
		await _updateRefreshToken(email, token.refresh_token)
	}
}

/**
 * Get Client ID
 */
 async function _getClientId() {
	return await CRENDENTIALS.get("CLIENT_ID")
}
export const getClientId = _getClientId

/**
 * Get Client Secret
 */
async function _getClientSecret() {
	return await CRENDENTIALS.get("CLIENT_SECRET")
}
export const getClientSecret = _getClientSecret

/**
 * Get Timezone Info
 */
 export const getTimeZoneConfig = async () => {
	let timeZoneConfig = await CRENDENTIALS.get("TIMEZONE_CONFIG")
	return JSON.parse(timeZoneConfig)
}

/**
 * Refresh Access Token 
 */
export const refreshAccessToken = async(email) => {

	// Get Refresh Token
	let refresh_token = await _getRefreshToken(email)
	// console.log(`Refresh Token : ${refresh_token}`);

	// Refresh Access Token
	const CLIENT_ID = await _getClientId()
	const CLIENT_SECRET = await _getClientSecret()

	const response = await fetch(
		`https://oauth2.googleapis.com/token`,{
			method: 'POST',
			body: JSON.stringify({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				refresh_token: refresh_token,
				grant_type: 'refresh_token'
			})
		}
	)

	let token = await response.json();
	// console.log(`Access Token ${JSON.stringify(token)}`)
    await _updateAccessToken(email, JSON.stringify(token));
	return token;
}