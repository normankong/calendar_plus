import * as response from '../lib/responses'
import * as credential from '../lib/credential'
import fetch from 'node-fetch'

export const route = '/calendar/?'

const handler = async (request) => {

	let email = await credential.getEmailFromHeader(request.headers)
	let token = await credential.getAccessToken(email)
	let res = await listCalendars(token)

	// Format Result
	let result = await res.items.map((item) => {
		return {	
			id : item.id,
			description : item.description,
			summary : item.summary
		}
	});

	return response.json(result);
}

async function listCalendars(token){
	const response = await fetch(
		`https://www.googleapis.com/calendar/v3/users/me/calendarList`,{
			headers: {
				Authorization: `${token.token_type + " " + token.access_token}`
		  	}
		}
	)

	return response.json();
}

export default handler