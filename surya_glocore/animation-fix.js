/*!
 * animation-fix.js
 * Fallback entrance animations for the saved (offline) GloCore copy.
 * Safe to load even when Elementor / GSAP already work (everything is idempotent).
 * Add before </body>: <script src="animation-fix.js"></script>
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function observe(elements, onVisible, options) {
    if (!elements || !elements.length) { return; }
    if (typeof IntersectionObserver !== 'function' || reduceMotion) {
      elements.forEach(function (el) { onVisible(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          onVisible(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, options || { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    elements.forEach(function (el) { io.observe(el); });
  }

  /* 1) Elementor entrance animations (fadeInUp / fadeInLeft / fadeInRight ...) */
  function elementorEntrance() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.elementor-invisible'));
    observe(els, function (el) {
      var settings = {};
      try { settings = JSON.parse(el.getAttribute('data-settings') || '{}'); } catch (e) {}
      var name = settings._animation || settings.animation || '';
      var delay = parseInt(settings._animation_delay || settings.animation_delay || 0, 10) || 0;
      setTimeout(function () {
        el.classList.remove('elementor-invisible');
        if (name && name !== 'none') {
          el.classList.add('animated', name);
        }
      }, delay);
    });
  }

  /* 2) GloCore / MT "Solaris" entrance animation roots */
  function solarisEntrance() {
    var roots = Array.prototype.slice.call(document.querySelectorAll(
      '.mtfe-solaris-anim-root:not(.mtfe-solaris-anim-root--anim-none):not(.mtfe-solaris-anim-root--in-view)'
    ));
    observe(roots, function (el) { el.classList.add('mtfe-solaris-anim-root--in-view'); });
  }

  /* 3) MT About Us reveal elements (.reveal, .reveal-badge) */
  function aboutUsReveal() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll(
      '.mtfe-about-us:not(.mtfe-about-us--no-anim) .reveal:not(.in-view), .mtfe-about-us:not(.mtfe-about-us--no-anim) .reveal-badge:not(.in-view)'
    ));
    observe(reveals, function (el) { el.classList.add('in-view'); });
  }

  /* 4) Hide empty bullet points (blank <li> left over from the old site content) */
  function hideEmptyBullets() {
    var items = document.querySelectorAll('.elementor li, main li, .entry-content li, #content li, .spes-page li, .spes-list li');
    Array.prototype.forEach.call(items, function (li) {
      var text = (li.textContent || '').replace(/[\s\u00a0]+/g, '');
      if (!text && !li.querySelector('img, svg, i, a, iframe, video, input, button')) {
        li.style.display = 'none';
      }
    });
  }

  /* 5) Safety net: never leave content hidden if something above failed */
  function safetyNet() {
    setTimeout(function () {
      var stuck = document.querySelectorAll('.elementor-invisible');
      if (!stuck.length) { return; }
      var rect;
      Array.prototype.forEach.call(stuck, function (el) {
        rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.remove('elementor-invisible');
        }
      });
    }, 4000);
  }

  ready(function () {
    elementorEntrance();
    solarisEntrance();
    aboutUsReveal();
    hideEmptyBullets();
    safetyNet();
  });

  /* Helpful console hint when GSAP is missing */
  window.addEventListener('load', function () {
    if (typeof window.gsap === 'undefined') {
      console.warn('[animation-fix] GSAP not loaded - check the gsap script path.');
    }
  });
})();
