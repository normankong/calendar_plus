import Router from './lib/router'
import notFound from './pages/404'
import { getRoutes } from './lib/auto-routes'
import refreshToken from './lib/refreshToken'

const routes = getRoutes()
const router = new Router()

routes.forEach(({ route, method, module }) => router[method](route, module))
router.all(notFound)

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', event => {
	event.waitUntil(
	  handleSchedule(event.scheduledTime)
	);
  })
  
async function handleSchedule(scheduledDate) {
	console.log(`Start : ${scheduledDate}`);
	await refreshToken();
	console.log(`End : ${scheduledDate}`);
}


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
	const response = await router.route(request)
	return response
}

