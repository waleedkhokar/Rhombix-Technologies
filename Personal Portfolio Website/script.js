// ============================================
// WALEED KHOKHAR — PORTFOLIO
// script.js
// Features: Custom Cursor, Navbar Scroll,
//           Reveal on Scroll, Mobile Menu,
//           Contact Form Validation
// ============================================


// ============================================
// 1. CUSTOM CURSOR
// ============================================
const cursor   = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Cursor dot snaps instantly
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Follower lags behind smoothly
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;

  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';

  requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on hoverable elements
document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform   = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.opacity   = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform   = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.opacity   = '0.6';
  });
});


// ============================================
// 2. NAVBAR — SHRINK ON SCROLL + ACTIVE LINK
// ============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Shrink navbar
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  highlightActiveLink();
});

function highlightActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let currentId = '';

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + currentId) {
      link.style.color = '#ff6b35';
    }
  });
}


// ============================================
// 3. MOBILE HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');

  if (navLinks.classList.contains('open')) {
    // Animate to X
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    // Reset
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});


// ============================================
// 4. SCROLL REVEAL ANIMATION
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger child cards if present
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
      revealObserver.unobserve(entry.target); // only animate once
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ============================================
// 5. STAGGER CARDS INSIDE SECTIONS
// ============================================
const cardGroups = document.querySelectorAll(
  '.skills-grid, .projects-grid, .achievements-grid'
);

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll(
        '.skill-card, .project-card, .achievement-card'
      );
      cards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;

        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        }, 50 + i * 80);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cardGroups.forEach(group => cardObserver.observe(group));


// ============================================
// 6. CONTACT FORM — VALIDATION & FEEDBACK
// ============================================
const sendBtn    = document.getElementById('sendBtn');
const feedback   = document.getElementById('form-feedback');

sendBtn.addEventListener('click', () => {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  // Simple validation
  if (!name) {
    showFeedback('⚠️ Please enter your name.', 'error');
    return;
  }
  if (!email || !isValidEmail(email)) {
    showFeedback('⚠️ Please enter a valid email.', 'error');
    return;
  }
  if (!message) {
    showFeedback('⚠️ Please enter a message.', 'error');
    return;
  }

  // Success feedback — open WhatsApp or email
  const waMessage = encodeURIComponent(
    `Hi Waleed! I'm ${name} (${email}).\n\n${message}`
  );
  window.open(`https://wa.me/923191402404?text=${waMessage}`, '_blank');

  showFeedback('✅ Message sent via WhatsApp!', 'success');

  // Clear form
  document.getElementById('fname').value  = '';
  document.getElementById('femail').value = '';
  document.getElementById('fmsg').value   = '';
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFeedback(msg, type) {
  feedback.textContent   = msg;
  feedback.style.color   = type === 'success' ? '#4ade80' : '#ff6b35';
  setTimeout(() => { feedback.textContent = ''; }, 4000);
}


// ============================================
// 7. SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ============================================
// 8. TYPING EFFECT — HERO TITLE
// ============================================
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const original = heroTitle.innerHTML;

  // Animate the title on load
  heroTitle.style.opacity = '0';
  heroTitle.style.transform = 'translateY(20px)';
  heroTitle.style.transition = 'opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s';

  window.addEventListener('load', () => {
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
  });
}


// ============================================
// 9. HERO ENTRANCE ANIMATIONS
// ============================================
window.addEventListener('load', () => {
  const heroEls = [
    '.hero-tag',
    '.hero-name .line:first-child',
    '.hero-name .line.accent',
    '.hero-title',
    '.hero-sub',
    '.hero-btns',
    '.hero-stats',
    '.hero-img-wrap'
  ];

  heroEls.forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (!el) return;

    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${0.1 + i * 0.1}s, transform 0.6s ease ${0.1 + i * 0.1}s`;

    // Trigger reflow then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
});