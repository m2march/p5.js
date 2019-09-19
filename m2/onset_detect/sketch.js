var amps = [];
var index = 0;
var sound;
var amp;
var filter;
var max_length;
var diff_th = 0.05;

function preload() {
  sound = loadSound('../../audio/coreo-1.mp3')
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  max_length = width;
  //filter = new p5.LowPass(40000);
  //sound.connect(filter);
  sound.connect();
  amp = new p5.Amplitude();
  amp.setInput(sound);

  print(index);
}

function draw() {
  if (sound.isPlaying()) {
    fill(0);
    rect(0, 0, width, height);
    var a = amp.getLevel();
    amps[index] = a;
    index = (index + 1) % max_length;
    stroke(255);
    var diff = [];
    for (var i = 1; i < amps.length; i++) {
      diff[i-1] = amps[i] - amps[i-1];
    }
    for (var i = 0; i < diff.length; i++) {
      var x = windowWidth - i - 100;
      var idx = index - i;
      if (idx < 0) {
        idx = max_length - i + index; 
      }
      var ad = diff[idx];
      if (ad < 0) {
        ad = 0;
      }
      var mad = map(ad, -2, 2, -windowHeight, windowHeight);
      stroke('white');
      line(x, windowHeight/2, x, windowHeight/2 - mad);
      line(x, windowHeight, x, windowHeight - map(amps[idx], 0, 2, 0, windowHeight / 2));
      stroke('red');
      if (ad > diff_th) { 
        line(x, windowHeight, x, windowHeight / 2)
      }
    }
  }
}

function mousePressed() {
  if (!sound.isPlaying()) {
    sound.play();
  } else {
    sound.pause();
    print(amps);
  }
}
