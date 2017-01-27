var s = Snap("#svg");
var fps = 60;
var rect;

var character
var track
var dAlongTrack
var goal

/*
MATH
*/

class Vector {
  constructor(x=0, y=0) {
    this.x = Number(x);
    this.y = Number(y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  scale(amt) {
    this.x *= amt;
    this.y *= amt;
  }

  normalize() {
    this.scale(1 / this.magnitude);
  }

  get normalized() {
    var ret = new Vector(this.x, this.y);
    ret.normalize();
    return ret;
  }

  get magnitudeSq() {
    return this.x*this.x + this.y*this.y;
  }

  get magnitude() {
    return Math.sqrt(this.magnitudeSq);
  }

  static sum(a, b) {
    return new Vector(a.x+b.x, a.y+b.y);
  }

  static diff(a, b) {
    return new Vector(a.x-b.x, a.y-b.y);
  }

  static dot(a, b) {
    return a.x*b.x + a.y*b.y;
  }

  static distSq(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx*dx + dy*dy;
  }
}

/*
EVENTS
*/

function lineString(line) {
  return "M" + line.attr("x1") + "," + line.attr("y1")
    + "L" + line.attr("x2") + "," + line.attr("y2");
}

function moveLine(direction) {
  // get track (using check intersection, for now assume it's the only track)
  var point = Snap.path.getPointAtLength(lineString(track), dAlongTrack);
  point = new Vector(point.x, point.y);
  var characterPos = new Vector(character.attr("cx"), character.attr("cy"));
  if (Vector.diff(point, characterPos).magnitude < 0.01) {
    dAlongTrack += direction;
    if (dAlongTrack < 0) dAlongTrack = 0;
    var newPoint = Snap.path.getPointAtLength(lineString(track), dAlongTrack);
    newPoint = new Vector(newPoint.x, newPoint.y);
    character.attr({cx: newPoint.x, cy: newPoint.y});
  }
}

window.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37: // LEFT
      moveLine(-1);
      break;
    case 39: // RIGHT
      moveLine(1);
      break;
    default:
      break;
  }
}

function mirrorBeginHover() {
  this.attr({"stroke-width": 4})
}

function mirrorEndHover() {
  this.attr({"stroke-width": 1})
}

function mirrorOnClick() {
  var point = new Vector(character.attr("cx"), character.attr("cy"));
  var lineStart = new Vector(this.attr("x1"), this.attr("y1"));
  var lineEnd = new Vector(this.attr("x2"), this.attr("y2"));
  var line = Vector.diff(lineEnd, lineStart);
  var distAlongLine = Vector.dot(
    Vector.diff(point, lineStart), line.normalized);
  if (distAlongLine < 0 || distAlongLine > line.magnitude) return;
  var mirrorPoint = line.normalized;
  mirrorPoint.scale(distAlongLine);
  mirrorPoint.add(lineStart);
  mirrorPoint.sub(point);
  mirrorPoint.scale(2);
  mirrorPoint.add(point);
  character.attr({cx: mirrorPoint.x, cy: mirrorPoint.y});
}

/*
GAME
*/

function create() {
  rect = s.node.getBoundingClientRect();

  track = s.line(25, 150, 150, 150).attr({stroke:"black"});
  dAlongTrack = 75;

  mirror = s.line(200, 50, 200, 250).attr({stroke:"green"});
  mirror.hover(mirrorBeginHover, mirrorEndHover);
  mirror.click(mirrorOnClick);

  goal = s.rect(375, 143, 14, 14).attr({fill:"red", stroke:"black"});
  character = s.circle(100, 150, 7).attr({fill:"blue", stroke:"black"});
}

function step() {
  rect = s.node.getBoundingClientRect();
  // do stuff
}

function main() {
  create();
  //var interval = setInterval(step, 1000 / fps);
}

main();