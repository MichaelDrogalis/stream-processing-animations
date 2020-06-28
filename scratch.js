function relative_add(x) {
  return "+=" + x;
}

var duration = 4000;
var box_start = 400;
var box_distance = 200;
var event_width = 25;

function closest_to_box() {
  result = [];

  $(".filtering > .events > .event").each(function() {
    value = parseFloat($(this).attr("x"));
    result.push(value);
  });

  return box_start - Math.max.apply(Math, result) - event_width;
}

function furthest_from_box() {
  result = [];

  $(".filtering > .events > .event").each(function() {
    value = parseFloat($(this).attr("x"));
    result.push(value);
  });

  return box_start - Math.min.apply(Math, result) - event_width;
}

var closest_d = closest_to_box();
var furthest_d = furthest_from_box();


function build_keep_animation(selector) {
  start = box_start - (parseFloat($(selector).attr("x")) + event_width);
  end = (furthest_d - start) + closest_d;
  total_distance = start + end + box_distance;
  
  return {
    targets: selector,
    easing: "linear",
    keyframes: [
      {
        duration: ((start / total_distance) * duration),
        translateX: start
      },
      {
        duration: ((box_distance / total_distance) * duration),
        translateX: relative_add(box_distance)
      },
      {
        duration: ((end / total_distance) * duration),
        translateX: relative_add(end)
      }
    ]
  };
}

function build_discard_animation(selector) {
  start = box_start - (parseFloat($(selector).attr("x")) + event_width);
  
  return {
    targets: selector,
    easing: "linear",
    keyframes: [
      {
        duration: ((start / 650) * duration),
        translateX: start
      },
      {
        duration: 700,
        translateX: relative_add((box_distance / 2) + (event_width / 2))
      },
      {
        duration: 700,
        translateY: 120,
        opacity: [1, 0]
      }
    ]
  };
}



function build_animation(selector) {

  if ($(selector).hasClass("keep")) {
    return build_keep_animation(selector);
  } else {
    return build_discard_animation(selector);
  }
}



var controlsProgressEl = $(".controls > .progress");

var timeline = anime.timeline({
  loop: true,
  update: function(anim) {
    controlsProgressEl.val(timeline.progress);
  }
});

timeline.add(build_animation(".filtering > .events > .event.e-1"));
timeline.add(build_animation(".filtering > .events > .event.e-2"), 1000);
timeline.add(build_animation(".filtering > .events > .event.e-3"), 2000);
timeline.add(build_animation(".filtering > .events > .event.e-4"), 3000);
timeline.add(build_animation(".filtering > .events > .event.e-5"), 4000);
timeline.add(build_animation(".filtering > .events > .event.e-6"), 5000);

$(".controls > .play").click(timeline.play);
$(".controls > .pause").click(timeline.pause);
$(".controls > .restart").click(timeline.restart);

controlsProgressEl.on('input', function() {
  timeline.seek(timeline.duration * (controlsProgressEl.val() / 100));
});
