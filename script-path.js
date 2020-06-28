var path = anime.path('path');

var easings = ['linear', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic'];

var motionPath = anime({
  targets: '.square',
  translateX: path('x'),
  translateY: path('y'),
  rotate: path('angle'),
  easing: function (el, i) {
    return easings[i];
  },
  duration: 10000,
  loop: true
});
