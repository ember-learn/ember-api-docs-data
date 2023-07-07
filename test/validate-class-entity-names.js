const walkSync = require('walk-sync');
const { readFileSync } = require('fs');
const { expect } = require('chai');

const projectVersionPairs = require('./helpers/project-versions');

describe('All Class methods events and properies have names', function() {
  for(let projectVersion of projectVersionPairs) {
    const [project, version] = projectVersion;

    const paths = walkSync(`json-docs/${project}/${version}`, {
      globs: ['classes/*.json', 'namespaces/*.json']
    })

    for(let path of paths) {
      it(`File: ${path} has names for all entities`, function() {
        const json = JSON.parse(readFileSync(`json-docs/${project}/${version}/${path}`));
        
        ['methods', 'events', 'properties'].forEach((entity) => {
          json.data.attributes[entity]?.forEach(item => {
            expect(item.name).to.not.be.empty;
          })
        });
      })
    }
  }
})