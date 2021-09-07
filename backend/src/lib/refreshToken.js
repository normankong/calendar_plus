import * as credential from '../lib/credential'

export const refreshToken = obj => {

	const email = "normankong@gmail.com"

    // Refresh the Access Token
    credential.refreshAccessToken(email)
}
