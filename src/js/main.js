const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.padding = '0.85rem 5rem';
    nav.style.background = 'rgba(12, 12, 11, 0.95)';
  } else {
    nav.style.padding = '1.25rem 5rem';
    nav.style.background = 'rgba(12, 12, 11, 0.88)';
  }
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      if (a.getAttribute('href') !== '#') {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.tipo-card, .feature-item, .mcmv-benefit-card, .lazer-item, .galeria-card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = `opacity 0.35s ease ${i * 0.03}s, transform 0.35s ease ${i * 0.03}s`;
  obs.observe(el);
});

function getRadioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : 'não informado';
}

document.getElementById('form-btn').addEventListener('click', () => {
  const nome = document.getElementById('f-nome').value.trim() || 'cliente';
  const tel = document.getElementById('f-tel').value.trim();
  const email = document.getElementById('f-email').value.trim() || 'não informado';
  const trabalho = getRadioValue('trabalho');
  const renda = getRadioValue('renda');
  const caixa = getRadioValue('caixa');
  const conhece = getRadioValue('conhece');
  const imovel = getRadioValue('imovel');
  const fgts = getRadioValue('fgts');
  const data = document.getElementById('f-data').value || 'não informada';
  const horario = document.getElementById('f-horario').value || 'não informado';
  const msg = `Olá Paulo! Gostaria de agendar uma visita ao Residencial Maro.\n\n*Dados:*\nNome: ${nome}\nWhatsApp: ${tel}\nE-mail: ${email}\n\n*Profissional:*\nTrabalho: ${trabalho}\nRenda: ${renda}\n\n*Financeiro:*\nConta Caixa: ${caixa}\nConhece MCMV: ${conhece}\nImóvel financiado: ${imovel}\nFGTS: ${fgts}\n\n*Visita:*\nData: ${data}\nHorário: ${horario}`;
  window.open('https://wa.me/5511984042039?text=' + encodeURIComponent(msg), '_blank');
});
