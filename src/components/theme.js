// Small theme toggler: remembers choice using localStorage.
export function initThemeToggle(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  const current = localStorage.getItem('theme') || 'dark';
  if(current === 'light') document.documentElement.classList.add('light');

  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const mode = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', mode);
  });
}
