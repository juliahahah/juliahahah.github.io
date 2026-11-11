// Projects: category tabs.
export function initProjects() {
  const tabs = document.querySelectorAll('.ptab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.pcat;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.proj-group').forEach((g) => g.classList.toggle('active', g.dataset.pcat === cat));
      window.scrollTo(0, 0);
    });
  });
}
