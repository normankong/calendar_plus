import * as response from '../lib/responses'
import * as credential from '../lib/credential'

export const route = '/clientId/?'

const status = async (request) => {

    const CLIENT_ID = await credential.getClientId()
    return response.json({clientId : CLIENT_ID})
}

export default status
