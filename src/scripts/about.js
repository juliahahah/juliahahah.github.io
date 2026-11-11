// About: identity cards flip on click.
export function initAbout() {
  document.querySelectorAll('.ab-card').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}
