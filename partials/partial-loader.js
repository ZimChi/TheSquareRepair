async function loadPartial(selector, url, isSchema = false) {
  const container = isSchema ? null : document.querySelector(selector);
  if (!container && !isSchema) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const text = await response.text();

    if (isSchema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = text;
      document.head.appendChild(script);
    } else {
      container.innerHTML = text;
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartial(null, '/partials/detail/schema-partial.json', true);
  loadPartial('.site-header', '/partials/detail/header.html');
  loadPartial('.site-footer', '/partials/detail/footer.html');
  loadPartial('.project-page-intro', '/partials/detail/project-page-intro.html');
});
