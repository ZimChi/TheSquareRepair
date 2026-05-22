function updateNavButtons(slider, prevBtn, nextBtn) {
  if (!slider || !prevBtn || !nextBtn) return;

  const isAtStart = slider.scrollLeft <= 5;
  const isAtEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;

  prevBtn.classList.toggle('disabled', isAtStart);
  nextBtn.classList.toggle('disabled', isAtEnd);
}

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', async () => {
    const modalId = card.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    const slider = modal.querySelector('.project-slider');

    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    const prevBtn = modal.querySelector('.modal-nav.prev');
    const nextBtn = modal.querySelector('.modal-nav.next');
    updateNavButtons(slider, prevBtn, nextBtn);
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  const slider = modal.querySelector('.project-slider');
  const prevBtn = modal.querySelector('.modal-nav.prev');
  const nextBtn = modal.querySelector('.modal-nav.next');
  const closeBtn = modal.querySelector('.close');

  if (slider && prevBtn && nextBtn) {
    slider.addEventListener('scroll', () => updateNavButtons(slider, prevBtn, nextBtn));

    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
    });
  }

  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  });

  modal.addEventListener('click', (e) => {
    const targetClass = e.target.classList;
    if (targetClass.contains('modal') ||
        targetClass.contains('gutter-right') ||
        targetClass.contains('gutter-left') ||
        targetClass.contains('modal-logo-img')) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  });
});

window.onscroll = function() {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('header-visible');
  } else {
    header.classList.remove('header-visible');
  }
};
