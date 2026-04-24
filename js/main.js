/* ============================================================
   RUGS2RICHES — main.js
   ============================================================ */

const nav        = document.getElementById('nav')
const hamburger  = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobile-menu')

/* --- Nav scroll --- */
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40)
  }, { passive: true })
}

/* --- Hamburger --- */
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open')
    mobileMenu.classList.toggle('open', open)
    hamburger.setAttribute('aria-expanded', open)
    mobileMenu.setAttribute('aria-hidden', !open)
  })
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open')
      mobileMenu.classList.remove('open')
      hamburger.setAttribute('aria-expanded', 'false')
      mobileMenu.setAttribute('aria-hidden', 'true')
    })
  })
}

/* --- Scroll reveal --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' })

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

/* --- Smooth scroll --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href')
    if (!href || href === '#') return
    const target = document.querySelector(href)
    if (!target) return
    e.preventDefault()
    const offset = nav ? nav.offsetHeight + 16 : 80
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  })
})

/* --- Lightbox --- */
const lightbox        = document.getElementById('lightbox')
const lightboxImg     = document.getElementById('lightbox-img')
const lightboxClose   = document.getElementById('lightbox-close')
const lightboxBackdrop = document.getElementById('lightbox-backdrop')

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return
  lightboxImg.src = src
  lightbox.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  if (!lightbox) return
  lightbox.classList.remove('open')
  document.body.style.overflow = ''
  setTimeout(() => { if (lightboxImg) lightboxImg.src = '' }, 300)
}

document.querySelectorAll('.proof__item[data-src]').forEach(item => {
  item.addEventListener('click', () => openLightbox(item.dataset.src))
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item.dataset.src) }
  })
})

lightboxClose?.addEventListener('click', closeLightbox)
lightboxBackdrop?.addEventListener('click', closeLightbox)
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox() })

/* --- Contact form → sends email via mailto --- */
const form = document.getElementById('contact-form')

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()

    let valid = true
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = ''
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444'
        if (valid) field.focus()
        valid = false
      }
    })
    if (!valid) return

    const name    = form.querySelector('#name')?.value.trim() || ''
    const phone   = form.querySelector('#phone')?.value.trim() || ''
    const email   = form.querySelector('#email')?.value.trim() || ''
    const service = form.querySelector('#service')?.value || ''
    const message = form.querySelector('#message')?.value.trim() || ''

    const subject = encodeURIComponent(`Carpet Cleaning Request — ${name}`)
    const body = encodeURIComponent(
      `New request from Rugs2Riches website\n` +
      `------------------------------------------\n` +
      `Name:    ${name}\n` +
      `Phone:   ${phone}\n` +
      `Email:   ${email}\n` +
      `Service: ${service}\n\n` +
      `Message:\n${message}`
    )

    const btn        = form.querySelector('button[type="submit"]')
    const btnText    = btn?.querySelector('.btn-text')
    const btnLoading = btn?.querySelector('.btn-loading')

    if (btnText)    btnText.hidden = true
    if (btnLoading) btnLoading.hidden = false
    if (btn)        btn.disabled = true

    setTimeout(() => {
      window.location.href = `mailto:Rugs2riches.Gainesville@gmail.com?subject=${subject}&body=${body}`

      if (btn) {
        btn.textContent = '✓ Opening your email app — hit Send to reach us!'
        btn.style.background = '#2B5CE6'
        btn.style.borderColor = '#2B5CE6'
        btn.disabled = false
      }
      form.reset()
    }, 800)
  })
}
