const { readdirSync, writeFileSync } = require('fs');

const files = readdirSync('rev-index');

files.forEach(file => {
  const json = require(`./rev-index/${file}`);

  let changed = false;

  ['module', 'class', 'namespace'].forEach(entity => {
    for (const key in json.meta[entity]) {
      if(key.includes('%')) {
        json.meta[entity][decodeURIComponent(key)] = decodeURIComponent(json.meta[entity][key]);
        
        delete json.meta[entity][key];
        changed = true;
      }
    }
  })


  
  if (changed) {
    writeFileSync(`./rev-index/${file}`, JSON.stringify(json));
  }
})