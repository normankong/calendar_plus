import * as response from '../lib/responses'
import * as credential from '../lib/credential'
import fetch from 'node-fetch'

export const route = '/calendar/(?<name>.+)'
export const method = 'post'

const handler = async (request) => {

	let email = await credential.getEmailFromHeader(request.headers)
	let token = await credential.getAccessToken(email)
	let res = await listCalendars(token)

	let params =  request.params
	let item = await res.items.find((item) => item.summary == params.name);

	if (item != null){
		await updateCalendarId(email, item.id)
	}

	return response.json(item)
}

async function listCalendars(token){
	const response = await fetch(
		`https://www.googleapis.com/calendar/v3/users/me/calendarList`,{
		  headers: {
			Authorization: `${token.token_type + " " + token.access_token}`
		  	}
		}
	)
	return response.json()
}


async function updateCalendarId(email, id){
	await FILES.put(email + "-calendar", id)
}

export default handler