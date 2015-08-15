var five = require('johnny-five')
var SparkIO = require('spark-io')
var spark = require('spark')

var board
var button
var pin = 'D0'
var led
var tally = 0

/**
 * Create a new johnny-five board with spark-io
 */

board = new five.Board({
  io: new SparkIO({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID_2,
    port: process.argv[2] || null
  })
})

// Let's go!
board.on('ready', function () {

  // Create a new `button` and `led`
  button = new five.Button(pin)
  led = new five.Led('D7')

  // Inject the `button` hardware into
  // the Repl instance's context
  // allows direct command line access
  board.repl.inject({
    button: button,
    on: function () {
      led.on()
    },
    off: function () {
      led.off()
    },
    led: led
  })

  // On button press - call turnOn()
  button.on('press', function () {
    turnOn()
  })

  // on button release - - call turnOff()
  button.on('release', function () {
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
  var ledValue = board.repl.context.led.value

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

spark.on('login', function () {
  console.log('device logged in')

  // Listen for 'Bar'
  // - toggle the LED
  // - update the running tally
  // - call `Foo` with the new tally
  spark.onEvent('Bar', function (e) {
    console.log('Device received: ', e.data)
    toggleLED()
    tally = Number(e.data) + 1
    spark.publishEvent('Foo', tally)
  })
})

spark.login({
  username: 'you@email.com',
  password: 'password'
})
