const walkSync = require('walk-sync');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { expect } = require('chai');
const {basename}= require('path');

const projectVersionPairs = require('./helpers/project-versions');

const files = [];

describe('Preventing duplicate files', function() {
  for(let projectVersion of projectVersionPairs) {
    const [project, version] = projectVersion;

    const revIndex = JSON.parse(readFileSync(`rev-index/${project}-${version}.json`));
    const linkedClasses = Object.values(revIndex.meta.class);
    const linkedNamespaces = Object.values(revIndex.meta.namespace || {});

    const classes = walkSync(`json-docs/${project}/${version}/classes`).filter((f) => !f.endsWith('/'));

    const classNames = new Map();

    for (let fileClass of classes) {
      it(`Class file ${fileClass} is not linked in rev-index`, function () {
        if (!linkedClasses.includes(fileClass.replace(/\.json$/, ''))) {
          files.push(`json-docs/${project}/${version}/classes/${fileClass}`);
          throw new Error('file not linked in rev-index');
        }
      })
    }

    if(existsSync(`json-docs/${project}/${version}/namespaces`)) {
      const namespaces = walkSync(`json-docs/${project}/${version}/namespaces`).filter((f) => !f.endsWith('/'));
  
      const namespaceNames = new Map();
  
      for (let fileClass of namespaces) {
        it(`Namespace file ${fileClass} is not linked in rev-index`, function () {
          if (!linkedNamespaces.includes(fileClass.replace(/\.json$/, ''))) {
            files.push(`json-docs/${project}/${version}/namespaces/${fileClass}`);
            throw new Error('file not linked in rev-index');
          }
        })
      }
    }


    // // if you want to bulk delete the duplicate files you can uncomment this
    // // and then run `cat duplicate-files.txt | xargs rm` to delete them
    // after(function() {
    //   writeFileSync('duplicate-files.txt', files.join('\n'));
    // })
  }
})