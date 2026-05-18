const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS = path.join(ROOT, 'src', 'components');
const OUTPUT = path.join(ROOT, 'index.html');

const COMPONENT_ORDER = [
  'head.html',
  'body-open.html',
  'whatsapp-float.html',
  'nav.html',
  'hero.html',
  'localizacao.html',
  'about.html',
  'galeria.html',
  'lazer.html',
  'tipologias.html',
  'vantagens.html',
  'cta-banner.html',
  'corretor.html',
  'form.html',
  'footer.html',
  'body-close.html',
];

const TEMPLATES = {
  'head.html': () => readComponent('head.html'),
  'body-open.html': () => '<body>\n',
  'whatsapp-float.html': () => readComponent('whatsapp-float.html'),
  'nav.html': () => readComponent('nav.html'),
  'hero.html': () => readComponent('hero.html'),
  'localizacao.html': () => readComponent('localizacao.html'),
  'about.html': () => readComponent('about.html'),
  'galeria.html': () => readComponent('galeria.html'),
  'lazer.html': () => readComponent('lazer.html'),
  'tipologias.html': () => readComponent('tipologias.html'),
  'vantagens.html': () => readComponent('vantagens.html'),

  'cta-banner.html': () => readComponent('cta-banner.html'),
  'corretor.html': () => readComponent('corretor.html'),
  'form.html': () => readComponent('form.html'),
  'footer.html': () => readComponent('footer.html'),
  'body-close.html': () => '  <script src="src/js/main.js"></script>\n</body>\n</html>\n',
};

function readComponent(name) {
  const p = path.join(COMPONENTS, name);
  if (!fs.existsSync(p)) {
    console.warn('Componente não encontrado:', name);
    return '<!-- MISSING: ' + name + ' -->\n';
  }
  return fs.readFileSync(p, 'utf-8') + '\n';
}

function build() {
  const parts = ['<!DOCTYPE html>\n<html lang="pt-BR">\n'];

  for (const name of COMPONENT_ORDER) {
    const fn = TEMPLATES[name];
    if (!fn) {
      console.warn('Template não definido para:', name);
      continue;
    }
    parts.push(fn());
  }

  const html = parts.join('');
  fs.writeFileSync(OUTPUT, html, 'utf-8');
  console.log('index.html gerado em', OUTPUT);
}

build();
