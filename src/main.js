/**
 * Baymax Automations — Main Entry
 * SPA Router + Global Init
 */
import './style.css';
import { gsap } from 'gsap';
import blinker from './eyes.js';

import { renderHome, initHomeAnimations } from './pages/home.js';
import { renderWhatWeDo, initWhatWeDoAnimations } from './pages/what-we-do.js';
import { renderPricing, initPricingInteractions } from './pages/pricing.js';
import { renderContact, initContactPage } from './pages/contact.js';
import { renderLogin, initLoginPage } from './pages/login.js';

// ── DOM References ──
const app = document.getElementById('app');
const logoStrip = document.getElementById('logo-strip');
const footer = document.getElementById('site-footer');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('[data-page]');

// ── Routes ──
const routes = {
  home: { render: renderHome, init: initHomeAnimations },
  'what-we-do': { render: renderWhatWeDo, init: initWhatWeDoAnimations },
  pricing: { render: renderPricing, init: initPricingInteractions },
  contact: { render: renderContact, init: initContactPage },
  login: { render: renderLogin, init: initLoginPage },
};

// ── Router ──
function getPage() {
  const hash = window.location.hash.replace('#', '') || 'home';
  return routes[hash] ? hash : 'home';
}

const seoData = {
  home: {
    title: "Baymax Automations — What You Think Is What We Make",
    description: "AI-powered system automations for communication, data, and workflow orchestration. What you think is what we make.",
  },
  'what-we-do': {
    title: "What We Do | Baymax Automations",
    description: "We build intelligent automation systems connecting communication channels and automating data workflows natively with AI.",
  },
  pricing: {
    title: "Pricing | Baymax Automations",
    description: "Transparent and scalable pricing for AI automation systems. Choose the plan that fits your business needs.",
  },
  contact: {
    title: "Contact Us | Baymax Automations",
    description: "Get in touch with Baymax Automations. Let's talk about how we can automate your business workflows.",
  },
  login: {
    title: "Client Login | Baymax Automations",
    description: "Sign in to your Baymax Automations client dashboard.",
  },
};

function updateSEO(page) {
  const data = seoData[page] || seoData.home;
  document.title = data.title;

  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.setAttribute('content', data.description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', data.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', data.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', window.location.origin + window.location.pathname + '#' + page);
}

function navigate() {
  const page = getPage();
  const route = routes[page];

  // Update active nav link
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Determine what to show/hide
  const isLogin = page === 'login';
  const isDarkPage = page === 'home' || page === 'login';

  logoStrip.style.display = isLogin ? 'none' : 'flex';
  footer.style.display = isLogin ? 'none' : '';

  // Update SEO Meta Tags
  updateSEO(page);

  // Render page
  app.innerHTML = route.render();

  // Scroll to top
  window.scrollTo(0, 0);

  // Init page-specific JS
  requestAnimationFrame(() => {
    route.init();
  });
}

// ── Hamburger Menu ──
function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

// ── Eye Blink Loop ──
function startBlinkLoop() {
  const delay = gsap.utils.random(3, 10);
  gsap.delayedCall(delay, () => {
    blinker();
    startBlinkLoop();
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  navigate();
  startBlinkLoop();

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
});

window.addEventListener('hashchange', () => {
  closeMobileMenu();
  navigate();
});
