import five from 'johnny-five'
import Particle from 'particle-io'
import spark from 'spark'

const btnPin = 'D0'
const ledPin = 'D7'
let tally = 0
let ledValue

/**
 * publishEvent
 * Publish a global event
 * @param  {String} name  'Foo'
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
 * Create a new johnny-five board with particle-io
 */

const board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_DEVICE_ID_2,
    port: process.argv[2] || null
  })
})

// Let's go!
board.on('ready', () => {

  // Create a new `button` and `led`
  const button = new five.Button(btnPin)
  const led = new five.Led(ledPin)

  // Inject the `button` hardware into
  // the Repl instance's context
  // allows direct command line access
  board.repl.inject({
    button: button,
    on: () => {
      led.on()
    },
    off: () => {
      led.off()
    },
    led: led
  })

  // On button press - call turnOn()
  button.on('press', () => {
    turnOn()
  })

  // on button release - - call turnOff()
  button.on('release', () => {
    turnOff()
  })
})

/**
 * turnOff
 * Call 'off' in the repl instance
 */

function turnOff () {
  board.repl.context.off()
}

/**
 * turnOn
 * Call 'on' in the repl instance
 */

function turnOn () {
  board.repl.context.on()
}

/**
 * toggleLED
 * This function is called from the event `Bar`
 * Get the current value of led in the board and
 * either turn it on or off
 */
function toggleLED () {
  if (!board.isReady) return
  ledValue = board.repl.context.led.value

  if (ledValue !== 0) {
    turnOff()
  } else {
    turnOn()
  }
}

/**
 * Login
 * When the device logs in, listen for
 * the `Bar` event emitted from the server
 */

spark.on('login', () => {
  console.log('device logged in')

  // Listen for 'Bar'
  // - toggle the LED
  // - update the running tally
  // - publish `Foo` with the updated tally
  spark.onEvent('Bar', e => {
    toggleLED()
    tally = Number(e.data) + 1

    // publish an event for the server to listen to
    publishEvent('Foo', tally)
  })
})

// your particle credentials
spark.login({
  username: process.env.PARTICLE_USER,
  password: process.env.PARTICLE_PASS
})
