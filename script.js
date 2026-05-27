/* ═══════════════════════════════════════════════════════════
   MEG WORLD UNIVERSE — Premium JS
   GSAP + Lenis + Custom Globe + Scroll Animations
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────── LENIS ─────── */
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch (e) {
    console.warn('Lenis not loaded', e);
  }

  /* ──────────────────────────────────────────── GSAP ─────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ──────────────────────────────────────────── CURSOR ────── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;
  let hasMoved = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!hasMoved) { cx = mx; cy = my; hasMoved = true; }
    if (cursorDot) {
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    }
  });

  function lerpCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    if (cursor) {
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    }
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
    if (cursorDot) cursorDot.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorDot) cursorDot.style.opacity = '0';
  });

  /* ──────────────────────────────────────────── NAVBAR ────── */
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (navBurger && navMobile) {
    navBurger.addEventListener('click', () => {
      navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMobile.classList.remove('open'));
    });
  }

  /* ──────────────────────────────────────────── GLOBE ─────── */
  const canvas = document.getElementById('globeCanvas');
  if (canvas) {
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.closest('.globe-wrap')
      ? canvas.closest('.globe-wrap').offsetWidth
      : 420;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const R = size / 2;
    let phi = 0; // rotation angle

    // Generate lat/lng dots for continents (approximate)
    const dots = [];
    const LAND = [
      // Europe
      ...genRegion(35, 70, -10, 40, 180),
      // North America
      ...genRegion(25, 70, -130, -60, 220),
      // South America
      ...genRegion(-55, 12, -80, -35, 150),
      // Africa
      ...genRegion(-35, 37, -20, 52, 200),
      // Asia
      ...genRegion(5, 75, 40, 145, 350),
      // Oceania
      ...genRegion(-45, -10, 112, 155, 100),
    ];
    dots.push(...LAND);

    function genRegion(latMin, latMax, lngMin, lngMax, count) {
      const pts = [];
      for (let i = 0; i < count; i++) {
        pts.push({
          lat: latMin + Math.random() * (latMax - latMin),
          lng: lngMin + Math.random() * (lngMax - lngMin),
        });
      }
      return pts;
    }

    function project(lat, lng, rot) {
      const latR = lat * Math.PI / 180;
      const lngR = (lng + rot) * Math.PI / 180;
      const x = R * Math.cos(latR) * Math.sin(lngR);
      const y = R * Math.sin(latR);
      const z = R * Math.cos(latR) * Math.cos(lngR);
      return { x: R + x, y: R - y, z };
    }

    // Particles orbiting globe
    const orbitParticles = Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.003,
      radius: R * (0.85 + Math.random() * 0.35),
      tilt:   (Math.random() - 0.5) * 1.4,
      size:   1.5 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.6,
    }));

    function drawGlobe(t) {
      ctx.clearRect(0, 0, size, size);

      // Globe base sphere gradient
      const grad = ctx.createRadialGradient(R * 0.7, R * 0.4, 0, R, R, R);
      grad.addColorStop(
0,
'rgba(255,255,255,.10)'
);

grad.addColorStop(
0.45,
'rgba(0,190,255,.14)'
);

grad.addColorStop(
1,
'rgba(0,25,80,.92)'
);
      ctx.beginPath();
      ctx.arc(R, R, R - 2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
ctx.globalCompositeOperation='screen';

for(let i=0;i<90;i++){

ctx.beginPath();

ctx.arc(

Math.random()*size,

Math.random()*size,

Math.random()*2,

0,

Math.PI*2

);

ctx.fillStyle=
'rgba(80,220,255,.12)';

ctx.fill();

}

ctx.globalCompositeOperation='source-over';
      // Sphere edge glow
      const edgeGrad = ctx.createRadialGradient(R, R, R * 0.6, R, R, R);
      edgeGrad.addColorStop(0, 'rgba(74,144,217,0)');
      edgeGrad.addColorStop(0.75, 'rgba(74,144,217,0)');
      edgeGrad.addColorStop(
1,
'rgba(0,180,255,.95)'
);
      ctx.beginPath();
      ctx.arc(R, R, R - 2, 0, Math.PI * 2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();

      // Clip to sphere for dots
      ctx.save();
      ctx.beginPath();
      ctx.arc(R, R, R - 3, 0, Math.PI * 2);
      ctx.clip();

      const rot = phi * 180 / Math.PI;

      // Latitude grid lines
      ctx.strokeStyle = 'rgba(25,50,112,0.08)';
      ctx.lineWidth = 0.7;
      for (let latLine = -60; latLine <= 60; latLine += 30) {
        const pts = [];
        for (let l = -180; l <= 180; l += 4) {
          const p = project(latLine, l, rot);
          if (p.z > 0) pts.push({ x: p.x, y: p.y, start: pts.length === 0 });
        }
        if (pts.length > 1) {
          ctx.beginPath();
          pts.forEach(pt => pt.start ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
        }
      }

      // Longitude grid lines
      for (let lngLine = 0; lngLine < 180; lngLine += 30) {
        const pts = [];
        for (let l = -90; l <= 90; l += 4) {
          const p = project(l, lngLine, rot);
          if (p.z > 0) pts.push({ x: p.x, y: p.y, start: pts.length === 0 });
        }
        if (pts.length > 1) {
          ctx.beginPath();
          pts.forEach(pt => pt.start ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
        }
      }

      // Land dots
      dots.forEach(dot => {
        const p = project(dot.lat, dot.lng, rot);
        if (p.z > 0) {
          const brightness = 0.3 + (p.z / R) * 0.7;
          const dotSize =1.2 + (p.z/R)*2.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle =`rgba(80,220,255,${brightness})`;
          ctx.fill();
        }
      });

      // Highlight specular
      const spec = ctx.createRadialGradient(R * 0.55, R * 0.35, 0, R * 0.55, R * 0.35, R * 0.55);
      spec.addColorStop(0, 'rgba(255,255,255,0.55)');
      spec.addColorStop(0.5, 'rgba(255,255,255,0.1)');
      spec.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(R, R, R - 3, 0, Math.PI * 2);
      ctx.fillStyle = spec;
      ctx.fill();

      ctx.restore();

      // Orbit particles
      orbitParticles.forEach(op => {
        op.angle += op.speed;
        const ox = R + Math.cos(op.angle) * op.radius;
        const oy = R + Math.sin(op.angle) * op.radius * 0.38 + Math.sin(op.tilt) * op.radius * 0.2;
        const inFront = Math.cos(op.angle) > -0.1;
        if (inFront) {
          ctx.beginPath();
          ctx.arc(ox, oy, op.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74,144,217,${op.opacity})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ox, oy, op.size + 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74,144,217,${op.opacity * 0.2})`;
          ctx.fill();
        }
      });

      // Light trail arcs
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const trailGrad = ctx.createLinearGradient(R * 0.2, R * 0.2, R * 1.8, R * 1.8);
      trailGrad.addColorStop(0, 'rgba(74,144,217,0)');
      trailGrad.addColorStop(0.5, 'rgba(74,144,217,0.12)');
      trailGrad.addColorStop(1, 'rgba(74,144,217,0)');
      ctx.beginPath();
      ctx.ellipse(R, R, R * 0.65, R * 0.28, Math.PI / 4 + t * 0.0002, 0, Math.PI * 2);
      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      phi += 0.004;
    }

    let animFrame;
    function animate(t) {
      drawGlobe(t);
      animFrame = requestAnimationFrame(animate);
    }
    animate(0);

    // Spawn floating particles around globe
    const particlesWrap = document.getElementById('globeParticles');
    if (particlesWrap) {
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const angle = (i / 8) * 360;
        const dist  = 50 + Math.random() * 40;
        const x = Math.cos(angle * Math.PI / 180) * dist;
        const y = Math.sin(angle * Math.PI / 180) * dist;
        p.style.cssText = `
          left: calc(50% + ${x}px);
          top: calc(50% + ${y}px);
          width: ${2 + Math.random() * 3}px;
          height: ${2 + Math.random() * 3}px;
          animation: globeFloat ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite;
          opacity: ${0.4 + Math.random() * 0.5};
        `;
        particlesWrap.appendChild(p);
      }
    }
  }

  /* ──────────────────────────────────── SCROLL ANIMATIONS ─── */
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initScrollAnimations, 200);
  });
  // Also try immediately in case DOM is already ready
  if (document.readyState !== 'loading') {
    setTimeout(initScrollAnimations, 200);
  }

  function initScrollAnimations() {
    /* — Ecosystem Cards — */
    const ecoCards = document.querySelectorAll('.eco-card');
    const ecoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay * 80);
          ecoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    ecoCards.forEach(card => ecoObserver.observe(card));

    /* — About section — */
    const aboutVisual  = document.getElementById('aboutVisual');
    const aboutContent = document.getElementById('aboutContent');
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    if (aboutVisual)  aboutObserver.observe(aboutVisual);
    if (aboutContent) aboutObserver.observe(aboutContent);

    /* — Why Cards — */
    const whyCards = document.querySelectorAll('.why-card');
    const whyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay * 100);
          whyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    whyCards.forEach(card => whyObserver.observe(card));

    /* — GSAP Advanced Animations — */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      // Section titles reveal
      document.querySelectorAll('.section-title').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 1, ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            }
          }
        );
      });

      // Section subs
      document.querySelectorAll('.section-sub').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'expo.out', delay: 0.15,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            }
          }
        );
      });

      // Ecosystem title
      const ecoTitle = document.getElementById('ecoTitle');
      if (ecoTitle) {
        gsap.fromTo(ecoTitle,
          { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
            duration: 1.2, ease: 'expo.out',
            scrollTrigger: {
              trigger: ecoTitle,
              start: 'top 80%',
              once: true,
            }
          }
        );
      }

      // Contact card reveal
      const contactCard = document.querySelector('.contact-card');
      if (contactCard) {
        gsap.fromTo(contactCard,
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1, ease: 'expo.out',
            scrollTrigger: {
              trigger: contactCard,
              start: 'top 80%',
              once: true,
            }
          }
        );
      }

      // Footer brand
      const footerBrand = document.querySelector('.footer-brand');
      if (footerBrand) {
        gsap.fromTo(footerBrand,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'expo.out',
            scrollTrigger: {
              trigger: footerBrand,
              start: 'top 90%',
              once: true,
            }
          }
        );
      }
    }
  }

  /* ──────────────────────────────────── SMOOTH ANCHOR ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────── CARD 3D TILT ──────── */
  function initTilt() {
    document.querySelectorAll('.eco-card, .why-card, .stat-item').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  // Init tilt after cards become visible
  setTimeout(initTilt, 1500);

  /* ──────────────────────────────────── NAV ACTIVE ────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--primary)';
      }
    });
  }, { passive: true });

  /* ──────────────────────────────────── COUNTER ANIM ─────── */
  function animateCounter(el, end, duration, suffix) {
    const start = Date.now();
    const from = 0;
    function step() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (end - from) * eased) + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    step();
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat2 = document.getElementById('stat2');
        const stat3 = document.getElementById('stat3');
        if (stat2) { stat2.textContent = '0+'; animateCounter(stat2, 50, 1500, '+'); }
        if (stat3) { stat3.textContent = '0+'; animateCounter(stat3, 10, 1200, '+'); }
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) statsObserver.observe(statsGrid);

  /* ──────────────────────────────────── PRELOAD POLISH ────── */
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

})();



/* ==========================
   STATS COUNTER
========================== */

const statObserver = new IntersectionObserver((entries)=>{

entries.forEach((entry)=>{

if(!entry.isIntersecting) return;

const stats =
entry.target.querySelectorAll(".stat-box h3");

stats.forEach((stat)=>{

const text =
stat.innerText;

const hasPlus =
text.includes("+");

const target =
parseInt(
text.replace("+","")
);

let current = 0;

const duration = 1800;

const step =
target / (duration / 16);

const update = ()=>{

current += step;

if(current >= target){

stat.innerHTML =
target +
(hasPlus ? "+" : "");

return;

}

stat.innerHTML =
Math.floor(current) +
(hasPlus ? "+" : "");

requestAnimationFrame(update);

};

update();

});

statObserver.unobserve(entry.target);

});

},{
threshold:.4
});

const statsSection =
document.querySelector(".hero-stats");

if(statsSection){

statObserver.observe(statsSection);

}


window.addEventListener("scroll", () => {
document
.querySelector(".navbar")
.classList.toggle(
"scrolled",
window.scrollY > 30
);
});
