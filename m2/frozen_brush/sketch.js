/*
Frozen brush

Makes use of a delaunay algorithm to create crystal-like shapes.
I did NOT develop delaunay.js, and not sure who the author really is to give proper credit.

Controls:
	- Drag the mouse.
    - Press any key to toggle between fill and stroke.

Inspired by:
	Makio135's sketch www.openprocessing.org/sketch/385808

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var allParticles = [];
var maxLevel = 5;
var useFill = true;
var ampTh = 0.1;

var data = [];

var audio;


// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
function Particle(x, y, level) {
  this.level = level;
  this.life = 0;
  
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 2));
  
  this.move = function(mult) {
    if (mult === undefined) {
      mult = 1;
    } 
    this.life++;
    
    // Add friction.
    this.vel.mult(0.9);
    
    this.pos.add(createVector(this.vel.x * mult, this.vel.y * mult));
    
    // Spawn a new particle if conditions are met.
    if (this.life % 10 == 0) {
      if (this.level > 0) {
        this.level -= 1;
        var newParticle = new Particle(this.pos.x, this.pos.y, this.level-1);
        allParticles.push(newParticle);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  
  colorMode(HSB, 360);
  
  textAlign(CENTER);
  
  background(0);

  audio = new p5.AudioIn();
  audio.start();
} 


function draw() {

  // Create fade effect.
  noStroke();
  fill(0, 30);
  rect(0, 0, width, height);

  // Amp update particles
  updateParticles();

  // Draw amp bar
  var h = map(audio.getLevel(), 0, 1, 0, height);
  fill('red');
  rect(0, 0, 20, h);
  stroke('green');
  line(0, ampTh * height, 20, ampTh * height);
  
  // Move and spawn particles.
  // Remove any that is below the velocity threshold.
  for (var i = allParticles.length-1; i > -1; i--) {
    allParticles[i].move();
    
    if (allParticles[i].vel.mag() < 0.01) {
      allParticles.splice(i, 1);
    }
  }
  
  if (allParticles.length > 0) {
    // Run script to get points to create triangles with.
    data = Delaunay.triangulate(allParticles.map(function(pt) {
      return [pt.pos.x, pt.pos.y];
    }));
  	
    strokeWeight(0.1);
    
    // Display triangles individually.
    for (var i = 0; i < data.length; i += 3) {
      // Collect particles that make this triangle.
      var p1 = allParticles[data[i]];
      var p2 = allParticles[data[i+1]];
      var p3 = allParticles[data[i+2]];
      
      // Don't draw triangle if its area is too big.
      var distThresh = 75;
      
      if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      // Base its hue by the particle's life.
      if (useFill) {
        noStroke();
        fill(165+p1.life*1.5, 360, 360);
      } else {
        noFill();
        stroke(165+p1.life*1.5, 360, 360);
      }
      
      triangle(p1.pos.x, p1.pos.y, 
               p2.pos.x, p2.pos.y, 
               p3.pos.x, p3.pos.y);
    }
  }
  
  noStroke();
  fill(255);
  text("Click and drag the mouse\nPress any key to change to fill/stroke", width/2, height-50);
}


function mouseDragged() {
  allParticles.push(new Particle(mouseX, mouseY, maxLevel));
  print('mouse: ' + allParticles.length);
}

function updateParticles() {
  var amp = audio.getLevel();
  if (amp > ampTh) {  
    var vel = map(amp, 0, 2, 0, 1000);
    if (allParticles.length == 0) {
      var x = random(width);
      var y = random(height);
      allParticles.push(new Particle(x, y, maxLevel));
    }
    last_particle = allParticles[allParticles.length - 1];
    new_particle = new Particle(last_particle.pos.x, last_particle.pos.y, 
                               maxLevel);
    new_particle.move(vel);
    allParticles.push(new_particle);
    print('update: ' + allParticles.length)
  }
}


function keyPressed() {
  useFill = ! useFill;
}
