const walkSync = require('walk-sync');

const { renameSync, mkdirSync } = require('fs');

const { dirname, join } = require('path');

const paths = walkSync('json-docs');

paths.forEach(p => {
  if(p.includes('%')) {
    const newFile = decodeURIComponent(p);

    mkdirSync(join('json-docs', dirname(newFile)), { recursive: true });

    renameSync(join('json-docs', p), join('json-docs', newFile));
  }
})