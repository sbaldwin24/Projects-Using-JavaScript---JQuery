var $el = $(".writer"),
  txt = $el.text(),
  txtLen = txt.length,
  timeOut,
  char = 0;

$el.text("|");

(function typeIt() {
  var humanize = Math.round(Math.random() * (100 - 30)) + 30;
  timeOut = setTimeout(function() {
    char++;
    var type = txt.substring(0, char);
    $el.text(type + "|");
    typeIt();

    if (char == txtLen) {
      $el.text($el.text().slice(0, -1)); // remove the '|'
      clearTimeout(timeOut);
    }
  }, humanize);
})();

// when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
// not supported in all browsers though and sometimes needs a prefix, so we need a shim
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// now we will setup our basic variables for the demo
var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  // full screen dimensions
  cw = window.innerWidth,
  ch = window.innerHeight,
  // firework collection
  fireworks = [],
  // particle collection
  particles = [],
  // starting hue
  hue = 120,
  // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
  limiterTotal = 5,
  limiterTick = 0,
  // this will time the auto launches of fireworks, one launch per 80 loop ticks
  timerTotal = 80,
  timerTick = 0,
  mousedown = false,
  // mouse x coordinate,
  mx,
  // mouse y coordinate
  my;

// set canvas dimensions
canvas.width = cw;
canvas.height = ch;

// get a random number within a range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// calculate the distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
  var xDistance = p1x - p2x,
    yDistance = p1y - p2y;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// create firework
function Firework(sx, sy, tx, ty) {
  // actual coordinates
  this.x = sx;
  this.y = sy;
  // starting coordinates
  this.sx = sx;
  this.sy = sy;
  // target coordinates
  this.tx = tx;
  this.ty = ty;
  // distance from starting point to target
  this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
  this.distanceTraveled = 0;
  // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
  this.coordinates = [];
  this.coordinateCount = 3;

  // populate initial coordinate collection with the current coordinates
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }

  this.angle = Math.atan2(ty - sy, tx - sx);
  this.speed = 2;
  this.acceleration = 1.05;
  this.brightness = random(50, 70);
  // circle target indicator radius
  this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function(index) {
  // remove last item in coordinates array
  this.coordinates.pop();
  // add current coordinates to the start of the array
  this.coordinates.unshift([this.x, this.y]);

  // cycle the circle target indicator radius
  if (this.targetRadius < 8) {
    this.targetRadius += 0.3;
  } else {
    this.targetRadius = 1;
  }

  // speed up the firework
  this.speed *= this.acceleration;
  // get the current velocities based on angle and speed
  var vx = Math.cos(this.angle) * this.speed,
    vy = Math.sin(this.angle) * this.speed;
  // how far will the firework have traveled with velocities applied?
  this.distanceTraveled = calculateDistance(
    this.sx,
    this.sy,
    this.x + vx,
    this.y + vy
  );

  // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
  if (this.distanceTraveled >= this.distanceToTarget) {
    createParticles(this.tx, this.ty);
    // remove the firework, use the index passed into the update function to determine which to remove
    fireworks.splice(index, 1);
  } else {
    // target not reached, keep traveling
    this.x += vx;
    this.y += vy;
  }
};

// draw firework
Firework.prototype.draw = function() {
  ctx.beginPath();
  // move to the last tracked coordinate in the set, then draw a line to the current x and y
  ctx.moveTo(
    this.coordinates[this.coordinates.length - 1][0],
    this.coordinates[this.coordinates.length - 1][1]
  );
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
  ctx.stroke();
  ctx.beginPath();
  // draw the target for this firework with a pulsing circle
  ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
  ctx.stroke();
};

// create particle
function Particle(x, y) {
  this.x = x;
  this.y = y;
  // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
  this.coordinates = [];
  this.coordinateCount = 5;

  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }

  // set a random angle in all possible directions, in radians
  this.angle = random(0, Math.PI * 2);
  this.speed = random(1, 10);
  // friction will slow the particle down
  this.friction = 0.95;
  // gravity will be applied and pull the particle down
  this.gravity = 1;
  // set the hue to a random number +-20 of the overall hue variable
  this.hue = random(hue - 20, hue + 20);
  this.brightness = random(50, 80);
  this.alpha = 1;
  // set how fast the particle fades out
  this.decay = random(0.015, 0.03);
}

// update particle
Particle.prototype.update = function(index) {
  // remove last item in coordinates array
  this.coordinates.pop();
  // add current coordinates to the start of the array
  this.coordinates.unshift([this.x, this.y]);
  // slow down the particle
  this.speed *= this.friction;
  // apply velocity
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed + this.gravity;
  // fade out the particle
  this.alpha -= this.decay;

  // remove the particle once the alpha is low enough, based on the passed in index
  if (this.alpha <= this.decay) {
    particles.splice(index, 1);
  }
};

// draw particle
Particle.prototype.draw = function() {
  ctx.beginPath();
  // move to the last tracked coordinates in the set, then draw a line to the current x and y
  ctx.moveTo(
    this.coordinates[this.coordinates.length - 1][0],
    this.coordinates[this.coordinates.length - 1][1]
  );
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle =
    "hsla(" +
    this.hue +
    ", 100%, " +
    this.brightness +
    "%, " +
    this.alpha +
    ")";
  ctx.stroke();
};

// create particle group/explosion
function createParticles(x, y) {
  // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
  var particleCount = 30;

  while (particleCount--) {
    particles.push(new Particle(x, y));
  }
}
function loop() {
  // this function will run endlessly with requestAnimationFrame
  requestAnimFrame(loop);
  // increase the hue to get different colored fireworks over time
  hue += 0.5;
  // normally, clearRect() would be used to clear the canvas
  // we want to create a trailing effect though
  // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
  ctx.globalCompositeOperation = "destination-out";
  // decrease the alpha property to create more prominent trails
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, cw, ch);
  // change the composite operation back to our main mode
  // lighter creates bright highlight points as the fireworks and particles overlap each other
  ctx.globalCompositeOperation = "lighter";

  // loop over each firework, draw it, update it
  var i = fireworks.length;
  while (i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  // loop over each particle, draw it, update it
  var i = particles.length;
  while (i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  // launch fireworks automatically to random coordinates, when the mouse isn't down
  if (timerTick >= timerTotal) {
    if (!mousedown) {
      // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
      fireworks.push(
        new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2))
      );
      timerTick = 0;
    }
  } else {
    timerTick++;
  }

  // limit the rate at which fireworks get launched when mouse is down
  if (limiterTick >= limiterTotal) {
    if (mousedown) {
      // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
      fireworks.push(new Firework(cw / 2, ch, mx, my));
      limiterTick = 0;
    }
  } else {
    limiterTick++;
  }
}

// mouse event bindings
// update the mouse coordinates on mousemove
canvas.addEventListener("mousemove", function(e) {
  mx = e.pageX - canvas.offsetLeft;
  my = e.pageY - canvas.offsetTop;
});

// toggle mousedown state and prevent canvas from being selected
canvas.addEventListener("mousedown", function(e) {
  e.preventDefault();
  mousedown = true;
});

canvas.addEventListener("mouseup", function(e) {
  e.preventDefault();
  mousedown = false;
});

// allows canvas to be in the background

function simulate(e) {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(
    "mousedown",
    true,
    true,
    window,
    0,
    e.screenX,
    e.screenY,
    e.clientX,
    e.clientY,
    false,
    false,
    false,
    false,
    0,
    null
  );
  canvas[0].dispatchEvent(evt);
}

// once the window loads, we are ready for some fireworks!
window.onload = loop;
// PLAYER VARIABLES
var mp3snd = "audio-file.mp3"; // MP3 FILE
var oggsnd = "audio-file.ogg"; // OGG FILE

var loopsong = "no"; // LOOP MUSIC | yes | no |
var autostarts = "yes"; // AUTO START MUSIC | yes | no |

var audiowidth = "300"; // WIDTH OF PLAYER
var borderw = "0"; // BORDER WIDTH AROUND PLAYER
var bordcolor = "0066FF"; // BORDER COLOR
var centerp = "no"; // CENTER PLAYER | yes | no |

if (loopsong == "yes") {
  var looping5 = "loop";
  var loopingE = "true";
} else {
  var looping5 = "";
  var loopingE = "false";
}
if (autostarts == "yes") {
  var h5auto = "autoplay";
  var h4auto = "1";
} else {
  var h5auto = "";
  var h4auto = "0";
}
if (centerp == "yes") {
  var centerply = "auto";
} else {
  var centerply = "0";
}
if (centerp == "yes") {
  document.write("<center>");
}
document.write(
  '<table style="border-collapse:collapse; border-spacing: 0px; margin: ' +
    centerply +
    "; padding: 0px; border: #" +
    bordcolor +
    " " +
    borderw +
    'px solid;"><tr><td style="vertical-align: middle; text-align: center; padding: 0px;">'
);
document.write(
  "<audio " +
    h5auto +
    " controls " +
    looping5 +
    ' style="width:' +
    audiowidth +
    'px;">'
);
document.write('<source src="' + mp3snd + '" type="audio/mpeg">');
document.write('<source src="' + oggsnd + '" type="audio/ogg">');
document.write(
  '<object classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95" type="application/x-mplayer2" width="' +
    audiowidth +
    '" height="45">'
);
document.write('<param name="filename" value="' + mp3snd + '">');
document.write('<param name="autostart" value="' + h4auto + '">');
document.write('<param name="loop" value="' + loopingE + '">');
document.write("</object>");
document.write("</audio>");
document.write("</td></tr></table>");
if (centerp == "yes") {
  document.write("</center>");
}

//Intro Balloon Pops - colour changes
var balloonsContainer = document.getElementById("balloons-container"),
  balloons = balloonsContainer.childNodes,
  introTitle = document.getElementById("intro-title"),
  introSub = document.getElementById("intro-sub"),
  introBut = document.getElementById("intro-button");

for (var i = 0; i < balloons.length; i++) {
  var balloon = balloons[i];
  balloon.addEventListener("click", pop, false);
}

function pop(e) {
  var element = e.target;
  if (element.classList.contains("yellow")) {
    intro.style.background = "rgb(235,255,20)";
    introBut.className = "button-yellow";
    if (introTitle.style.color !== "rgb(51,51,51)") {
      introTitle.style.color = "rgb(51,51,51)";
      introSub.style.color = "rgba(51,51,51,.8)";
    }
  } else if (element.classList.contains("blue")) {
    intro.style.background = "rgb(39,20,255)";
    introBut.className = "button-blue";
    if (introTitle.style.color !== "rgb(255,255,255)") {
      introTitle.style.color = "rgb(255,255,255)";
      introSub.style.color = "rgba(255,255,255,.8)";
    }
  } else if (element.classList.contains("purple")) {
    intro.style.background = "rgb(189,96,255)";
    introBut.className = "button-purple";
    if (introTitle.style.color !== "rgb(255,255,255)") {
      introTitle.style.color = "rgb(255,255,255)";
      introSub.style.color = "rgba(255,255,255,.8)";
    }
  } else if (element.classList.contains("red")) {
    intro.style.background = "rgb(255,39,20)";
    introBut.className = "button-red";
    if (introTitle.style.color !== "rgb(255,255,255)") {
      introTitle.style.color = "rgb(255,255,255)";
      introSub.style.color = "rgba(255,255,255,.8)";
    }
  } else if (element.classList.contains("cyan")) {
    intro.style.background = "rgb(20,235,255)";
    introBut.className = "button-cyan";
    if (introTitle.style.color !== "rgb(255,255,255)") {
      introTitle.style.color = "rgb(255,255,255)";
      introSub.style.color = "rgba(255,255,255,.8)";
    }
  } else if (element.classList.contains("pink")) {
    intro.style.background = "rgb(255,138,187)";
    introBut.className = "button-pink";
    if (introTitle.style.color !== "rgb(255,255,255)") {
      introTitle.style.color = "rgb(255,255,255)";
      introSub.style.color = "rgba(255,255,255,.8)";
    }
  } else if (element.classList.contains("green")) {
    intro.style.background = "rgb(20,189,34)";
    introBut.className = "button-green";
    if (introTitle.style.color !== "rgb(255,255,255)") {
      introTitle.style.color = "rgb(255,255,255)";
      introSub.style.color = "rgba(255,255,255,.8)";
    }
  } else if (element.classList.contains("orange")) {
    intro.style.background = "rgb(255,171,53)";
    introBut.className = "button-orange";
    if (introTitle.style.color !== "rgb(255,255,255)") {
      introTitle.style.color = "rgb(255,255,255)";
      introSub.style.color = "rgba(255,255,255,.8)";
    }
  }
  element.style.display = "none";
  e.preventDefault();
  e.stopPropagation();
}
