function animate(selector) {
  var boxes = {
    targets: selector,
    translateX: 700,
    loop: true,
    duration: 4000,
    easing: 'linear',
    keyframes: [
      {opacity: 0},
      {opacity: 1},
      {opacity: 1},
      {opacity: 1},
      {opacity: 1},
      {opacity: 1},
      {opacity: 0}
    ]
  };

  var timeline = anime.timeline({loop: true});
  timeline.add(boxes, 0);
}


setTimeout(function() { animate('.box.red.i-3'); }, 0);
setTimeout(function() { animate('.box.blue.i-6'); }, 600);
setTimeout(function() { animate('.box.red.i-1'); }, 825);
setTimeout(function() { animate('.box.blue.i-5'); }, 1200);
setTimeout(function() { animate('.box.red.i-4'); }, 1400);
setTimeout(function() { animate('.box.blue.i-4'); }, 1700);
setTimeout(function() { animate('.box.red.i-5'); }, 2400);
setTimeout(function() { animate('.box.blue.i-1'); }, 2900);
setTimeout(function() { animate('.box.red.i-6'); }, 3200);
setTimeout(function() { animate('.box.blue.i-3'); }, 3800);
setTimeout(function() { animate('.box.blue.i-2'); }, 4200);
setTimeout(function() { animate('.box.red.i-2'); }, 4400);
