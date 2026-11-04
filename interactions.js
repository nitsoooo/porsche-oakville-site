const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');
const menuPreview = navigation.querySelector('.menu-preview img');
let closingMenu = false;

function closeMenu(destination) {
  if (closingMenu || !navigation.open) return;
  closingMenu = true;
  navigation.classList.add('closing');
  window.setTimeout(() => {
    navigation.close();
    navigation.classList.remove('closing');
    closingMenu = false;
    if (destination) {
      const target = document.querySelector(destination);
      target.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      history.replaceState(null, '', destination);
    }
  }, motionPreference.matches ? 0 : 300);
}

menuToggle.addEventListener('click', () => {
  navigation.showModal();
  document.body.classList.add('modal-open');
  menuToggle.setAttribute('aria-expanded', 'true');
});
navigation.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  menuToggle.setAttribute('aria-expanded', 'false');
});
navigation.addEventListener('cancel', event => {
  event.preventDefault();
  closeMenu();
});
document.getElementById('menu-close').addEventListener('click', () => closeMenu());
navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    closeMenu(link.getAttribute('href'));
  });
  const showPreview = () => {
    menuPreview.src = link.dataset.preview;
    navigation.querySelector('.menu-caption').textContent = link.textContent;
    navigation.classList.add('preview-active');
  };
  link.addEventListener('pointerenter', showPreview);
  link.addEventListener('focus', showPreview);
});

if ('IntersectionObserver' in window && !motionPreference.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.grid-section h2, .story-copy, .family-image, .promise, .experience-list article, .perspective-bottom, .contact-grid').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('reveal');
      revealObserver.observe(element);
    }
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('.reveal').forEach(element => element.classList.add('revealed'));
      revealObserver.disconnect();
    }
  });
}

const pointerOrbit = document.querySelector('.pointer-orbit');
document.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || motionPreference.matches) return;
  pointerOrbit.style.left = `${event.clientX}px`;
  pointerOrbit.style.top = `${event.clientY}px`;
  pointerOrbit.classList.toggle('over-link', Boolean(event.target.closest('a, button')));
  pointerOrbit.classList.add('visible');
}, { passive: true });
document.addEventListener('pointerout', event => {
  if (!event.relatedTarget) pointerOrbit.classList.remove('visible');
});
document.addEventListener('keydown', () => pointerOrbit.classList.remove('visible'));
