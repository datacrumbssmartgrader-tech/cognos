import './style.css';

// ─── Navbar scroll effect ────────────────────────────────
const navbar = document.getElementById('navbar')!;
const backTop = document.getElementById('backTop')!;
const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  backTop.classList.toggle('visible', window.scrollY > 500);
  updateActiveNavLink();
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Smooth scroll for all anchor links ──────────────────
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileMenu();
  });
});

// ─── Active nav link on scroll ───────────────────────────
const sections = document.querySelectorAll<HTMLElement>('section[id]');

function updateActiveNavLink(): void {
  const navH = 100;
  let current = '';
  sections.forEach(section => {
    if (window.scrollY + navH >= section.offsetTop) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.slice(1);
    link.classList.toggle('active', href === current);
  });
}

// ─── Mobile hamburger menu ───────────────────────────────
const hamburger = document.getElementById('hamburger')!;
const mobileMenu = document.getElementById('mobileMenu')!;

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

function closeMobileMenu(): void {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target as Node)) closeMobileMenu();
});

// ─── Menu tab switching ──────────────────────────────────
const tabBtns = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
const menuPanels = document.querySelectorAll<HTMLElement>('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    menuPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`panel-${tab}`);
    if (panel) panel.classList.add('active');
  });
});

// ─── Gallery lightbox ────────────────────────────────────
interface GalleryItem { src: string; caption: string; }

const galleryItems: GalleryItem[] = [];
const lightbox = document.getElementById('lightbox')!;
const lbImg = document.getElementById('lbImg') as HTMLImageElement;
const lbCaption = document.getElementById('lbCaption')!;
const lbClose = document.getElementById('lbClose')!;
const lbPrev = document.getElementById('lbPrev')!;
const lbNext = document.getElementById('lbNext')!;
let lbCurrent = 0;

document.querySelectorAll<HTMLElement>('.g-item').forEach(item => {
  const src = item.dataset.src || (item.querySelector('img') as HTMLImageElement)?.src || '';
  const caption = item.dataset.caption || '';
  galleryItems.push({ src, caption });

  item.addEventListener('click', () => {
    const idx = galleryItems.findIndex(g => g.caption === caption);
    openLightbox(idx >= 0 ? idx : 0);
  });
});

function openLightbox(idx: number): void {
  lbCurrent = idx;
  lbImg.src = galleryItems[idx].src;
  lbImg.alt = galleryItems[idx].caption;
  lbCaption.textContent = galleryItems[idx].caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(): void {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
lbPrev.addEventListener('click', () => {
  lbCurrent = (lbCurrent - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(lbCurrent);
});
lbNext.addEventListener('click', () => {
  lbCurrent = (lbCurrent + 1) % galleryItems.length;
  openLightbox(lbCurrent);
});
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbPrev.click();
  if (e.key === 'ArrowRight') lbNext.click();
});

// ─── Testimonials carousel ───────────────────────────────
const track = document.getElementById('testimonialsTrack')!;
const dots = document.querySelectorAll<HTMLElement>('.t-dot');
const tPrev = document.getElementById('tPrev')!;
const tNext = document.getElementById('tNext')!;
const testimonials = document.querySelectorAll<HTMLElement>('.testimonial');
let tCurrent = 0;
let tAutoplay: ReturnType<typeof setInterval>;

function goToSlide(idx: number): void {
  tCurrent = (idx + testimonials.length) % testimonials.length;
  track.style.transform = `translateX(-${tCurrent * 100}%)`;
  track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  dots.forEach((d, i) => d.classList.toggle('active', i === tCurrent));
}

tPrev.addEventListener('click', () => { goToSlide(tCurrent - 1); resetAutoplay(); });
tNext.addEventListener('click', () => { goToSlide(tCurrent + 1); resetAutoplay(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.idx || '0'));
    resetAutoplay();
  });
});

function startAutoplay(): void {
  tAutoplay = setInterval(() => goToSlide(tCurrent + 1), 5000);
}
function resetAutoplay(): void {
  clearInterval(tAutoplay);
  startAutoplay();
}
startAutoplay();

// ─── Reservation form validation ────────────────────────
const reserveForm = document.getElementById('reserveForm') as HTMLFormElement | null;
const formSuccess = document.getElementById('formSuccess')!;

interface FieldConfig { id: string; errId: string; label: string; }

const requiredFields: FieldConfig[] = [
  { id: 'fname',   errId: 'fnameErr',   label: 'Full name' },
  { id: 'fphone',  errId: 'fphoneErr',  label: 'Phone number' },
  { id: 'fdate',   errId: 'fdateErr',   label: 'Date' },
  { id: 'ftime',   errId: 'ftimeErr',   label: 'Time' },
  { id: 'fguests', errId: 'fguestsErr', label: 'Number of guests' },
];

function setError(errId: string, msg: string): void {
  const el = document.getElementById(errId);
  if (el) el.textContent = msg;
}
function clearError(errId: string): void {
  const el = document.getElementById(errId);
  if (el) el.textContent = '';
}

reserveForm?.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => {
    const field = requiredFields.find(f => f.id === (el as HTMLElement).id);
    if (field && (el as HTMLInputElement).value.trim()) clearError(field.errId);
  });
});

reserveForm?.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  requiredFields.forEach(({ id, errId, label }) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
    if (!el?.value?.trim()) {
      setError(errId, `${label} is required`);
      valid = false;
    } else {
      clearError(errId);
    }
  });

  // Validate date is not in the past
  const dateEl = document.getElementById('fdate') as HTMLInputElement;
  if (dateEl?.value) {
    const today = new Date(); today.setHours(0,0,0,0);
    if (new Date(dateEl.value) < today) {
      setError('fdateErr', 'Please select a future date');
      valid = false;
    }
  }

  if (!valid) return;

  const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending...</span>';

  setTimeout(() => {
    reserveForm.style.display = 'none';
    showPaymentStep();
  }, 1200);
});

// ─── Payment step ────────────────────────────────────────
const paymentStep = document.getElementById('paymentStep')!;
const cardForm    = document.getElementById('cardForm') as HTMLFormElement;
const cardNum     = document.getElementById('cardNum')    as HTMLInputElement;
const cardExpiry  = document.getElementById('cardExpiry') as HTMLInputElement;
const cardCvv     = document.getElementById('cardCvv')    as HTMLInputElement;
const cardName    = document.getElementById('cardName')   as HTMLInputElement;
const cardNetwork = document.getElementById('cardNetwork')!;
const btnPay      = document.getElementById('btnPay')     as HTMLButtonElement;
const btnSkip     = document.getElementById('btnSkipPayment')!;
const formSuccessMsg = document.getElementById('formSuccessMsg')!;

function showPaymentStep(): void {
  paymentStep.classList.add('visible');
}

function showFinalSuccess(paid: boolean): void {
  paymentStep.classList.remove('visible');
  formSuccess.style.display = 'block';
  formSuccessMsg.textContent = paid
    ? 'Your PKR 1,000 deposit has been received. See you soon!'
    : 'We\'ll confirm your booking via WhatsApp or phone within 2 hours.';
}

// Card number formatting
cardNum.addEventListener('input', () => {
  let v = cardNum.value.replace(/\D/g, '').slice(0, 16);
  cardNum.value = v.replace(/(.{4})/g, '$1 ').trim();
  const prefix = v.slice(0, 2);
  if (v[0] === '4')                             cardNetwork.textContent = 'VISA';
  else if (['51','52','53','54','55'].includes(prefix)) cardNetwork.textContent = 'MC';
  else if (['34','37'].includes(prefix))        cardNetwork.textContent = 'AMEX';
  else                                          cardNetwork.textContent = '';
});

// Expiry formatting
cardExpiry.addEventListener('input', () => {
  let v = cardExpiry.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
  cardExpiry.value = v;
});

// CVV — digits only
cardCvv.addEventListener('input', () => {
  cardCvv.value = cardCvv.value.replace(/\D/g, '').slice(0, 3);
});

// Skip
btnSkip.addEventListener('click', () => showFinalSuccess(false));

// Pay
cardForm.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  [cardNum, cardExpiry, cardCvv, cardName].forEach(el => {
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  if (!valid) return;

  btnPay.disabled = true;
  btnPay.classList.add('processing');
  btnPay.innerHTML = '<i class="ri-loader-4-line"></i> Processing…';

  setTimeout(() => showFinalSuccess(true), 1800);
});

// Remove error highlight on input
[cardNum, cardExpiry, cardCvv, cardName].forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});

// ─── Newsletter form ─────────────────────────────────────
const newsletterForm = document.getElementById('newsletterForm') as HTMLFormElement | null;
newsletterForm?.addEventListener('submit', e => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input') as HTMLInputElement;
  const btn = newsletterForm.querySelector('button')!;
  btn.innerHTML = '<i class="ri-check-line"></i>';
  btn.style.background = '#1B5E3B';
  input.value = '';
  input.placeholder = 'You\'re subscribed!';
  input.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="ri-send-plane-fill"></i>';
    btn.style.background = '';
    input.placeholder = 'Your email address';
    input.disabled = false;
  }, 3500);
});

// ─── Scroll reveal (IntersectionObserver) ────────────────
const revealEls = document.querySelectorAll<HTMLElement>('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ─── Set date input minimum to today ─────────────────────
const dateInput = document.getElementById('fdate') as HTMLInputElement | null;
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// ─── Navbar always dark on hero ───────────────────────────
// Force initial scroll check
window.dispatchEvent(new Event('scroll'));
