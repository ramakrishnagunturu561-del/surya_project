/**
 * MT Portfolio - Gallery Lightbox
 *
 * @package ModelTheme Framework
 */
(function () {
    'use strict';

    var overlay = document.getElementById('mt-lightbox');
    if (!overlay) return;

    var img       = document.getElementById('mt-lightbox-img');
    var btnClose  = overlay.querySelector('.mt-lightbox-close');
    var btnPrev   = overlay.querySelector('.mt-lightbox-prev');
    var btnNext   = overlay.querySelector('.mt-lightbox-next');
    var triggers  = document.querySelectorAll('.mt-lightbox-trigger');
    var images    = [];
    var current   = 0;

    // Collect all gallery image URLs
    triggers.forEach(function (el, index) {
        images.push(el.getAttribute('href'));
        el.addEventListener('click', function (e) {
            e.preventDefault();
            current = index;
            openLightbox();
        });
    });

    function openLightbox() {
        img.src = images[current];
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        img.src = '';
    }

    function showPrev() {
        current = (current - 1 + images.length) % images.length;
        img.src = images[current];
    }

    function showNext() {
        current = (current + 1) % images.length;
        img.src = images[current];
    }

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', showPrev);
    btnNext.addEventListener('click', showNext);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target === overlay.querySelector('.mt-lightbox-content')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
})();
