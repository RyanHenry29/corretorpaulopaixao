// -- CONSTANTS --
const WA_NUMBER = '5511984042039';

// -- STRONGER SANITIZE --
const sanitizeInput = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/[<>'"\\;$%+]/g, '')
    .trim();
};

// -- NAV SCROLL --
const nav = document.getElementById('nav');
const propertyBackBar = document.getElementById('property-back-bar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  if (propertyBackBar) {
    propertyBackBar.classList.toggle('is-compact', window.scrollY > 120);
  }
}, { passive: true });

// -- LOGO CLICK (voltar ao topo da home) --
document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
  if (currentPropertyId) {
    e.preventDefault();
    showHomeView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// -- HERO VIDEO --
const heroVideo = document.getElementById('hero-video');
const videoWrapper = document.getElementById('video-wrapper');

function showHeroVideo() {
  videoWrapper.classList.add('video-ready');
}

function tryPlayHeroVideo() {
  if (document.hidden) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection && (navigator.connection.effectiveType === '2g' || navigator.connection.effectiveType === 'slow-2g')) return;
  var p = heroVideo.play();
  if (p && typeof p.then === 'function') {
    p.then(showHeroVideo).catch(function() {});
  } else {
    showHeroVideo();
  }
}

if (heroVideo && videoWrapper) {
  heroVideo.addEventListener('canplay', tryPlayHeroVideo, { once: true });
  heroVideo.addEventListener('playing', showHeroVideo, { once: true });
  heroVideo.addEventListener('loadedmetadata', function() {
    if (heroVideo.readyState >= 3) tryPlayHeroVideo();
  }, { once: true });
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) tryPlayHeroVideo();
  }, { passive: true });
  if (heroVideo.readyState >= 2) {
    tryPlayHeroVideo();
  }
  heroVideo.load();
}

// -- REVEAL ON SCROLL --
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

document.querySelectorAll('img[data-fallback-src]').forEach(img => {
  img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = img.dataset.fallbackSrc;
  });
});

// -- MASKS --
const cpfInput = document.getElementById('f-cpf');
if (cpfInput) {
  cpfInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) {
      v = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6, 9) + '-' + v.slice(9);
    } else if (v.length > 6) {
      v = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6);
    } else if (v.length > 3) {
      v = v.slice(0, 3) + '.' + v.slice(3);
    }
    e.target.value = v;
  });
}

const telInput = document.getElementById('f-tel');
if (telInput) {
  telInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
    e.target.value = v;
  });
}

function maskMoneyInput(input) {
  if (!input) return;
  input.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) { e.target.value = ''; return; }
    const num = parseInt(digits, 10) / 100;
    e.target.value = 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });
}
maskMoneyInput(document.getElementById('f-entrada'));
maskMoneyInput(document.getElementById('f-fgts-valor'));

const fgtsValorWrap = document.getElementById('fgts-valor-wrap');
if (fgtsValorWrap) {
  document.querySelectorAll('input[name="fgts"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const temFgts = document.querySelector('input[name="fgts"]:checked')?.value === 'Sim';
      fgtsValorWrap.hidden = !temFgts;
      if (!temFgts) document.getElementById('f-fgts-valor').value = '';
    });
  });
}

const civilSelect = document.getElementById('f-civil');
const conjugeWrap = document.getElementById('conjuge-wrap');
function updateConjugeVisibility() {
  if (!civilSelect || !conjugeWrap) return;
  const casado = civilSelect.value === 'Casado(a)';
  conjugeWrap.hidden = !casado;
  if (!casado) document.getElementById('f-conjuge-renda').checked = false;
}
if (civilSelect) civilSelect.addEventListener('change', updateConjugeVisibility);

// -- RENDER CARDS --
function renderCards() {
  const container = document.getElementById('cards-container');
  if (!container) return;
  container.innerHTML = EMPREENDIMENTOS.map(emp => {
    const statusClass = emp.status.toLowerCase().replace(/\s+/g, '-');
    return `
    <div class="emp-card" data-emp-id="${emp.id}" role="button" tabindex="0" aria-label="Ver ${emp.nome}">
      <div class="emp-card-img-wrap">
        <img src="${emp.fotoCapa}" alt="${emp.nome}" class="emp-card-img" loading="lazy">
        <div class="emp-card-img-overlay"></div>
        <div class="emp-card-status ${statusClass}">${emp.status}</div>
      </div>
      <div class="emp-card-body">
        <div class="emp-card-local"><i class="fa-solid fa-location-dot"></i> ${emp.bairro}</div>
        <h3 class="emp-card-title">${emp.nome}</h3>
        <p class="emp-card-desc">${emp.descricaoCurta}</p>
        <div class="emp-card-price">${emp.faixaPreco}</div>
        <div class="emp-card-meta">
          <span><i class="fa-solid fa-table-cells-large"></i> ${emp.plantas.length} plantas</span>
          ${emp.temMCMV ? '<span><i class="fa-solid fa-house-circle-check"></i> MCMV</span>' : ''}
        </div>
        <button class="emp-card-cta" data-emp-id="${emp.id}">Conhecer <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  `}).join('');

  container.querySelectorAll('.emp-card-cta, .emp-card').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = el.dataset.empId || el.closest('.emp-card')?.dataset.empId;
      if (id) showPropertyView(id);
    });
  });
}

// -- VIEW NAVIGATION --
let currentPropertyId = null;

function showPropertyView(id) {
  const emp = EMPREENDIMENTOS.find(e => e.id === id);
  if (!emp) return;
  currentPropertyId = id;

  document.getElementById('home-view').style.display = 'none';
  document.getElementById('property-view').style.display = 'block';

  document.getElementById('section-nav').style.display = 'none';
  nav.classList.add('is-property');

  renderPropertyDetail(emp);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState(null, '', `#${emp.slug}`);
  document.title = `${emp.nome} · Corretor Paulo Paixão`;
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${emp.nome} · Corretor Paulo Paixão`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', emp.descricaoCurta);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', `https://paulopaixaoimoveis.com.br/${emp.fotoCapa}`);

  document.getElementById('f-empreendimento-hidden').value = emp.nome;
  document.getElementById('form-card-title').textContent = `Converse sobre o ${emp.nome}`;

  populatePlantaOptions(emp);
  resetPreQual();

  if (typeof scrollSecObserver !== 'undefined' && scrollSecObserver) scrollSecObserver.disconnect();
}

function showHomeView() {
  currentPropertyId = null;

  document.getElementById('home-view').style.display = '';
  document.getElementById('property-view').style.display = 'none';
  document.getElementById('section-nav').style.display = '';
  nav.classList.remove('is-property');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState(null, '', '/');
  document.title = 'Corretor Paulo Paixão';
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Corretor Paulo Paixão · Residencial Maro — Guarulhos');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Apartamentos de 27 a 46 m² em Guarulhos. Financiamento Minha Casa Minha Vida com orientação gratuita.');
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', 'https://paulopaixaoimoveis.com.br/assets/img/foto-residencial.jpeg');

  document.getElementById('f-empreendimento-hidden').value = '';
  document.getElementById('form-card-title').textContent = 'Converse conosco';

  const container = document.getElementById('planta-options');
  if (container) container.innerHTML = '';
  resetPreQual();

  if (typeof scrollSecObserver !== 'undefined' && scrollSecObserver) {
    scrollSections.forEach(function(sec) { if (sec) scrollSecObserver.observe(sec); });
  }
}

// -- RENDER PROPERTY DETAIL --
function renderPropertyDetail(emp) {
  const container = document.getElementById('property-content');
  if (!container) return;

  const plantasHtml = emp.plantas.map((p, i) => `
    <div class="tipo-card ${p.destaque ? 'destaque' : ''} planta-card"
      style='--tipo-bg: url("${p.imagem}"); --tipo-bg-position: center 0.75rem;'>
      ${p.badge ? `<div class="tipo-badge">${p.badge}</div>` : ''}
      <div class="tipo-tag">${p.tag}</div>
      <div class="tipo-name">${p.nome}</div>
      <div class="tipo-area">${p.area}</div>
      <div class="tipo-price-label">Preço Base</div>
      <div class="tipo-price">${p.preco}</div>
      <div class="tipo-avaliacao">${p.avaliacao ? 'Avaliado em ' + p.avaliacao : ''}</div>
      <a href="#formulario" class="tipo-cta" data-planta="${p.nome}" data-emp-id="${emp.id}">Quero esta planta</a>
    </div>
  `).join('');

  container.innerHTML = `
    <section class="section section-white" id="empreendimento">
      <div class="emp-grid">
        <div class="emp-img-wrap" data-reveal>
          <img src="${emp.fotoCapa}" alt="${emp.nome}" class="emp-img" loading="lazy">
        </div>
        <div data-reveal data-delay="1">
          <span class="label">O Empreendimento</span>
          <h2 class="section-title">${emp.nome}<br>${emp.cidade}</h2>
          <p class="section-sub">${emp.descricaoCompleta}</p>
          <ul class="emp-features">
            ${emp.diferenciais.map(d => `
              <li class="emp-feature"><i class="fa-solid fa-check"></i> ${d}</li>
            `).join('')}
          </ul>
          ${emp.areaLazer && emp.areaLazer.length ? `
            <div style="margin-top:2rem;padding-top:2rem;border-top:1px solid var(--light-mid);">
              <span class="label" style="margin-bottom:1rem;display:flex;">Área de lazer</span>
              <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:1rem;">
                ${emp.areaLazer.map(a => `
                  <span style="background:var(--light);padding:0.5rem 1rem;border-radius:50px;font-size:0.85rem;font-weight:600;color:var(--teal);">
                    <i class="fa-solid fa-tree"></i> ${a}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          ${emp.torres ? `<p style="margin-top:1.5rem;font-size:0.9rem;color:var(--teal-light);"><strong>${emp.torres}</strong> torre(s) · <strong>${emp.unidades}</strong> unidades</p>` : ''}
        </div>
      </div>
    </section>

    <section class="section section-light" id="tipologias">
      <div class="container text-center">
        <div class="section-head" data-reveal>
          <span class="label">Plantas disponíveis</span>
          <h2 class="section-title">Escolha seu apartamento</h2>
        </div>
      </div>
      <div class="tipo-grid" data-reveal>
        ${plantasHtml}
      </div>
    </section>

    ${emp.localizacao ? `
    <section class="section section-white" id="localizacao">
      <div class="loc-inner">
        <div data-reveal>
          <span class="label">Localização</span>
          <h2 class="section-title">Em ${emp.localizacao.bairro}</h2>
          <div class="loc-details">
            <div class="loc-detail-item">
              <div class="loc-detail-label">Referências</div>
              <div class="loc-detail-val">${emp.localizacao.endereco}</div>
            </div>
            <div class="loc-detail-item">
              <div class="loc-detail-label">Mobilidade</div>
              <div class="loc-detail-val">${emp.localizacao.mobilidade}</div>
            </div>
          </div>
        </div>
        <div class="loc-map-wrap" data-reveal data-delay="1">
          <div class="loc-map">
            <iframe
              src="${emp.localizacao.embedUrl}"
              loading="lazy" allowfullscreen style="width: 100%; height: 100%; border: 0;"
              title="Mapa da localização do ${emp.nome}"></iframe>
          </div>
          <a href="${emp.localizacao.mapsUrl}" target="_blank" rel="noopener noreferrer" class="loc-map-button">
            <i class="fa-solid fa-location-dot"></i> Abrir no Google Maps
          </a>
        </div>
      </div>
    </section>
    ` : ''}

    ${emp.galeria && emp.galeria.length ? `
    <section class="section section-white" id="galeria">
      <div class="container text-center">
        <div class="section-head" data-reveal>
          <span class="label">Galeria</span>
          <h2 class="section-title">Fotos do ${emp.nome}</h2>
        </div>
      </div>
      <div class="gallery-grid" data-reveal>
        ${emp.galeria.map(function(f, i) {
          var src = typeof f === 'string' ? f : f.src;
          var caption = typeof f === 'string' ? '' : (f.caption || '');
          var alt = caption || (emp.nome + ' foto ' + (i + 1));
          return '<figure class="gallery-card">' +
            '<img src="' + src + '" alt="' + alt + '" loading="lazy">' +
            (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
            '</figure>';
        }).join('')}
      </div>
    </section>
    ` : ''}
  `;

  // Re-init reveal for new elements
  const newReveals = container.querySelectorAll('[data-reveal]');
  newReveals.forEach(el => observer.observe(el));

  // Planta CTA links
  container.querySelectorAll('.tipo-cta[data-planta]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const planta = link.dataset.planta;
      const empId = link.dataset.empId;
      if (empId && planta) {
        sessionStorage.setItem('plantaInteresse_' + empId, planta);
      }
      scrollToFormCard();
      selectPlanta(planta);
    });
  });
}

// -- POPULATE PLANTA OPTIONS IN FORM --
function populatePlantaOptions(emp) {
  const container = document.getElementById('planta-options');
  if (!container) return;
  container.innerHTML = emp.plantas.map(p => `
    <label class="form-radio">
      <input type="radio" name="planta" value="${p.nome}" required aria-required="true"> ${p.nome}
    </label>
  `).join('');
}

function selectPlanta(planta) {
  const radios = document.querySelectorAll('input[name="planta"]');
  radios.forEach(r => {
    if (r.value === planta) r.checked = true;
  });
}

// -- BACK TO LIST --
document.getElementById('btn-back-to-list')?.addEventListener('click', showHomeView);

// -- PRE-QUALIFICATION --
let pqCurrentStep = 1;
const pqData = {};

const PQ_MAIN_STEPS = ['1','2','3','4','5','6'];

function pqProgressPct() {
  var idx = PQ_MAIN_STEPS.indexOf(String(pqCurrentStep));
  if (idx === -1) {
    idx = PQ_MAIN_STEPS.indexOf(String(pqCurrentStep).charAt(0));
    if (idx === -1) idx = 0;
  }
  return Math.round(((idx) / 6) * 100);
}

function pqGetActiveMainStep() {
  var s = String(pqCurrentStep);
  return parseInt(s.charAt(0));
}

function resetPreQual() {
  pqCurrentStep = 1;
  Object.keys(pqData).forEach(function(k) { delete pqData[k]; });
  var preQual = document.getElementById('pre-qual');
  var pqResult = document.getElementById('pq-result');
  var contato = document.getElementById('contato');
  var pqExtra = document.getElementById('pq-extra-info');
  if (preQual) preQual.style.display = '';
  if (pqResult) pqResult.style.display = 'none';
  if (contato) contato.style.display = 'none';
  if (pqExtra) pqExtra.style.display = 'none';
  document.querySelectorAll('.pq-step').forEach(function(s) { s.classList.remove('active'); });
  document.querySelector('[data-pq-step="1"]')?.classList.add('active');
  document.querySelectorAll('.pq-option').forEach(function(o) { o.classList.remove('selected'); });
  var cidadeInput = document.getElementById('pq-cidade');
  if (cidadeInput) cidadeInput.value = '';
  var defRendaInput = document.getElementById('pq-renda-input');
  if (defRendaInput) defRendaInput.value = '';
  var defRendaComp = document.getElementById('pq-renda-comp-input');
  if (defRendaComp) defRendaComp.value = '';
  var defRendaComp2 = document.getElementById('pq-renda-comp2-input');
  if (defRendaComp2) defRendaComp2.value = '';
  var bar = document.getElementById('pq-progress-bar');
  if (bar) bar.style.width = '0%';
  var indicator = document.getElementById('pq-step-indicator');
  if (indicator) indicator.textContent = 'Etapa 1 de 6 \u00B7 0%';
  var backBtn = document.getElementById('pq-btn-back');
  if (backBtn) backBtn.style.visibility = 'hidden';
  pqUpdateNextButton();
}

function pqUpdateProgress() {
  var pct = pqProgressPct();
  var bar = document.getElementById('pq-progress-bar');
  var indicator = document.getElementById('pq-step-indicator');
  if (bar) bar.style.width = pct + '%';
  if (indicator) indicator.textContent = 'Etapa ' + pqGetActiveMainStep() + ' de 6 \u00B7 ' + pct + '%';
}

function pqGoToStep(step) {
  document.querySelectorAll('.pq-step').forEach(function(s) { s.classList.remove('active'); });
  var next = document.querySelector('[data-pq-step="' + step + '"]');
  if (next) next.classList.add('active');
  pqCurrentStep = step;
  pqUpdateProgress();
  var backBtn = document.getElementById('pq-btn-back');
  if (backBtn) backBtn.style.visibility = (step === 1 || step === '1') ? 'hidden' : 'visible';

  pqUpdateNextButton();
}

function pqUpdateNextButton() {
  var btn = document.getElementById('pq-btn-next');
  if (!btn) return;
  var step = String(pqCurrentStep);
  var mainStep = pqGetActiveMainStep();

  if (mainStep === 2 && step === '2') {
    btn.innerHTML = 'Avan\u00e7ar <i class="fa-solid fa-arrow-right"></i>';
    btn.className = 'pq-btn pq-btn-next';
    btn.disabled = !pqIsStepComplete('2');
    return;
  }
  if (step === '2b') {
    btn.innerHTML = 'Avan\u00e7ar <i class="fa-solid fa-arrow-right"></i>';
    btn.className = 'pq-btn pq-btn-next';
    btn.disabled = !pqIsStepComplete('2b');
    return;
  }
  if (step === '2c') {
    btn.innerHTML = 'Avan\u00e7ar <i class="fa-solid fa-arrow-right"></i>';
    btn.className = 'pq-btn pq-btn-next';
    btn.disabled = !pqIsStepComplete('2c');
    return;
  }
  if (step === '2d') {
    btn.innerHTML = 'Avan\u00e7ar <i class="fa-solid fa-arrow-right"></i>';
    btn.className = 'pq-btn pq-btn-next';
    btn.disabled = !pqIsStepComplete('2d');
    return;
  }
  if (step === '2e') {
    btn.innerHTML = 'Ver resultado <i class="fa-solid fa-arrow-right"></i>';
    btn.className = 'pq-btn pq-btn-next pq-btn-finish';
    btn.disabled = !pqIsStepComplete('2e');
    return;
  }

  if (mainStep < 6) {
    btn.innerHTML = 'Avan\u00e7ar <i class="fa-solid fa-arrow-right"></i>';
    btn.className = 'pq-btn pq-btn-next';
    btn.disabled = !pqIsStepComplete(step);
  } else {
    btn.innerHTML = '\u{1F3AF} Ver resultado';
    btn.className = 'pq-btn pq-btn-next pq-btn-finish';
    btn.disabled = !pqIsStepComplete(6);
  }
}

function pqIsStepComplete(step) {
  if (step == 1 || step === '1') {
    var val = document.getElementById('pq-cidade')?.value.trim() || '';
    return val.length >= 2;
  }
  if (step === '2') {
    var v = parseFloat(document.getElementById('pq-renda-input')?.value) || 0;
    return v > 0;
  }
  if (step === '2c') {
    var v = parseFloat(document.getElementById('pq-renda-comp-input')?.value) || 0;
    return v > 0;
  }
  if (step === '2e') {
    var v = parseFloat(document.getElementById('pq-renda-comp2-input')?.value) || 0;
    return v > 0;
  }
  var stepEl = document.querySelector('[data-pq-step="' + step + '"]');
  if (!stepEl) return false;
  return stepEl.querySelector('.pq-option.selected') !== null;
}

function pqGetRendaMidValue(rendaStr) {
  return parseFloat(rendaStr) || 0;
}

function pqCalcTotalRenda() {
  var rendaVal = pqGetRendaMidValue(pqData.renda);
  var comp1Val = pqGetRendaMidValue(pqData.rendaComp);
  var comp2Val = pqGetRendaMidValue(pqData.rendaComp2);
  var total = rendaVal + comp1Val + comp2Val;
  pqData.rendaTotal = total;
  pqData.rendaTitular = rendaVal;
  pqData.rendaComp1Val = comp1Val;
  pqData.rendaComp2Val = comp2Val;
  return total;
}

function pqStoreCurrentStep() {
  var step = document.querySelector('.pq-step.active');
  if (!step) return;
  var stepNum = step.dataset.pqStep;

  if (stepNum === '1') {
    pqData.cidade = document.getElementById('pq-cidade')?.value.trim() || '';
    return;
  }
  if (stepNum === '2') {
    pqData.renda = document.getElementById('pq-renda-input')?.value.trim() || '';
    return;
  }
  if (stepNum === '2c') {
    pqData.rendaComp = document.getElementById('pq-renda-comp-input')?.value.trim() || '';
    return;
  }
  if (stepNum === '2e') {
    pqData.rendaComp2 = document.getElementById('pq-renda-comp2-input')?.value.trim() || '';
    return;
  }
  var selected = step.querySelector('.pq-option.selected');
  if (!selected) return;

  if (stepNum === '2b') {
    pqData.composicao = selected.dataset.pqComposicao || selected.textContent.trim();
  } else if (stepNum === '2d') {
    pqData.composicao2 = selected.dataset.pqComposicao2 || selected.textContent.trim();
  } else if (stepNum === '3') {
    pqData.financiamento = selected.textContent.trim();
  } else if (stepNum === '4') {
    pqData.fgts = selected.textContent.trim();
  } else if (stepNum === '5') {
    pqData.imovel = selected.textContent.trim();
  } else if (stepNum === '6') {
    pqData.civil = selected.textContent.trim();
  }
}

document.querySelectorAll('.pq-option').forEach(function(opt) {
  opt.addEventListener('click', function() {
    var group = this.closest('.pq-options');
    if (!group) return;
    group.querySelectorAll('.pq-option').forEach(function(o) { o.classList.remove('selected'); });
    this.classList.add('selected');
    pqStoreCurrentStep();
    pqUpdateNextButton();
  });
});

document.getElementById('pq-cidade')?.addEventListener('input', function() {
  var step = this.closest('.pq-step')?.dataset.pqStep || '1';
  if (step === '1') {
    pqData.cidade = this.value.trim();
    pqUpdateNextButton();
    var feedback = document.getElementById('pq-cidade-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'pq-cidade-feedback';
      feedback.style.cssText = 'font-size:0.8rem;margin-top:0.5rem;font-weight:600;';
      this.parentNode.appendChild(feedback);
    }
    var val = this.value.trim().toLowerCase();
    if (val.length < 2) {
      feedback.textContent = '';
      feedback.style.display = 'none';
    } else if (val.indexOf('guarulhos') !== -1) {
      feedback.textContent = '\u2713 \u00D3timo! Temos empreendimentos em Guarulhos.';
      feedback.style.color = '#22c55e';
      feedback.style.display = '';
    } else {
      feedback.textContent = 'Nossos empreendimentos ficam em Guarulhos-SP. Mesmo assim, podemos ajudar com o financiamento.';
      feedback.style.color = 'var(--teal-light)';
      feedback.style.display = '';
    }
  }
});

['pq-renda-input','pq-renda-comp-input','pq-renda-comp2-input'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', function() {
      pqStoreCurrentStep();
      pqUpdateNextButton();
    });
  }
});

function pqHandleNext() {
  pqStoreCurrentStep();
  var step = String(pqCurrentStep);

  if (step === '2') {
    var rendaGrade = pqGetRendaGrade(pqData.renda || '');
    if (rendaGrade < 4) {
      pqGoToStep('2b');
      return;
    }
    pqGoToStep(3);
    return;
  }

  if (step === '2b') {
    if (pqData.composicao === 'N\u00E3o') {
      pqFinalize();
      return;
    }
    pqGoToStep('2c');
    return;
  }

  if (step === '2c') {
    pqCalcTotalRenda();
    if (pqData.rendaTotal >= 7000) {
      pqGoToStep(3);
      return;
    }
    pqGoToStep('2d');
    return;
  }

  if (step === '2d') {
    if (pqData.composicao2 === 'N\u00E3o') {
      pqFinalize();
      return;
    }
    pqGoToStep('2e');
    return;
  }

  if (step === '2e') {
    pqCalcTotalRenda();
    pqFinalize();
    return;
  }

  var mainStep = pqGetActiveMainStep();
  if (mainStep < 6) {
    pqGoToStep(mainStep + 1);
  } else {
    pqFinalize();
  }
}

document.getElementById('pq-btn-back')?.addEventListener('click', function() {
  var step = pqCurrentStep;
  if (step === '2b') { pqGoToStep('2'); return; }
  if (step === '2c') { pqGoToStep('2b'); return; }
  if (step === '2d') { pqGoToStep('2c'); return; }
  if (step === '2e') { pqGoToStep('2d'); return; }
  if (step > 1) pqGoToStep(step - 1);
});

document.getElementById('pq-btn-next')?.addEventListener('click', pqHandleNext);

function pqGetRendaGrade(rendaStr) {
  var val = parseFloat(rendaStr) || 0;
  if (val >= 7000) return 4;
  if (val >= 5000) return 3;
  if (val >= 2001) return 2;
  if (val > 0) return 1;
  return 0;
}

function pqComputeScore() {
  var score = 50;
  var rendaGrade = pqGetRendaGrade(pqData.renda);
  score += rendaGrade * 8;
  if (pqData.fgts === 'Sim') score += 10;
  if (pqData.imovel === 'N\u00E3o') score += 5;
  if (pqData.civil === 'Casado(a)') score += 5;
  if (pqData.composicao && pqData.composicao !== 'N\u00E3o') score += 5;
  if (pqData.financiamento === 'Com outra pessoa') score += 3;
  return Math.min(100, Math.max(0, score));
}

function pqGetScoreStars(score) {
  if (score >= 80) return '\u2605\u2605\u2605\u2605\u2605';
  if (score >= 60) return '\u2605\u2605\u2605\u2605\u2606';
  if (score >= 40) return '\u2605\u2605\u2605\u2606\u2606';
  if (score >= 20) return '\u2605\u2605\u2606\u2606\u2606';
  return '\u2605\u2606\u2606\u2606\u2606';
}

function pqGetScoreLabel(score) {
  if (score >= 80) return 'Alta probabilidade';
  if (score >= 60) return 'Boa probabilidade';
  if (score >= 40) return 'Necessita an\u00E1lise';
  return 'A definir';
}

function pqBuildScoreHTML() {
  var score = pqComputeScore();
  var stars = pqGetScoreStars(score);
  var label = pqGetScoreLabel(score);
  var items = [];
  if (pqData.fgts === 'Sim') items.push('<li class="pq-score-item pos"><i class="fa-solid fa-check-circle"></i> FGTS dispon\u00EDvel</li>');
  else items.push('<li class="pq-score-item neg"><i class="fa-solid fa-circle-exclamation"></i> Sem FGTS</li>');
  if (pqData.imovel === 'N\u00E3o') items.push('<li class="pq-score-item pos"><i class="fa-solid fa-check-circle"></i> Primeiro im\u00F3vel</li>');
  else items.push('<li class="pq-score-item info"><i class="fa-solid fa-circle-info"></i> J\u00E1 possui im\u00F3vel</li>');
  if (pqData.rendaComp) {
    items.push('<li class="pq-score-item pos"><i class="fa-solid fa-check-circle"></i> Renda complementar adicionada</li>');
  }
  var rendaGrade = pqGetRendaGrade(pqData.renda);
  var rendaVal = pqGetRendaMidValue(pqData.renda);
  var rendaStr = 'R$ ' + rendaVal.toLocaleString('pt-BR');
  if (rendaGrade >= 4) items.push('<li class="pq-score-item pos"><i class="fa-solid fa-check-circle"></i> Renda: ' + rendaStr + ' — OK</li>');
  else if (rendaGrade >= 2) items.push('<li class="pq-score-item warn"><i class="fa-solid fa-triangle-exclamation"></i> Renda: ' + rendaStr + ' — em an\u00E1lise</li>');
  else items.push('<li class="pq-score-item neg"><i class="fa-solid fa-circle-exclamation"></i> Renda: ' + rendaStr + ' — abaixo do ideal</li>');
  return (
    '<div class="pq-score">' +
      '<div class="pq-score-value">' + score + '<span class="pq-score-max">/100</span></div>' +
      '<div class="pq-score-stars">' + stars + '</div>' +
      '<div class="pq-score-label">' + label + '</div>' +
      '<ul class="pq-score-list">' + items.join('') + '</ul>' +
    '</div>'
  );
}

function pqFinalize() {
  var rendaLabel = pqData.renda || '';
  var isElegivel = false;

  var rendaGrade = pqGetRendaGrade(rendaLabel);

  if (rendaGrade >= 4) {
    isElegivel = true;
  } else {
    var total = pqCalcTotalRenda();
    if (total >= 7000) isElegivel = true;
  }

  var scoreHTML = pqBuildScoreHTML();

  document.getElementById('pre-qual').style.display = 'none';
  document.getElementById('pq-result').style.display = '';

  var content = document.getElementById('pq-result-content');
  var actions = document.getElementById('pq-result-actions');

  if (isElegivel) {
    content.innerHTML =
      '<div class="pq-result-icon approved"><i class="fa-solid fa-circle-check"></i></div>' +
      '<div class="pq-result-title">Perfil compat\u00EDvel! \u{1F389}</div>' +
      scoreHTML +
      '<p class="pq-result-msg">Preencha seus dados abaixo para que Paulo analise as melhores op\u00E7\u00F5es para voc\u00EA.</p>';
    actions.innerHTML =
      '<button type="button" class="pq-result-btn pq-result-btn-primary" id="pq-go-to-form">' +
        '<i class="fa-solid fa-file-pen"></i> Preencher cadastro' +
      '</button>';
    document.getElementById('pq-go-to-form').addEventListener('click', function() {
      document.getElementById('pq-result').style.display = 'none';
      document.getElementById('contato').style.display = '';
      var pqExtra = document.getElementById('pq-extra-info');
      if (pqExtra) { pqExtra.style.display = ''; populatePqExtraInfo(); }
      populateFormFromPreQual();
      if (pqData.rendaComp) {
        var compBadge = document.getElementById('pq-composicao-badge');
        if (compBadge) {
          var badgeHtml = '<i class="fa-solid fa-users"></i> Renda composta: <strong>titular R$ ' +
            (pqData.rendaTitular || 0).toLocaleString('pt-BR') + '</strong>';
          if (pqData.rendaComp1Val > 0) {
            badgeHtml += ' + <strong>1\u00AA pessoa R$ ' + pqData.rendaComp1Val.toLocaleString('pt-BR') + '</strong>';
          }
          if (pqData.rendaComp2Val > 0) {
            badgeHtml += ' + <strong>2\u00AA pessoa R$ ' + pqData.rendaComp2Val.toLocaleString('pt-BR') + '</strong>';
          }
          badgeHtml += ' = <strong>R$ ' + (pqData.rendaTotal || 0).toLocaleString('pt-BR') + '</strong>';
          compBadge.innerHTML = badgeHtml;
          compBadge.style.display = 'block';
        }
      }
      document.querySelectorAll('#contato [data-reveal]').forEach(function(el) { observer.observe(el); });
      scrollToFormCard();
    });
  } else {
    content.innerHTML =
      '<div class="pq-result-icon partial"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
      '<div class="pq-result-title">Renda abaixo do valor m\u00EDnimo</div>' +
      scoreHTML +
      '<p class="pq-result-msg">Infelizmente sua renda total n\u00E3o atingiu o valor m\u00EDnimo de R$ 7.000 necess\u00E1rio para este empreendimento. Consulte outras op\u00E7\u00F5es de im\u00F3veis ou fale com Paulo para encontrar alternativas.</p>';
    actions.innerHTML =
      '<button type="button" class="pq-result-btn pq-result-btn-primary" onclick="showHomeView()">' +
        '<i class="fa-solid fa-building"></i> Ver outros empreendimentos' +
      '</button>' +
      '<button type="button" class="pq-result-btn pq-result-btn-whatsapp" id="pq-partial-whatsapp">' +
        '<i class="fa-brands fa-whatsapp"></i> Falar com corretor' +
      '</button>';
    document.getElementById('pq-partial-whatsapp').addEventListener('click', function() {
      var msgEnc = encodeURIComponent(
        'Ol\u00E1 Paulo! Fiz a pr\u00E9-an\u00E1lise no site mas minha renda n\u00E3o atingiu o m\u00EDnimo. Gostaria de conhecer op\u00E7\u00F5es mais adequadas ao meu perfil. Minha renda \u00E9 ' + (pqData.renda || 'n\u00E3o informada') + '.'
      );
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + msgEnc, '_blank', 'noopener,noreferrer');
    });
  }
}

// -- FORM LOGIC --
let currentSection = 1;

function updateProgress(section) {
  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById(`p-step-${i}`);
    const label = document.getElementById(`p-label-${i}`);
    if (!step || !label) continue;
    step.classList.remove('active', 'completed');
    label.classList.remove('active', 'completed');
    if (i < section) {
      step.classList.add('completed'); label.classList.add('completed');
    } else if (i === section) {
      step.classList.add('active'); label.classList.add('active');
    }
  }
}

function validateSection(section) {
  const form = document.getElementById('qualForm');
  if (!form) return true;
  const inputs = form.querySelectorAll(`#sec-${section} input, #sec-${section} select`);
  let isValid = true;
  const validatedRadios = new Set();

  inputs.forEach(input => {
    if (input.closest('.form-conditional[hidden]')) return;
    const group = input.closest('.form-group');
    if (!input.hasAttribute('required')) return;

    if (input.type === 'radio') {
      if (validatedRadios.has(input.name)) return;
      validatedRadios.add(input.name);
      const radioGroup = form.querySelectorAll(`#sec-${section} input[name="${input.name}"]`);
      const isChecked = Array.from(radioGroup).some(r => r.checked && !r.closest('.form-conditional[hidden]'));
      if (!isChecked && group) { group.classList.add('error'); isValid = false; }
      else if (group) { group.classList.remove('error'); }
    } else if (input.type === 'checkbox') {
      if (!input.checked && group) { group.classList.add('error'); isValid = false; }
      else if (group) { group.classList.remove('error'); }
    } else if (!input.value.trim()) {
      if (group) { group.classList.add('error'); }
      isValid = false;
    } else if (group) {
      group.classList.remove('error');
    }
  });
  return isValid;
}

function scrollToFormCard() {
  const contato = document.getElementById('contato');
  const isFormVisible = contato && contato.style.display !== 'none';
  const target = isFormVisible
    ? document.querySelector('.form-card')
    : document.querySelector('.pq-card');
  if (!target) return;
  requestAnimationFrame(() => {
    const navHeight = document.getElementById('nav')?.getBoundingClientRect().height || 0;
    const elTop = target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: Math.max(0, elTop - navHeight - 44), behavior: 'smooth' });
  });
}

function nextStep(section) {
  if (!validateSection(section)) return;
  document.getElementById(`sec-${section}`).classList.remove('active');
  currentSection = section + 1;
  document.getElementById(`sec-${currentSection}`).classList.add('active');
  updateProgress(currentSection);
  if (currentSection === 4) populateFormSummary();
  scrollToFormCard();
}

function prevStep(section) {
  document.getElementById(`sec-${section}`).classList.remove('active');
  currentSection = section - 1;
  document.getElementById(`sec-${currentSection}`).classList.add('active');
  updateProgress(currentSection);
  scrollToFormCard();
}

document.querySelectorAll('[data-next-step]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    nextStep(Number(button.dataset.nextStep));
  });
});

document.querySelectorAll('[data-prev-step]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    prevStep(Number(button.dataset.prevStep));
  });
});

document.querySelectorAll('[data-submit-form]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    submitForm();
  });
});

document.querySelectorAll('a[href="#formulario"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    history.pushState(null, '', '#formulario');
    scrollToFormCard();
  });
});

if (location.hash === '#formulario') {
  setTimeout(scrollToFormCard, 100);
}

// -- COLLAPSIBLE INFO --
document.getElementById('form-collapse-toggle')?.addEventListener('click', function() {
  var content = document.getElementById('form-collapse-content');
  var icon = this.querySelector('.form-collapse-icon');
  if (!content) return;
  var isOpen = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', !isOpen);
  if (icon) icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
  content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
});

// -- POPULATE EXTRA INFO --
function populatePqExtraInfo() {
  document.getElementById('pq-extra-cidade').textContent = pqData.cidade || '—';
  document.getElementById('pq-extra-renda').textContent = pqData.renda || '—';
  document.getElementById('pq-extra-financiamento').textContent = pqData.financiamento || '—';
  document.getElementById('pq-extra-fgts').textContent = pqData.fgts || '—';
  document.getElementById('pq-extra-imovel').textContent = pqData.imovel || '—';
  document.getElementById('pq-extra-civil').textContent = pqData.civil || '—';
}

// -- AUTO-FILL FORM FROM PRE-QUAL --
function mapRendaToOption(rendaTotal) {
  var val = parseFloat(rendaTotal) || 0;
  if (val >= 15000) return 'Acima de R$ 15.000';
  if (val >= 12000) return 'R$ 12.000 a R$ 15.000';
  if (val >= 9000) return 'R$ 9.000 a R$ 12.000';
  if (val >= 7000) return 'R$ 7.000 a R$ 9.000';
  return '';
}

function populateFormFromPreQual() {
  if (!pqData || Object.keys(pqData).length === 0) return;

  // Cidade
  var cidadeField = document.getElementById('f-cidade');
  var cidadeWrap = document.getElementById('f-cidade-wrap');
  if (cidadeField && cidadeWrap && pqData.cidade) {
    cidadeField.value = pqData.cidade;
    cidadeWrap.style.display = '';
  }

  // Faixa de renda
  var rendaTotal = pqData.rendaTotal || pqData.renda;
  if (rendaTotal) {
    var rendaOption = mapRendaToOption(rendaTotal);
    if (rendaOption) {
      document.getElementById('f-renda').value = rendaOption;
    }
  }

  // Pessoas na renda
  if (pqData.financiamento === 'Com outra pessoa') {
    document.getElementById('f-pessoas-renda').value = '2 pessoas';
  }

  // FGTS
  if (pqData.fgts) {
    var fgtsRadio = document.querySelector('input[name="fgts"][value="' + pqData.fgts + '"]');
    if (fgtsRadio) {
      fgtsRadio.checked = true;
      fgtsRadio.dispatchEvent(new Event('change'));
    }
  }

    // Estado civil
    if (pqData.civil) {
      var civilMap = {
        'Solteiro(a)': 'Solteiro(a)',
        'Casado(a)': 'Casado(a) / União',
        'Casado(a) / União': 'Casado(a) / União',
        'Divorciado(a)': 'Divorciado(a)'
      };
      var mappedCivil = civilMap[pqData.civil] || '';
      if (mappedCivil) {
        document.getElementById('f-civil').value = mappedCivil;
        updateConjugeVisibility();
      }
    }

  // Primeiro imóvel (se não possui = primeiro imóvel sim)
  if (pqData.imovel) {
    var isFirst = pqData.imovel === 'Não' ? 'Sim' : 'Não';
    var firstRadio = document.querySelector('input[name="primeiro-imovel"][value="' + isFirst + '"]');
    if (firstRadio) firstRadio.checked = true;
  }
}

// -- FORM SUMMARY --
function buildFormSummary() {
  var nome = sanitizeInput(document.getElementById('f-nome').value.trim()) || '—';
  var tel = sanitizeInput(document.getElementById('f-tel').value.trim()) || '—';
  var cpf = sanitizeInput(document.getElementById('f-cpf').value.trim()) || '—';
  var email = sanitizeInput(document.getElementById('f-email').value.trim()) || '—';
  var nascimento = document.getElementById('f-nascimento').value || '—';
  var trab = document.querySelector('input[name="trabalho"]:checked')?.value || '—';
  var renda = document.getElementById('f-renda').value || '—';
  var pessoasRenda = document.getElementById('f-pessoas-renda').value || '—';
  var fgts = document.querySelector('input[name="fgts"]:checked')?.value || '—';
  var mcmv = document.querySelector('input[name="mcmv"]:checked')?.value || '—';
  var moradia = document.getElementById('f-moradia').value || '—';
  var civil = document.getElementById('f-civil').value || '—';
  var depend = document.getElementById('f-dependentes').value || '—';
  var planta = document.querySelector('input[name="planta"]:checked')?.value || '—';
  var primeiroImovel = document.querySelector('input[name="primeiro-imovel"]:checked')?.value || '—';
  var prazo = document.querySelector('input[name="prazo"]:checked')?.value || '—';

  var pqRendaVal = pqData.renda || '';
  var pqFgtsVal = pqData.fgts || '';
  var pqCidadeVal = pqData.cidade || '';

  var pqSummary = '';
  if (pqCidadeVal || pqRendaVal || pqFgtsVal) {
    pqSummary = '<div class="form-summary-section">' +
      '<div class="form-summary-section-title"><i class="fa-solid fa-clipboard-check"></i> Pr\u00e9-an\u00e1lise</div>' +
      (pqCidadeVal ? '<div class="form-summary-row"><span>Cidade</span><span>' + pqCidadeVal + '</span></div>' : '') +
      (pqRendaVal ? '<div class="form-summary-row"><span>Renda informada</span><span>R$ ' + pqRendaVal + '</span></div>' : '') +
      (pqFgtsVal ? '<div class="form-summary-row"><span>FGTS</span><span>' + pqFgtsVal + '</span></div>' : '') +
    '</div>';
  }

  return pqSummary +
    '<div class="form-summary-section">' +
      '<div class="form-summary-section-title"><i class="fa-solid fa-user"></i> Contato</div>' +
      '<div class="form-summary-row"><span>Nome</span><span>' + nome + '</span></div>' +
      '<div class="form-summary-row"><span>WhatsApp</span><span>' + tel + '</span></div>' +
      (cpf !== '—' ? '<div class="form-summary-row"><span>CPF</span><span>' + cpf + '</span></div>' : '') +
      (email !== '—' ? '<div class="form-summary-row"><span>E-mail</span><span>' + email + '</span></div>' : '') +
    '</div>' +
    '<div class="form-summary-section">' +
      '<div class="form-summary-section-title"><i class="fa-solid fa-briefcase"></i> Perfil financeiro</div>' +
      '<div class="form-summary-row"><span>Tipo de renda</span><span>' + trab + '</span></div>' +
      '<div class="form-summary-row"><span>Renda</span><span>' + renda + '</span></div>' +
      '<div class="form-summary-row"><span>Pessoas na renda</span><span>' + pessoasRenda + '</span></div>' +
    '</div>' +
    '<div class="form-summary-section">' +
      '<div class="form-summary-section-title"><i class="fa-solid fa-house"></i> Im\u00f3vel</div>' +
      '<div class="form-summary-row"><span>FGTS</span><span>' + fgts + '</span></div>' +
      '<div class="form-summary-row"><span>Usou MCMV</span><span>' + mcmv + '</span></div>' +
      '<div class="form-summary-row"><span>Moradia</span><span>' + moradia + '</span></div>' +
      '<div class="form-summary-row"><span>Estado civil</span><span>' + civil + '</span></div>' +
      '<div class="form-summary-row"><span>Dependentes</span><span>' + depend + '</span></div>' +
      '<div class="form-summary-row"><span>Planta</span><span>' + planta + '</span></div>' +
      '<div class="form-summary-row"><span>1\u00ba im\u00f3vel</span><span>' + primeiroImovel + '</span></div>' +
    '</div>' +
    '<div class="form-summary-section">' +
      '<div class="form-summary-section-title"><i class="fa-solid fa-clock"></i> Prefer\u00eancias</div>' +
      '<div class="form-summary-row"><span>Previs\u00e3o</span><span>' + prazo + '</span></div>' +
    '</div>'
  ;
}

function populateFormSummary() {
  var body = document.getElementById('form-summary-body');
  if (!body) return;
  body.innerHTML = buildFormSummary();
}

function submitForm() {
  if (!validateSection(4)) return;
  var overlay = document.getElementById('submit-overlay');
  if (overlay) overlay.classList.add('is-visible');

  populateFormSummary();

  var nome = sanitizeInput(document.getElementById('f-nome').value.trim());
  var cpf = sanitizeInput(document.getElementById('f-cpf').value.trim());
  var tel = sanitizeInput(document.getElementById('f-tel').value.trim());
  var nascimentoRaw = document.getElementById('f-nascimento').value;
  var nascimento = nascimentoRaw ? nascimentoRaw.split('-').reverse().join('/') : '';
  var email = sanitizeInput(document.getElementById('f-email').value.trim());
  var msgAdicional = sanitizeInput(document.getElementById('f-mensagem').value.trim());
  var empreendimento = document.getElementById('f-empreendimento-hidden')?.value || 'n\u00e3o especificado';

  if (nome.length > 100 || msgAdicional.length > 500) {
    if (overlay) overlay.classList.remove('is-visible');
    alert("Comportamento suspeito detectado.");
    return;
  }

  var trab = document.querySelector('input[name="trabalho"]:checked')?.value || '';
  var renda = document.getElementById('f-renda').value;
  var pessoasRenda = document.getElementById('f-pessoas-renda').value;

  var fgts = document.querySelector('input[name="fgts"]:checked')?.value || '';
  var fgtsValor = document.getElementById('f-fgts-valor').value.trim();
  var mcmv = document.querySelector('input[name="mcmv"]:checked')?.value || '';
  var moradia = document.getElementById('f-moradia').value;
  var civil = document.getElementById('f-civil').value;
  var depend = document.getElementById('f-dependentes').value;
  var conjugeRenda = civil === 'Casado(a)'
    ? (document.getElementById('f-conjuge-renda').checked ? 'Sim' : 'Não')
    : '';
  var planta = document.querySelector('input[name="planta"]:checked')?.value || '';
  var primeiroImovel = document.querySelector('input[name="primeiro-imovel"]:checked')?.value || '';
  var entrada = document.getElementById('f-entrada').value.trim();
  var restricao = document.getElementById('f-restricao').value;

  var prazo = document.querySelector('input[name="prazo"]:checked')?.value || '';
  var horario = document.getElementById('f-horario').value || 'Qualquer hor\u00e1rio';
  var origem = document.getElementById('f-origem').value || '';

  var pqRenda = pqData.renda || '';
  var pqFgts = pqData.fgts || '';
  var pqImovel = pqData.imovel || '';
  var pqCivil = pqData.civil || civil;
  var pqCidade = pqData.cidade || '';
  var pqFinanciamento = pqData.financiamento || '';

  function line(label, val) {
    return val && val !== 'N\u00e3o informado' && val !== '' ? '\u2022 ' + label + ': ' + val + '\n' : '';
  }

  function section(title) {
    return '\n\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\n*' + title + '*\n\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\n';
  }

  var msg = '';
  msg += 'Ol\u00E1 Paulo! Preenchi o formul\u00E1rio no site e quero saber mais sobre o *' + empreendimento + '*.\n\n';
  msg += section('Dados Pessoais');
  msg += line('Nome', nome);
  msg += line('WhatsApp', tel);
  if (cpf) msg += line('CPF', cpf);
  if (nascimento) msg += line('Nascimento', nascimento);
  if (email) msg += line('E-mail', email);

  msg += section('Pr\u00E9-An\u00E1lise');
  if (pqCidade) msg += line('Cidade', pqCidade);
  if (pqRenda) msg += line('Renda familiar', pqRenda);
  if (pqFinanciamento) msg += line('Financiamento', pqFinanciamento);
  if (pqFgts) msg += line('Possui FGTS', pqFgts);
  if (pqImovel) msg += line('J\u00E1 possui im\u00F3vel', pqImovel);
  if (pqCivil) msg += line('Estado civil', pqCivil);

  msg += section('Perfil Profissional');
  msg += line('Tipo de renda', trab);
  msg += line('Renda familiar (form)', renda);
  msg += line('Pessoas na renda', pessoasRenda);

  msg += section('Financiamento e Im\u00F3vel');
  msg += line('Empreendimento', empreendimento);
  msg += line('FGTS', fgts);
  if (fgtsValor) msg += line('Valor FGTS aprox', fgtsValor);
  msg += line('Usou Minha Casa Minha Vida', mcmv);
  msg += line('Moradia atual', moradia);
  msg += line('Estado civil (form)', civil);
  msg += line('Dependentes', depend);
  if (conjugeRenda) msg += line('C\u00F4njuge comp\u00F5e renda', conjugeRenda);
  msg += line('Planta de interesse', planta);
  msg += line('Primeiro im\u00F3vel', primeiroImovel);
  if (entrada) msg += line('Entrada dispon\u00EDvel', entrada);
  if (restricao) msg += line('Restri\u00E7\u00E3o CPF', restricao);

  msg += section('Prefer\u00EAncias de Contato');
  msg += line('Prazo para compra', prazo);
  msg += line('Melhor hor\u00E1rio', horario);
  if (origem) msg += line('Como encontrou', origem);
  if (msgAdicional) msg += line('Mensagem extra', msgAdicional);

  var whatsappWindow = window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
  if (whatsappWindow) {
    whatsappWindow.opener = null;
    document.getElementById('form-summary-confirm')?.classList.add('is-visible');
    if (overlay) setTimeout(function() { overlay.classList.remove('is-visible'); }, 4000);
  } else {
    if (overlay) overlay.classList.remove('is-visible');
    window.location.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }
}

// -- SECTION NAV --
const sectionNav = document.getElementById('section-nav');
const scrollSections = [
  document.getElementById('home'),
  document.getElementById('empreendimentos-list'),
  document.getElementById('quem-e-paulo'),
  document.getElementById('videos-institucionais'),
  document.getElementById('contato'),
  document.querySelector('footer')
].filter(function(el) { return el && el.offsetParent !== null; });

let currentScrollSection = 0;
let isGoingUp = false;
let scrollSecObserver = null;

const updateArrow = () => {
  if (!sectionNav) return;
  isGoingUp = currentScrollSection >= scrollSections.length - 1;
  sectionNav.classList.toggle('is-up', isGoingUp);
};

if (sectionNav) {
  sectionNav.addEventListener('click', () => {
    const target = isGoingUp ? scrollSections[0] : scrollSections[Math.min(currentScrollSection + 1, scrollSections.length - 1)];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      currentScrollSection = isGoingUp ? 0 : Math.min(currentScrollSection + 1, scrollSections.length - 1);
      updateArrow();
    }
  });

  scrollSecObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = scrollSections.indexOf(entry.target);
        if (idx !== -1) { currentScrollSection = idx; updateArrow(); }
      }
    });
  }, { threshold: 0.3 });
  scrollSections.forEach(sec => scrollSecObserver.observe(sec));
}

// -- COOKIE CONSENT --
const cookieNotice = document.getElementById('cookie-notice');
const cookieAccept = document.getElementById('cookie-accept');
const cookieRefuse = document.getElementById('cookie-refuse');

const setCookieConsent = (value) => {
  localStorage.setItem('cookie-consent', value);
  if (cookieNotice) cookieNotice.classList.remove('is-visible');
  if (value === 'accepted' && typeof gtag === 'function') {
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
  }
};

if (cookieNotice) {
  if (!localStorage.getItem('cookie-consent')) {
    cookieNotice.classList.add('is-visible');
  }
  if (cookieAccept) cookieAccept.addEventListener('click', () => setCookieConsent('accepted'));
  if (cookieRefuse) cookieRefuse.addEventListener('click', () => setCookieConsent('refused'));
}

// -- HAMBURGER --
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  function closeMobileNav() {
    hamburger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.getElementById('mobile-nav-close')?.addEventListener('click', closeMobileNav);

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

// -- INSTITUTIONAL VIDEOS --
var INST_VIDEOS = [
  { src: 'assets/videos/institucionais/video-01.mp4', title: 'Quem é Paulo Paixão | Seu Corretor de Confiança em Guarulhos' },
  { src: 'assets/videos/institucionais/video-03.mp4', title: 'Por que o Residencial Maro é a Melhor Escolha' },
  { src: 'assets/videos/institucionais/video-05.mp4', title: 'FGTS Parado? Descubra Como Usar na Sua Casa Própria' },
  { src: 'assets/videos/institucionais/video-06.mp4', title: 'Residencial Maro: Conheça as Unidades Disponíveis' },
  { src: 'assets/videos/institucionais/video-04.mp4', title: 'Tour Exclusivo: Conheça Seu Futuro Lar dos Sonhos' },
  { src: 'assets/videos/institucionais/video-07.mp4', title: 'O Apartamento Por Dentro: Acabamento e Qualidade' },
  { src: 'assets/videos/institucionais/video-08.mp4', title: 'Localização Estratégica: Tudo Perto de Você' },
  { src: 'assets/videos/institucionais/video-09.mp4', title: 'Ambiente Decorado: Veja Como Fica o Seu' }
];

var vidCarouselIndex = 0;

function renderVideoCarousel() {
  var track = document.getElementById('vid-carousel-track');
  if (!track) return;

  track.innerHTML = INST_VIDEOS.map(function(v, i) {
    var thumbSrc = v.src.replace('video-', 'thumb-').replace('.mp4', '.jpg');
    return '<div class="vid-carousel-item" data-video-index="' + i + '">' +
      '<div class="vid-thumb-wrap">' +
        '<div class="vid-carousel-item-bg" id="vid-thumb-' + i + '" style="background-image:url(' + thumbSrc + ')"></div>' +
        '<div class="vid-carousel-item-play"><i class="fa-solid fa-play"></i></div>' +
      '</div>' +
      '<div class="vid-carousel-item-info">' +
        '<div class="vid-carousel-item-title">' + v.title + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  track.querySelectorAll('.vid-carousel-item').forEach(function(item) {
    item.addEventListener('click', function() {
      openVideoLightbox(parseInt(item.dataset.videoIndex));
    });
  });

  updateCarouselPositions();
}

function updateCarouselPositions() {
  var items = document.querySelectorAll('.vid-carousel-item');
  var total = items.length;
  
  items.forEach(function(item, i) {
    item.classList.remove('active', 'prev', 'next', 'hidden');
    
    if (i === vidCarouselIndex) {
      item.classList.add('active');
    } else if (i === (vidCarouselIndex - 1 + total) % total) {
      item.classList.add('prev');
    } else if (i === (vidCarouselIndex + 1) % total) {
      item.classList.add('next');
    } else {
      item.classList.add('hidden');
    }
  });
}

var vidAutoplay;
var vidAutoplayTimeout;

function advanceSlide() {
  vidCarouselIndex = (vidCarouselIndex + 1) % INST_VIDEOS.length;
  updateCarouselPositions();
}

function startVidAutoplay() {
  stopVidAutoplay();
  vidAutoplay = setInterval(advanceSlide, 6000);
}

function stopVidAutoplay() {
  clearInterval(vidAutoplay);
  clearTimeout(vidAutoplayTimeout);
}

function delayVidAutoplay() {
  stopVidAutoplay();
  vidAutoplayTimeout = setTimeout(startVidAutoplay, 15000);
}

function carouselNext() {
  advanceSlide();
  delayVidAutoplay();
}

function carouselPrev() {
  vidCarouselIndex = (vidCarouselIndex - 1 + INST_VIDEOS.length) % INST_VIDEOS.length;
  updateCarouselPositions();
  delayVidAutoplay();
}

document.getElementById('vid-carousel-next')?.addEventListener('click', carouselNext);
document.getElementById('vid-carousel-prev')?.addEventListener('click', carouselPrev);

function openVideoLightbox(index) {
  var v = INST_VIDEOS[index];
  if (!v) return;
  var player = document.getElementById('video-lightbox-player');
  var lightbox = document.getElementById('video-lightbox');
  if (!player || !lightbox) return;
  player.src = v.src;
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  player.load();
  player.play().catch(function() {});
}

function closeVideoLightbox() {
  var player = document.getElementById('video-lightbox-player');
  var lightbox = document.getElementById('video-lightbox');
  if (!player || !lightbox) return;
  player.pause();
  player.src = '';
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.getElementById('video-lightbox-close')?.addEventListener('click', closeVideoLightbox);
document.getElementById('video-lightbox')?.addEventListener('click', function(e) {
  if (e.target === this || e.target.classList.contains('video-lightbox-backdrop')) closeVideoLightbox();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeVideoLightbox();
});

// -- LAZY THUMBNAILS --
function generateThumbnailQueue() {
  var queue = INST_VIDEOS.map(function(_, i) { return i; });

  function setFallbackThumb(idx) {
    var el = document.getElementById('vid-thumb-' + idx);
    if (el && !el.style.backgroundImage) {
      el.classList.add('vid-fallback');
    }
  }

  function processNext() {
    if (queue.length === 0) return;
    var idx = queue.shift();
    var video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    video.playsInline = true;
    video.src = INST_VIDEOS[idx].src;

    var done = false;
    var tid = setTimeout(function() {
      if (!done) {
        done = true;
        video.remove();
        setFallbackThumb(idx);
        processNext();
      }
    }, 20000);

    function onSeeked() {
      if (done) return;
      done = true;
      clearTimeout(tid);
      try {
        var vw = video.videoWidth || 640;
        var vh = video.videoHeight || 360;
        var maxDim = 640;
        var scale = Math.min(maxDim / vw, maxDim / vh, 1);
        var cw = Math.round(vw * scale);
        var ch = Math.round(vh * scale);
        var canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        var ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, cw, ch);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        var el = document.getElementById('vid-thumb-' + idx);
        if (el) {
          el.style.backgroundImage = 'url(' + dataUrl + ')';
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
        }
      } catch(e) {
        setFallbackThumb(idx);
      }
      video.remove();
      processNext();
    }

    video.addEventListener('loadeddata', function() {
      video.currentTime = 0.1;
    }, { once: true });

    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', function() {
      if (!done) {
        done = true;
        clearTimeout(tid);
        video.remove();
        setFallbackThumb(idx);
        processNext();
      }
    }, { once: true });

    video.load();
  }

  setTimeout(processNext, 500);
}

renderVideoCarousel();
generateThumbnailQueue();
startVidAutoplay();

// -- HANDLE NAV LINKS FROM PROPERTY VIEW --
document.querySelectorAll('.nav-links a, .footer-links a, .mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (currentPropertyId) {
      showHomeView();
    }
  });
});

// -- POPSTATE HANDLER --
window.addEventListener('popstate', () => {
  if (currentPropertyId && (location.hash === '' || location.hash === '#')) {
    showHomeView();
  }
});

// -- INIT --
updateProgress(1);
renderCards();

// Check URL hash for direct property access
const hash = location.hash.replace('#', '');
if (hash) {
  const empFromHash = EMPREENDIMENTOS.find(e => e.slug === hash);
  if (empFromHash) showPropertyView(empFromHash.id);
}
