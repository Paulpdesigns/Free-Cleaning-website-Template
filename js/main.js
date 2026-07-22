document.addEventListener('DOMContentLoaded', function () {

  /* Nav scroll state */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Animated stat counters */
  var counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* Before / after compare sliders */
  document.querySelectorAll('.compare').forEach(function (compare) {
    var afterWrap = compare.querySelector('.after-wrap');
    var divider = compare.querySelector('.divider');
    var handle = compare.querySelector('.handle');
    var range = compare.querySelector('input[type=range]');

    function setPos(val) {
      afterWrap.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
      divider.style.left = val + '%';
      handle.style.left = val + '%';
    }
    setPos(range ? range.value : 50);

    if (range) {
      range.addEventListener('input', function (e) { setPos(e.target.value); });
    }
  });

  /* Quote calculator */
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    var typeSelect = document.getElementById('q-type');
    var sqftInput = document.getElementById('q-sqft');
    var roomsInput = document.getElementById('q-rooms');
    var freqSelect = document.getElementById('q-freq');
    var addonInputs = quoteForm.querySelectorAll('.q-addon');
    var priceEl = document.getElementById('q-price');
    var noteEl = document.getElementById('q-note');
    var badgeEl = document.getElementById('q-savings');
    var bItems = {
      base: document.getElementById('b-base'),
      rooms: document.getElementById('b-rooms'),
      addons: document.getElementById('b-addons'),
      discount: document.getElementById('b-discount')
    };

    var rates = {
      standard: { perHundredSqft: 18, label: 'standard home clean' },
      deep:     { perHundredSqft: 27, label: 'deep clean' },
      moveout:  { perHundredSqft: 31, label: 'move in / move out clean' },
      office:   { perHundredSqft: 15, label: 'office / commercial clean' }
    };
    var freqMultiplier = { once: 1, weekly: 0.78, biweekly: 0.85, monthly: 0.92 };
    var freqLabel = { once: 'one time visit', weekly: 'weekly plan', biweekly: 'biweekly plan', monthly: 'monthly plan' };
    var addonCost = { windows: 25, appliances: 20, eco: 10, pet: 15 };

    var displayedPrice = 0;

    function animatePrice(target) {
      var start = displayedPrice;
      var duration = 420;
      var startTime = performance.now();
      function step(now) {
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 2);
        var value = Math.round(start + (target - start) * eased);
        priceEl.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else displayedPrice = target;
      }
      requestAnimationFrame(step);
    }

    function recalc() {
      var type = rates[typeSelect.value];
      var sqft = Math.max(parseFloat(sqftInput.value) || 0, 0);
      var rooms = Math.max(parseFloat(roomsInput.value) || 0, 0);
      var freq = freqSelect.value;

      var base = (sqft / 100) * type.perHundredSqft;
      var roomFee = rooms * 12;

      var addonsTotal = 0;
      addonInputs.forEach(function (input) {
        var wrap = input.closest('.addon-toggle');
        if (input.checked) {
          addonsTotal += addonCost[input.value];
          wrap.classList.add('checked');
        } else {
          wrap.classList.remove('checked');
        }
      });

      var subtotal = base + roomFee + addonsTotal;
      var discount = subtotal * (1 - freqMultiplier[freq]);
      var total = Math.max(Math.round((subtotal - discount) / 5) * 5, 45);

      animatePrice(total);
      noteEl.textContent = 'Estimated starting price for a ' + type.label + ', ' + freqLabel[freq] + ', around ' + (sqft || 0) + ' sq ft. Final pricing confirmed after a quick walkthrough.';

      bItems.base.querySelector('span').textContent = '$' + Math.round(base);
      bItems.rooms.querySelector('span').textContent = '$' + Math.round(roomFee);
      bItems.addons.querySelector('span').textContent = '$' + Math.round(addonsTotal);
      bItems.discount.querySelector('span').textContent = discount > 0 ? ('$' + Math.round(discount) + ' saved') : '$0';

      if (freq !== 'once') {
        badgeEl.textContent = 'Saving ' + Math.round((1 - freqMultiplier[freq]) * 100) + '% on recurring visits';
        badgeEl.classList.add('show');
      } else {
        badgeEl.classList.remove('show');
      }
    }

    quoteForm.addEventListener('input', recalc);
    recalc();
  }

  /* Contact form (static demo) */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      status.textContent = 'Thanks - this is a template, so wire this form up to Formspree, a mailto, or your CRM before launch.';
    });
  }

  /* Portfolio filter */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var caseItems = document.querySelectorAll('.case-item');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      caseItems.forEach(function (item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* Smooth-scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
