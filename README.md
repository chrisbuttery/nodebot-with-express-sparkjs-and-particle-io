#Controlling nodebots with the web

An example of communicating
between a Spark [Photon](https://store.particle.io/ "Get a Photon!") board and an [express](http://expressjs.com/ "express") server via events.

![alt tag](https://github.com/chrisbuttery/nodebot-with-express-sparkjs-and-spark-io/blob/master/photon.gif)

The express server will first publish an event named `Foo` with a value.
The server will then listen for any events named `Bar`  
On the event of `Bar`, the server will emit `Foo` again - with a value.

The device will listen for any events named `Foo`.
On the event of `Foo`, the device will emit `Bah` with a value.

##Requirements

Install the required node modules

```
% npm install
```

Make sure you include your login/password creds at the bottom of `device.js` and `server.js`

##Usage

First run the device.js script so the Photon is ready and listening.
I've included the port the micro USB is connected to.  
To find you port run `ls /dev/tty.*` (Mac)

```
% node device.js /dev/cu.usbmodem1421
```

Now the device is ready, run the server in another terminal window:

```
% node server
```

If you've wired things up correctly, you should have a flashing LED that turns on
every time `Bar` is emitted. I just included the button for funsies using [spark-io](https://github.com/rwaldron/spark-io "spark io").
