// -- CONSTANTS --
const WA_NUMBER = '5511984042039';
const VALID_PLANTAS = ['Studio', '2 Dorms Sem Vaga', '2 Dorms Com Vaga', '2 Dorms Com Suite'];

// -- STRONGER SANITIZE --
const sanitizeInput = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/[<>'"\\;$%+]/g, '')
    .trim();
};

// -- PLANTA VALIDATION --
const applyPlantaInteresse = (planta) => {
  if (!planta || !VALID_PLANTAS.includes(planta)) return;
  const radios = document.querySelectorAll('input[name="planta"]');
  radios.forEach(r => {
    if (r.value === planta) r.checked = true;
  });
};
    // ── NAV SCROLL ──
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ── HERO VÍDEO (loop + fallback visual para mobile/rede lenta) ──
    const heroVideo = document.getElementById('hero-video');
    const videoWrapper = document.getElementById('video-wrapper');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroVideo && videoWrapper) {
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      heroVideo.playsInline = true;
      heroVideo.setAttribute('playsinline', '');
      heroVideo.setAttribute('webkit-playsinline', '');

      const showVideoFrame = () => {
        videoWrapper.classList.add('video-ready');
        videoWrapper.classList.remove('video-error');
      };

      const keepFallback = () => {
        videoWrapper.classList.add('video-error');
        videoWrapper.classList.remove('video-ready');
        heroVideo.pause();
      };

      const playHero = () => {
        if (document.hidden) return;
        const playPromise = heroVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(showVideoFrame).catch(() => {
            videoWrapper.classList.remove('video-ready');
          });
        }
      };

      if (heroVideo.readyState >= 2) showVideoFrame();
      heroVideo.addEventListener('loadeddata', showVideoFrame);
      heroVideo.addEventListener('canplay', playHero);
      heroVideo.addEventListener('playing', showVideoFrame);
      heroVideo.addEventListener('error', keepFallback);
      document.addEventListener('touchstart', playHero, { once: true, passive: true });
      document.addEventListener('click', playHero, { once: true });
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) playHero();
      });
      playHero();

      const heroSection = document.getElementById('home');
      const canScrubHeroVideo = window.innerWidth >= 768;
      let scrubFrameRequest = null;

      let scrubCache = { progress: -1 };

      const syncHeroVideoFrame = () => {
        scrubFrameRequest = null;
        if (!heroSection || !Number.isFinite(heroVideo.duration) || heroVideo.duration <= 0) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        const heroTop = heroSection.offsetTop || 0;
        const scrubRange = Math.max(window.innerHeight || 1, heroSection.offsetHeight || 1);
        const progress = Math.min(1, Math.max(0, (scrollTop - heroTop) / scrubRange));

        if (Math.abs(progress - scrubCache.progress) < 0.02) return;
        scrubCache.progress = progress;

        const targetTime = progress * Math.max(0, heroVideo.duration - 0.08);
        if (Math.abs(heroVideo.currentTime - targetTime) > 0.04) {
          try { heroVideo.currentTime = targetTime; } catch (_) {}
        }
      };

      const requestHeroVideoFrameSync = () => {
        if (scrubFrameRequest !== null) return;
        scrubFrameRequest = requestAnimationFrame(syncHeroVideoFrame);
      };

      if (canScrubHeroVideo && heroSection) {
        videoWrapper.classList.add('scroll-scrub-ready');
        heroVideo.addEventListener('loadedmetadata', requestHeroVideoFrameSync);
        window.addEventListener('scroll', requestHeroVideoFrameSync, { passive: true });
        window.addEventListener('resize', requestHeroVideoFrameSync);
        requestHeroVideoFrameSync();
      }
    }

    // ── PARALLAX suave no vídeo (desktop, sem conflitar com zoom) ──
    if (videoWrapper && window.innerWidth >= 768 && !reducedMotion) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * -18;
        const y = (e.clientY / window.innerHeight - 0.5) * -18;
        videoWrapper.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    // ── REVEAL ON SCROLL ──
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

    // ── MASKS ──
    const cpfInput = document.getElementById('f-cpf');
    cpfInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3);
      if (v.length > 7) v = v.slice(0, 7) + '.' + v.slice(7);
      if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11);
      e.target.value = v;
    });

    const telInput = document.getElementById('f-tel');
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
      e.target.value = v;
    });

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
    document.querySelectorAll('input[name="fgts"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const temFgts = document.querySelector('input[name="fgts"]:checked')?.value === 'Sim';
        fgtsValorWrap.hidden = !temFgts;
        if (!temFgts) document.getElementById('f-fgts-valor').value = '';
      });
    });

    const civilSelect = document.getElementById('f-civil');
    const conjugeWrap = document.getElementById('conjuge-wrap');
    function updateConjugeVisibility() {
      const casado = civilSelect.value === 'Casado(a)';
      conjugeWrap.hidden = !casado;
      if (!casado) document.getElementById('f-conjuge-renda').checked = false;
    }
    civilSelect.addEventListener('change', updateConjugeVisibility);

    document.querySelectorAll('.tipo-cta[data-planta]').forEach(link => {
      link.addEventListener('click', () => {
        sessionStorage.setItem('plantaInteresse', link.dataset.planta);
        applyPlantaInteresse(link.dataset.planta);
      });
    });
    const plantaFromUrl = new URLSearchParams(location.search).get('planta');
    const plantaFromStore = sessionStorage.getItem('plantaInteresse');
    applyPlantaInteresse(plantaFromUrl || plantaFromStore);

    // ── FORM LOGIC ──
    let currentSection = 1;

    function updateProgress(section) {
      for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`p-step-${i}`);
        const label = document.getElementById(`p-label-${i}`);
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
      const card = document.querySelector('.form-card');
      if (!card) return;
      requestAnimationFrame(() => {
        const navHeight = document.getElementById('nav')?.getBoundingClientRect().height || 0;
        const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: Math.max(0, cardTop - navHeight - 44), behavior: 'smooth' });
      });
    }

    function nextStep(section) {
      if (!validateSection(section)) return;
      document.getElementById(`sec-${section}`).classList.remove('active');
      currentSection = section + 1;
      document.getElementById(`sec-${currentSection}`).classList.add('active');
      updateProgress(currentSection);
      scrollToFormCard();
    }

    function prevStep(section) {
      document.getElementById(`sec-${section}`).classList.remove('active');
      currentSection = section - 1;
      document.getElementById(`sec-${currentSection}`).classList.add('active');
      updateProgress(currentSection);
      scrollToFormCard();
    }

    document.querySelectorAll('a[href="#formulario"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        history.pushState(null, '', '#formulario');
        scrollToFormCard();
      });
    });

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

    if (location.hash === '#formulario') {
      setTimeout(scrollToFormCard, 100);
    }

    function submitForm() {
      if (!validateSection(4)) return;

      const nome = sanitizeInput(document.getElementById('f-nome').value.trim());
      const cpf = sanitizeInput(document.getElementById('f-cpf').value.trim()) || 'Não informado';
      const tel = sanitizeInput(document.getElementById('f-tel').value.trim());
      const nascimentoRaw = document.getElementById('f-nascimento').value;
      const nascimento = nascimentoRaw ? nascimentoRaw.split('-').reverse().join('/') : 'N\u00e3o informado';
      const email = sanitizeInput(document.getElementById('f-email').value.trim()) || 'Não informado';
      const msgAdicional = sanitizeInput(document.getElementById('f-mensagem').value.trim());

      // Anti-spam check
      if (nome.length > 100 || msgAdicional.length > 500) {
        alert("Comportamento suspeito detectado.");
        return;
      }

      const trab = document.querySelector('input[name="trabalho"]:checked')?.value || '';
      const renda = document.getElementById('f-renda').value;
      const pessoasRenda = document.getElementById('f-pessoas-renda').value;

      const fgts = document.querySelector('input[name="fgts"]:checked')?.value || '';
      const fgtsValor = document.getElementById('f-fgts-valor').value.trim() || 'Não informado';
      const mcmv = document.querySelector('input[name="mcmv"]:checked')?.value || '';
      const moradia = document.getElementById('f-moradia').value;
      const civil = document.getElementById('f-civil').value;
      const depend = document.getElementById('f-dependentes').value;
      const conjugeRenda = civil === 'Casado(a)'
        ? (document.getElementById('f-conjuge-renda').checked ? 'Sim' : 'Não')
        : '—';
      const planta = document.querySelector('input[name="planta"]:checked')?.value || '';
      const primeiroImovel = document.querySelector('input[name="primeiro-imovel"]:checked')?.value || '';
      const entrada = document.getElementById('f-entrada').value.trim() || 'Não informado';
      const restricao = document.getElementById('f-restricao').value || 'Não informado';

      const prazo = document.querySelector('input[name="prazo"]:checked')?.value || '';
      const horario = document.getElementById('f-horario').value || 'Qualquer horário';
      const origem = document.getElementById('f-origem').value || 'Não informado';
      const lgpdOfertas = document.getElementById('f-lgpd-ofertas').checked ? 'Sim' : 'Não';

      const msg = encodeURIComponent(
        `Ol\u00e1 Paulo! Preenchi o formul\u00e1rio no site e quero entender minhas op\u00e7\u00f5es para o Residencial Maro. Seguem meus dados:\n\n` +
        `--- *DADOS PESSOAIS* ---\n` +
        `- Nome: ${nome}\n` +
        `- CPF: ${cpf}\n` +
        `- WhatsApp: ${tel}\n` +
        `- Nascimento: ${nascimento}\n` +
        `- E-mail: ${email}\n\n` +
        `--- *PERFIL PROFISSIONAL* ---\n` +
        `- Tipo de renda: ${trab}\n` +
        `- Renda familiar: ${renda}\n` +
        `- Pessoas na renda: ${pessoasRenda}\n\n` +
        `--- *FINANCIAMENTO E IM\u00d3VEL* ---\n` +
        `- Possui FGTS: ${fgts} (Valor aprox: ${fgtsValor})\n` +
        `- J\u00e1 usou Minha Casa Minha Vida: ${mcmv}\n` +
        `- Moradia atual: ${moradia}\n` +
        `- Estado civil: ${civil}\n` +
        `- Dependentes: ${depend}\n` +
        `- C\u00f4njuge comp\u00f5e renda: ${conjugeRenda}\n` +
        `- Planta de interesse: ${planta}\n` +
        `- 1\u00ba Im\u00f3vel: ${primeiroImovel}\n` +
        `- Entrada dispon\u00edvel: ${entrada}\n` +
        `- Restri\u00e7\u00e3o CPF: ${restricao}\n\n` +
        `--- *PREFER\u00caNCIAS DE CONTATO* ---\n` +
        `- Prazo p/ compra: ${prazo}\n` +
        `- Melhor hor\u00e1rio: ${horario}\n` +
        `- Como encontrou: ${origem}\n` +
        (msgAdicional ? `- Mensagem extra: ${msgAdicional}\n` : '')
      );

      const whatsappWindow = window.open(`https://wa.me/5511984042039?text=${msg}`, '_blank', 'noopener,noreferrer');
      if (whatsappWindow) whatsappWindow.opener = null;
    }

    // ── NAVEGACAO ENTRE SECOES ──
    const sectionNav = document.getElementById('section-nav');
    const scrollSections = [
      document.getElementById('home'),
      document.getElementById('empreendimento'),
      document.getElementById('tipologias'),
      document.getElementById('mcmv'),
      document.getElementById('localizacao'),
      document.getElementById('corretor'),
      document.getElementById('contato'),
      document.querySelector('footer')
    ].filter(Boolean);

    let currentScrollSection = 0;
    let isGoingUp = false;

    const updateArrow = () => {
      isGoingUp = currentScrollSection >= scrollSections.length - 1;
      sectionNav.classList.toggle('is-up', isGoingUp);
    };

    sectionNav.addEventListener('click', () => {
      const target = isGoingUp ? scrollSections[0] : scrollSections[Math.min(currentScrollSection + 1, scrollSections.length - 1)];
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      currentScrollSection = isGoingUp ? 0 : Math.min(currentScrollSection + 1, scrollSections.length - 1);
      updateArrow();
    });

    const scrollSecObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = scrollSections.indexOf(entry.target);
          if (idx !== -1) { currentScrollSection = idx; updateArrow(); }
        }
      });
    }, { threshold: 0.3 });
    scrollSections.forEach(sec => scrollSecObserver.observe(sec));

    updateProgress(1);
// -- COOKIE CONSENT --
const cookieNotice = document.getElementById('cookie-notice');
const cookieAccept = document.getElementById('cookie-accept');
const cookieRefuse = document.getElementById('cookie-refuse');

const setCookieConsent = (value) => {
  localStorage.setItem('cookie-consent', value);
  cookieNotice.classList.remove('is-visible');
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
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// -- SUBMIT OVERLAY --
const showSubmitOverlay = () => {
  const overlay = document.getElementById('submit-overlay');
  if (overlay) overlay.classList.add('is-visible');
};

const hideSubmitOverlay = () => {
  const overlay = document.getElementById('submit-overlay');
  if (overlay) overlay.classList.remove('is-visible');
};

// Patch the existing submitForm to show/hide overlay
const originalSubmit = window.submitForm;
if (typeof originalSubmit === 'function') {
  window.submitForm = function() {
    showSubmitOverlay();
    setTimeout(() => {
      try { originalSubmit(); } catch(e) { hideSubmitOverlay(); }
      setTimeout(hideSubmitOverlay, 3000);
    }, 800);
  };
}

