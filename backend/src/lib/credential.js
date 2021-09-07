
import jwt from 'jsonwebtoken'

export const isAdmin = async(headers, headerName = "token") => {
	try {
		let email = await getEmailFromHeader(headers, headerName);
		let admin = await CRENDENTIALS.get("ADMIN");
		return (email == admin);
	} catch(err) {
		console.log(err)
		return false;
	}
}


/**
 * Get the JWT Token from header
 */
 export const getJWTFromHeader = async(headers, headerName = "token") => {
	try {
		let map = new Map(headers)
		let encrypted = map.get(headerName);
		let publicKey = await _getPublicKey();
		let token = jwt.verify(encrypted, publicKey);
		return token;
	} catch(err) {
		console.log(`Something went wrong : ${err}`);
		return null;
	}
}

/**
 * Get Email Address from JWT Token, from Header
 */
export const getEmailFromHeader = async(headers, headerName = "token") => {
	let jwt = await getJWTFromHeader(headers, headerName);
	if (jwt != null) return jwt.email;
	return null;
}

/**
 * Get Access Token from Cloudflare KV
 * Assume return Token JSON Object
 */
export const getAccessToken = async(email) => {
	let token = await FILES.get(`access-${email}`)
	// console.log(`Access Token ${token}`)
	return JSON.parse(token)
}

/**
 * Update Access Token into Cloudflare KV
 */
async function _updateAccessToken (email, token) {
	await FILES.put(`access-${email}`, token)
}

/**
 * Update Refresh Token into Cloudflare KV
 */
export const _updateRefreshToken = async(email, token) => {
	await FILES.put(`refresh-${email}`, token)
}

async function _getRefreshToken(email) {
	return await FILES.get(`refresh-${email}`)
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
 * Get Public Key
 */
 async function _getPublicKey() {
	return await CRENDENTIALS.get("PUBLIC_KEY")
}
export const getPublicKey = _getPublicKey


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

/**
 * Sign a JWT Token
 */
export const signJWT = async(email) => {
	let privateKey = await CRENDENTIALS.get("PRIVATE_KEY");
	var token = jwt.sign({ email }, privateKey, { algorithm: 'RS256',  expiresIn: '1y' });
	return token;
}

/**
 * 
 * @returns Get all the Refresh Token Email
 */
async function _getEmails(){
  
	// The default pagination is 1000
	let entries = await FILES.list({prefix : "refresh-"});
  
	let emails = entries.keys.map(x => x.name.replace("refresh-", ""));
  
	return emails;
}
export const getEmails = _getEmails