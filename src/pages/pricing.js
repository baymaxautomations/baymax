/** Pricing Page */
import { gsap } from 'gsap';

const PRICING_PLANS = [
    {
        id: 'base',
        name: 'Base',
        price: 29999,
        description: 'Perfect for getting started',
        features: [
            'Feature placeholder 1',
            'Feature placeholder 2',
            'Feature placeholder 3',
            'Feature placeholder 4',
            'Feature placeholder 5',
        ],
        highlighted: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 36000,
        description: 'Most popular choice',
        features: [
            'Feature placeholder 1',
            'Feature placeholder 2',
            'Feature placeholder 3',
            'Feature placeholder 4',
            'Feature placeholder 5',
            'Feature placeholder 6',
        ],
        highlighted: true,
    },
    {
        id: 'pro-plus',
        name: 'Pro+',
        price: 45000,
        description: 'For advanced needs',
        features: [
            'Feature placeholder 1',
            'Feature placeholder 2',
            'Feature placeholder 3',
            'Feature placeholder 4',
            'Feature placeholder 5',
            'Feature placeholder 6',
            'Feature placeholder 7',
        ],
        highlighted: false,
    },
];

function formatINR(num) {
    return '₹' + num.toLocaleString('en-IN');
}

function renderPricingCard(plan) {
    const featuresList = plan.features
        .map((feature) => `<div class="pricing-feature"><span class="check-icon">✓</span>${feature}</div>`)
        .join('');

    const highlightClass = plan.highlighted ? 'pricing-card-featured' : '';
    const badge = plan.highlighted ? '<div class="pricing-badge">Most Popular</div>' : '';

    return `
    <div class="pricing-card ${highlightClass} reveal" data-plan="${plan.id}">
      ${badge}
      <div class="pricing-card-header">
        <h3 class="pricing-plan-name">${plan.name}</h3>
        <p class="pricing-plan-desc">${plan.description}</p>
      </div>

      <div class="pricing-price-block">
        <div class="pricing-amount">${formatINR(plan.price)}</div>
        <div class="pricing-suffix">+ taxes & applicable charges</div>
      </div>

      <button class="btn-pricing-cta" data-plan="${plan.id}" aria-label="Choose ${plan.name} plan">
        Get Started →
      </button>

      <div class="pricing-features-list">
        <h4 class="pricing-features-header">What's Included</h4>
        ${featuresList}
      </div>
    </div>
  `;
}

export function renderPricing() {
    const cardsHTML = PRICING_PLANS.map(renderPricingCard).join('');

    return `
    <section class="pricing-section" aria-label="Pricing Plans">
      <div class="pricing-wrapper">
        <header class="pricing-header reveal">
          <h1 class="pricing-title">Transparent, Scalable Pricing</h1>
          <p class="pricing-subtitle">Choose the plan that fits your needs. Edit details as required.</p>
        </header>

        <div class="pricing-grid">
          ${cardsHTML}
        </div>

        <div class="pricing-footer reveal" style="transition-delay: 300ms">
          <p>All plans include setup, configuration, and onboarding support</p>
          <a href="#contact" class="pricing-contact-link">Have custom requirements? Get in touch →</a>
        </div>
      </div>
    </section>
  `;
}

export function initPricingInteractions() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Intersection Observer for reveal animations
    const reveals = document.querySelectorAll('.pricing-section .reveal');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));

    // Interactive card hover and click effects
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            if (prefersReducedMotion) return;
            gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
            if (prefersReducedMotion) return;
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
        });

        // Button click animation
        const btn = card.querySelector('.btn-pricing-cta');
        if (btn) {
            btn.addEventListener('click', (e) => {
                if (prefersReducedMotion) return;
                gsap.fromTo(
                    btn,
                    { scale: 1 },
                    { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
                );
            });
        }
    });

    // Highlight animation on featured card
    const featuredCard = document.querySelector('.pricing-card-featured');
    if (featuredCard && !prefersReducedMotion) {
        gsap.to(featuredCard, {
            boxShadow: 'var(--shadow-xl)',
            duration: 0.5,
            delay: 0.2,
        });
    }
}
