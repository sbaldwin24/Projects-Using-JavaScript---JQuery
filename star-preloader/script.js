function Circle (x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.angle = 0;
}

function Star (x, y, rotation) {
  this.x = x;
  this.y = y;
  this.length = 15;
  this.scaleX = .1;
  this.scaleY = .1;
  this.rotation = rotation;
  this.angle = Math.random() * 360;
  this.vx = 0;
  this.vy = 0;
  this.alpha = 1;
}

Star.prototype.draw = function(ctx) {
  ctx.save();
  ctx.globalAlpha = this.alpha;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation * Math.PI / 180);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(24,0);
  ctx.lineTo(24,24);
  ctx.lineTo(0,24);
  ctx.closePath();
  ctx.scale(this.scaleX, this.scaleY);
  ctx.strokeStyle = 'rgba(255,0,0,1)';
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 4;
  ctx.save();
  ctx.fillStyle = 'rgba(255,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(12,0.89);
  ctx.lineTo(15.609,8.204);
  ctx.lineTo(23.682,9.377);
  ctx.lineTo(17.842,15.071);
  ctx.lineTo(19.22,23.11);
  ctx.lineTo(12,19.315);
  ctx.lineTo(4.78,23.11);
  ctx.lineTo(6.159,15.071);
  ctx.lineTo(0.318,9.377);
  ctx.lineTo(8.39,8.204);
  ctx.lineTo(12,0.89);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.restore();
};

function Square(x, y) {
  this.x = x;
  this.y = y;
}

var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    W = canvas.width = window.innerWidth,
    H = canvas.height = window.innerHeight,
    stars = [],
    circle = new Circle(W / 2, H / 2, 110),
    square = new Square(W / 2, H / 2);

function animateRect(square) {
  var star, counter = 0;
  square.x = W / 2 + (circle.radius * Math.cos(circle.angle * .047));
  square.y = H / 2 + (circle.radius * Math.sin(circle.angle * .047));
  circle.angle++;
  stars.push(new Star(square.x, square.y, Math.random() * 360));
}

function moveStars() {
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    if (star.scaleX <= 1) {
      star.scaleX += .05;
      star.scaleY += .05;
    }
    if (star.alpha >= .05) {
      star.alpha -= .015;
    } else if (star.alpha < .1) {
      stars.splice(stars[i], 1);
    }
    star.vx = Math.sin(star.angle) * .5;
    star.vy = Math.cos(star.angle) * .5;
    star.angle += .1;
    star.x += star.vx;
    star.y += star.vy;
    star.draw(ctx);
  }
}

(function drawFrame(){
  window.requestAnimationFrame(drawFrame, canvas);
  ctx.fillStyle = '#17293a';
  ctx.fillRect(0, 0, W, H);
  animateRect(square);
  moveStars();
}());
