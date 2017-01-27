var s = Snap("#svg");
var fps = 60;
var rect;

function create() {
  rect = s.node.getBoundingClientRect();
  var bigCircle = s.circle(150, 150, 100);
  // do stuff
}

function step() {
  rect = s.node.getBoundingClientRect();
  // do stuff
}

function main() {
  create();
  var interval = setInterval(step, 1000 / fps);
}

main();