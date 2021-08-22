import * as response from '../lib/responses'
import * as credential from '../lib/credential'
import fetch from 'node-fetch'
import moment from 'moment'

export const route = '/event/?'
export const method = 'post'

const handler = async (request) => {

	let email = await credential.getEmailFromHeader(request.headers)
	let token = await credential.getAccessToken(email)
	let requestJson = await request.json()

	let calReq = await enrichRequest(requestJson)
	let calendarId = await FILES.get(`${email}-calendar`)
	let res = await insertEvent(token, calReq, calendarId)
	
	return response.json(res)
}

async function insertEvent(token, request, calendarId){

	const response = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,{
			method: 'POST',
			body: JSON.stringify(request),
			headers: {
			Authorization: `${token.token_type + " " + token.access_token}`
			}
		}
	)
	return response.json()
}

async function enrichRequest(request){
	// console.log(JSON.stringify(request))

	let timeZoneConfig = await credential.getTimeZoneConfig();

	let timezone = (request.timezone) ? request.timezone : "HKT"
	let start = request.start
	let duration = parseInt(request.duration || "1", 10)

	let strTime = moment(start, moment.ISO_8601)
	let endTime = strTime.clone().add(duration, 'hours')

	let strTimestamp = strTime.format('YYYY-MM-DDTHH:mm:ss') + timeZoneConfig[timezone].offset;
	let endTimestamp   = endTime.format('YYYY-MM-DDTHH:mm:ss') + timeZoneConfig[timezone].offset;
	
	let response = {
		"summary": request.summary,
		"description": request.description || "",
		"start": {
			"dateTime": strTimestamp,
			"timeZone": timeZoneConfig[timezone].name,
		},
		"end": {
			"dateTime": endTimestamp,
			"timeZone": timeZoneConfig[timezone].name,
		},
		"reminders": {
			"useDefault": false,
			"overrides": [
				{ "method": "popup", "minutes": 1440 }
			]
		}
	}
	// console.log(JSON.stringify(response))

	return response
}

function initTimeDiffHash(){
	let hash = [];
	hash['EST'] = '-05:00';
	hash['PST'] = '-07:00';
	hash['HKT'] = '+08:00';
	
	return hash;
}

function initTimeZoneHash(){
	let hash = [];
	hash['EST'] = 'America/New_York';
	hash['PST'] = 'America/Vancouver';
	hash['HKT'] = 'Asia/Hong_Kong';
	return hash;
}

export default handler

