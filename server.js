import express from 'express'
import spark from 'spark'

const app = express()
let tally = 0

/**
 * publishEvent
 * Publish a global event
 * @param  {String} name  'Bar'
 * @param  {Number} value 2
 */

function publishEvent(name, value) {
  return spark.publishEvent(name, value)
    .then(data => {
      console.log("Event: %s published succesfully: %s", name, value)
    }, err => {
      console.log("Failed to publish event: %s. %s", name, err)
    })
}

/**
 * Set up express server:
 * - tell it to list to port 3000
 */

const server = app.listen(3000, () => {
  var host = server.address().address
  var port = server.address().port
  console.log('Server listening at http://%s:%s', host, port)
})

server.listen(app.get('port'))

/**
 * Login
 * When the server logs in, listen for
 * the `Foo` event emitted from the server
 */

spark.on('login', () => {
  console.log('server logged in')

  // Listen for 'Foo'
  // - update the running tally
  // - call `Bar` with the new tally
  spark.onEvent('Foo', e => {
    tally = Number(e.data) + 1
    publishEvent('Bar', tally)
  })

  // Kick of the initial event to get it all started
  publishEvent('Bar', tally)
})

// your particle credentials
spark.login({
  username: process.env.PARTICLE_USER,
  password: process.env.PARTICLE_PASS
})
