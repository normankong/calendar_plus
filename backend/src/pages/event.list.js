import * as response from '../lib/responses'
import * as credential from '../lib/credential'
import fetch from 'node-fetch'

export const route = '/event/?'
export const method = 'get'

const handler = async (request) => {

	let email = await credential.getEmailFromHeader(request.headers)
	let token = await credential.getAccessToken(email)

	let calendarId = await FILES.get(`calendar-${email}`)
	let res = await listEvent(token, calendarId)
	
	return response.json(res)
}

async function listEvent(token, calendarId){

	let url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`);
	let startTime = new Date().toISOString()

	let params = {
		timeMin : startTime,
		singleEvents: 'true',
		timeZone: 'Asia/Hong_Kong',
		orderBy : 'startTime'
	};

	url.search = new URLSearchParams(params).toString();

	const response = await fetch(url.toString(), {
			headers: {
				Authorization: `${token.token_type + " " + token.access_token}`
			}
		}
	)
	return response.json()
}

export default handler

