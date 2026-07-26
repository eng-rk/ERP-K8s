const fs = require('fs');
const path = require('path');

const ensureDirectories = () => {
  // __dirname is src/utils. Go up two levels to reach the root, then resolve uploads/gov-docs
  const targetDir = path.join(__dirname, '..', '..', 'uploads', 'gov-docs');
  fs.mkdirSync(targetDir, { recursive: true });
};

module.exports = { ensureDirectories };
