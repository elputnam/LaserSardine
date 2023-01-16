//HR and slitscan animation for GhostWork

//slit scan cam
let capture;
let x = 0; 

let fast = 0;
let bLoop = true; 
let bFlip = false;
let flipCounter = 0;
let shift;

//Serial Port
let pHtmlMsg;
let serialOptions = { baudRate: 115200  };
let serial;
let variable = 60;

//sound
let carrier;
let mod;


// noise wave
let xoff1 = 0;
let xoff2 = 10000;
let inc = 0.003;
let start = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);

  //set up cam
  capture = createCapture(VIDEO);
  //capture.size(windowWidth,windowHeight);
  capture.size(1920, 1080)
  capture.hide();

  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

    // If we have previously approved ports, attempt to connect with them
    serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

    // Add in a lil <p> element to provide messages. This is optional
    //pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");

  //sound
  carrier = new p5.Oscillator(); // connects to master output by default
  carrier.freq(200);
  carrier.amp(0);
  carrier.start();
  mod = new p5.Oscillator('triangle');
  mod.disconnect(); // disconnect the modulator from master output
  mod.freq(0);
  mod.amp(0);
  mod.start();
  carrier.amp(mod.scale(-1, 1, 1, -1));
}

function draw() {
  //image(capture, 0, 0, 320, 240);
  //console.log(frameCount);

  let w = capture.width;
  let h = int(capture.height); 
  fast = 1;
   // tint
   noStroke();
   let shade = map(variable, 60, 180, 0, 360);
   fill(shade, 100, 50, 0.5);
  //  rectMode(CENTER);
   rect(0, 0, width, height); 

   //sound 
   let modFreq = map(variable, 60, 180, 0, 200)
    let modAmp = map(variable, 60, 180, 0, 1)
   mod.freq(modFreq);
   mod.amp(modAmp, 0.1);

  //text
  // fill(0)
  // stroke(255);
  // textSize(100);
  // text(variable, 0, 100);
  
  //slitscan cam
  if(!bFlip) {
    copy(capture, w/2, 0, random(1, 20), h, x, 0, random(1, 20), h);
  } else {
    copy(capture, 0,w/2, h, 1, 0, x, h, 1);
  }
  x += fast;

  if (bLoop == true &&  x >= width) {
    x = 0; 
  }
  
  //random change cam direction
  // if (frameCount%int(random(500,1000))==0){
  //   bFlip = !bFlip;
  // }
  
  //noise wave
  let xoff = start;
  beginShape();
  
  for (let x = 0; x < width; x++){
    
    //fill(0);
    // var y = noise(xoff) * height;
    var y = map(variable, 60, 180, height, 0);
    let lineHue = map(variable, 60, 180, 360, 0);
    //noStroke();
    strokeWeight(5);
    // stroke(0);
    // stroke(0, 100, 50, 10);
    stroke(lineHue, 100, 100);
    // fill(lineHue, 100, 50);
    vertex(x, y);
    xoff += inc;
  }

  endShape();
  start += inc;


}

function keyPressed(){
  if (key == 'l') { 
    bLoop = !bLoop; 
    x = 0;
    fast = 1;
  }

  if (key == 'f') {
    //bFlip = !bFlip;
    let fs = fullscreen();
    fullscreen(!fs);
  }



}
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}


/**   Callback function by serial.js when there is an error on web serial
* 
  * @param {} eventSender 
  */
 function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
  //pHtmlMsg.html(error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
  //pHtmlMsg.html("Serial connection opened successfully");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  //pHtmlMsg.html("onSerialConnectionClosed");
}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */
function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
  //pHtmlMsg.html("onSerialDataReceived: " + newData);
  variable = newData;
}

/**
 * Called automatically by the browser through p5.js when mouse clicked
 */
function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
  let fs = fullscreen();
  fullscreen(!fs);
}
