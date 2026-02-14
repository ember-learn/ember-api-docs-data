const { readdirSync, rmSync } = require('fs');
const walkSync = require('walk-sync');

const files = readdirSync('rev-index');

const plurals = {
  namespace: 'namespaces',
  class: 'classes',
  module: 'modules',
}

function deleteUnusedFilesForRevIndex(file) {
  const json = require(file);
  
  let project;
  
  if(json.data.id.match(/^ember-\d/)) {
    project = 'ember';
  } else if (json.data.id.match(/^ember-data-\d/)) {
    project = 'ember-data';
  } else if (json.data.id.match(/^ember-cli-\d/)) {
    project = 'ember-cli';
  } else {
    console.log('error figuring out project for', file);
    return;
  }

  const version = json.data.attributes.version;
  const knownFiles = [];
  
  ['module', 'class', 'namespace'].forEach(entity => {
    for (const key in json.meta[entity]) {
      
      
      knownFiles.push(`${plurals[entity]}/${json.meta[entity][key]}.json`);
    }
  })


  const paths = walkSync(`json-docs/${project}/${version}`, { directories: false});

  paths.forEach(file => {
    if (file.startsWith('project-versions/')) {
      // ignore project-versions folder
      return;
    }

    if (file.startsWith('missings/')) {
      // I have no idea what a "missings" is but tests fail if we don't ignore them
      return;
    }

    if(!knownFiles.includes(file)) {
      rmSync(`json-docs/${project}/${version}/${file}`)
    }
  })

}

files.forEach(file => {
  deleteUnusedFilesForRevIndex(`./rev-index/${file}`)
});