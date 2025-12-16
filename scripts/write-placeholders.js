const fs = require('fs');
const path = require('path');
const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const files = ['icon.png','android-icon-foreground.png','android-icon-background.png','android-icon-monochrome.png','favicon.png','splash-icon.png'];
const dir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
for (const f of files) {
  fs.writeFileSync(path.join(dir, f), Buffer.from(b64, 'base64'));
}
console.log('placeholders written');
