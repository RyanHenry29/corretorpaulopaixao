const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcHtml = path.join(
  process.env.USERPROFILE || '',
  'Downloads',
  'ai_studio_code (8) (1).html'
);
const destHtml = path.join(root, 'index.html');
const assetsDir = path.join(root, 'assets');
const destVideo = path.join(assetsDir, 'hero-video.mp4');

const videoCandidates = [
  path.join(process.env.USERPROFILE || '', 'Desktop', 'v2_watermarked-dfe88957-5a98-4502-90c9-bbd6299571ae.mp4'),
  path.join(process.env.USERPROFILE || '', 'Downloads', 'hero-video.mp4'),
];

if (!fs.existsSync(srcHtml)) {
  console.error('Arquivo fonte não encontrado:', srcHtml);
  process.exit(1);
}

fs.mkdirSync(assetsDir, { recursive: true });
fs.copyFileSync(srcHtml, destHtml);

let videoCopied = false;
for (const candidate of videoCandidates) {
  if (fs.existsSync(candidate)) {
    fs.copyFileSync(candidate, destVideo);
    videoCopied = true;
    console.log('Vídeo copiado de:', candidate);
    break;
  }
}

if (!videoCopied) {
  console.warn('Vídeo não encontrado. Copie manualmente para assets/hero-video.mp4');
}

console.log('Site sincronizado:', destHtml);
console.log('Tamanho (bytes):', fs.statSync(destHtml).size);
