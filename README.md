#nodebot with express, sparkjs and particle-io

A proof of concept for communicating
between a Particle [Photon](https://store.particle.io/ "Get a Photon!") board and an [express](http://expressjs.com/ "express") server via events.

![alt tag](https://github.com/chrisbuttery/nodebot-with-express-sparkjs-and-particle-io/blob/master/photon.gif)

The express server will first publish an event named `Foo` with a value.
The server will then listen for any events named `Bar`  
On the event of `Bar`, the server will emit `Foo` again - with a value.

The device will listen for any events named `Foo`.
On the event of `Foo`, the device will :
- turn the LED on or off
- emit `Bah` with a value.

##Requirements

Make sure you've flashed your Photon with the [voodoospark](https://github.com/voodootikigod/voodoospark "voodoospark") firmware.

It is also recommended that you [store your Particle token/device ID in a dot file](https://github.com/rwaldron/particle-io#getting-started) like `.particlerc` so they can be accessed as properties of process.env.

Make sure you include your login/password creds at the bottom of `device.js` and `server.js`. You could
also just store these in your `.particlerc`.

##Usage

Install the dependencies:

```
% npm install
```

Because I'm a slave to ES6, you'll need to make sure you have
babel installed:

```
% npm install -g babel
```

First run the device.js script so the Photon is ready and listening.
I've included the port the micro USB is connected to.  
To find you port run `ls /dev/tty.*` (Mac)

```
% babel-node index.js device.js /dev/cu.usbmodem1421
```

Now the device is ready, run the server in another terminal window:

```
% babel-node server.js
```

If you've wired things up correctly, you should have a flashing LED that turns on
every time `Bar` is emitted. I just included the button for funsies using [particle-io](https://github.com/rwaldron/particle-io "particle-io").
