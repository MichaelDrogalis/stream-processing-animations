function relative_add(x) {
  return "+=" + x;
}

var ms_px = 6.153846153846154;
var box_start = 400;
var box_distance = 200;
var event_width = 25;
var event_spacing = 40;

function min_distance_to_box() {
  result = [];

  $(".filtering > .events > .event").each(function() {
    value = parseFloat($(this).attr("x"));
    result.push(value);
  });

  return box_start - Math.max.apply(Math, result) - event_width;
}

function max_distance_to_box() {
  result = [];

  $(".filtering > .events > .event").each(function() {
    value = parseFloat($(this).attr("x"));
    result.push(value);
  });

  return box_start - Math.min.apply(Math, result) - event_width;
}

var min_d = min_distance_to_box();
var max_d = max_distance_to_box();

function build_keep_animation(selector, id) {
  start_idx = $(".filtering > .events > .event" + id).index();
  end_idx = $(".filtering > .events > .event").filter(".keep").index($(id));
  start = min_d + (event_spacing * start_idx);
  end = max_d - (event_spacing * end_idx);
  
  return {
    targets: selector,
    easing: "linear",
    keyframes: [
      {
        duration: start * ms_px,
        translateX: start
      },
      {
        duration: box_distance * ms_px,
        translateX: relative_add(box_distance)
      },
      {
        duration: end * ms_px,
        translateX: relative_add(end)
      }
    ]
  };
}

function build_discard_animation(selector) {
  idx = $(selector).index();
  start = min_d + (event_spacing * idx);
  box_dist = (box_distance / 2) + (event_width / 2);
  end = 100;
  
  return {
    targets: selector,
    easing: "linear",
    keyframes: [
      {
        duration: start *  ms_px,
        translateX: start
      },
      {
        duration: box_dist * ms_px,
        translateX: relative_add(box_dist)
      },
      {
        duration: end * ms_px,
        translateY: relative_add(end),
        opacity: [1, 0]
      }
    ]
  };
}

function build_animation(selector, id) {
  if ($(selector).hasClass("keep")) {
    return build_keep_animation(selector, id);
  } else {
    return build_discard_animation(selector);
  }
}

var controlsProgressEl = $(".controls.filtering > .progress");

var timeline = anime.timeline({
  loop: true,
  update: function(anim) {
    controlsProgressEl.val(timeline.progress);
  }
});

timeline.add(build_animation(".filtering > .events > .event.e-1", ".e-1"));
timeline.add(build_animation(".filtering > .events > .event.e-2", ".e-2"), 1000);
timeline.add(build_animation(".filtering > .events > .event.e-3", ".e-3"), 2000);
timeline.add(build_animation(".filtering > .events > .event.e-4", ".e-4"), 3000);
timeline.add(build_animation(".filtering > .events > .event.e-5", ".e-5"), 4000);
timeline.add(build_animation(".filtering > .events > .event.e-6", ".e-6"), 5000);

$(".controls.filtering > .play").click(timeline.play);
$(".controls.filtering > .pause").click(timeline.pause);
$(".controls.filtering > .restart").click(timeline.restart);

controlsProgressEl.on('input', function() {
  timeline.seek(timeline.duration * (controlsProgressEl.val() / 100));
});
