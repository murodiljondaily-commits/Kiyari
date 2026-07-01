(() => {
  if (!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger?.classList?.contains('hero-scroll')) trigger.kill(true);
  });
  gsap.killTweensOf('.hero-master,.hero-light-sweep,.hero-copy,.hero-copy>*,.corner-bloom');
  const ambient = document.querySelector('#ambientWorld');
  const stage = document.querySelector('.simple-cinematic');
  if (ambient && stage) stage.append(ambient);
  gsap.set('.hero-copy', { y: 0 });
  gsap.set('.hero-copy>*', { opacity: 0, y: 42 });
  gsap.set('.hero-master', { scale: 1.1, opacity: .46, filter: 'blur(7px) saturate(.9)' });
  gsap.set('.ambient-world,.particles', { opacity: 0 });
  const timeline = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: '.hero-scroll', start: 'top top', end: 'bottom bottom', scrub: 1.15, invalidateOnRefresh: true }
  });
  timeline
    .to('.hero-master', { scale: 1.045, opacity: 1, filter: 'blur(0px) saturate(1.06)', duration: 1.25 }, 0)
    .to('.hero-light-sweep', { xPercent: 145, duration: 1.7, ease: 'power1.inOut' }, .1)
    .fromTo('.corner-bloom', { opacity: 0, scale: .75 }, { opacity: .82, scale: 1, stagger: .12, duration: 1 }, .35)
    .to('.ambient-world,.particles', { opacity: 1, duration: 1.4, ease: 'power2.out' }, .55)
    .to('.hero-copy>*', { opacity: 1, y: 0, stagger: .2, duration: 1.35, ease: 'power3.out' }, .55)
    .to('.hero-master', { scale: 1, xPercent: -1.2, yPercent: -.7, duration: 3.4, ease: 'none' }, 1.2)
    .to('.hero-copy', { y: -8, duration: 3, ease: 'none' }, 1.8)
    .to({}, { duration: 1.8 });
})();
