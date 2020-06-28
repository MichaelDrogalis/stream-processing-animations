anime({
  targets: ".event",
  easing: "linear",
  duration: 4000,
  delay: anime.stagger(1000),
  keyframes: [
    {
      translateX: (function (el, i, n) {
        return 240 + (i * 40);
      })
    },
    {
      translateY: 120,
      opacity: [1, 0]
    }
  ],
  loop: true
});
