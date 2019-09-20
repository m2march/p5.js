var od;
var mic;
var particles = [];
var sound;
var START_LIFE = 25;

function preload() {
  sound = loadSound('../../audio/coreo-1.mp3');
}


class Particle {
  life = START_LIFE;
  x = random(0, width);

  constructor(amp) {
    this.y = map(amp, 0, 0.2, height, 0);
  }

  draw() {
    stroke(200);
    line(this.x, height, this.x, map(this.life, START_LIFE, 0, this.y, height));
    if (this.life > 0) {
      this.life--;
    }
  }
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  od = new OnsetDetector(0.05);
  userStartAudio().then(startAudio);
  frameRate(2000);
}

function draw() {
  fill(0);
  rect(0, 0, width, height);
  if (od.amp_input == null) {
    return;
  }
  //print(mic.getLevel());
  if (od.isOnset()) {
    p = new Particle(od.amp_input.getLevel());
    particles[particles.length] = p;
  }
  for (var i = 0; i < particles.length; i++) {
    particles[i].draw();
  }
  var np = [];
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].life > 0) {
      np[np.length] = particles[i];
    }
  }
  particles = np;
}

function mousePressed() {
  sound.play();
}

function startAudio() {
  //mic = new p5.AudioIn();
  //mic.start();
  amp = new p5.Amplitude();
  amp.setInput(sound);
  od.setInput(amp);
}
