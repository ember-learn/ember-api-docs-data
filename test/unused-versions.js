const walkSync = require('walk-sync');
const { readFileSync, writeFileSync, existsSync, readdirSync } = require('fs');
const { expect } = require('chai');
const {basename}= require('path');

const projectVersionPairs = require('./helpers/project-versions');

const projects = {
  'ember': projectVersionPairs.filter(item => item[0] === 'ember').map(item => item[1]), 
  'ember-data': projectVersionPairs.filter(item => item[0] === 'ember-data').map(item => item[1])
};


const folders = [];

// we only need the latest patch from a minor version
describe('Prevent adding all patch versions of a minor', function() {

  describe('json-docs folders', function() {
    for (let project in projects) {
      const projectVersions = projects[project];
      const jsonDocsFolders = readdirSync(`json-docs/${project}`).filter(item => item !== 'projects');

      for(let jsonDocsFolder of jsonDocsFolders) {
        it(`json-docs folder should only have the latest patch: ${project} ${jsonDocsFolder}`, function() {
          if(!projectVersions.includes(jsonDocsFolder)) {
            folders.push(`json-docs/${project}/${jsonDocsFolder}`);
            throw new Error("this is not the only patch version");
          }
        })
      }
    }
  })

  describe('s3-docs folders', function() {
    for (let project in projects) {
      const projectVersions = projects[project];
      const s3Files = walkSync('s3-docs').filter(item => item.endsWith(`${project}-docs.json`));

      for(let s3File of s3Files) {
        it(`s3-docs file should only have the latest patch: ${project} ${s3File}`, function() {
          let [version] = s3File.split('/');
          version = version.replace(/^v/, '');

          if(!projectVersions.includes(version)) {
            folders.push(`s3-docs/v${version}/${project}-docs.json`);
            throw new Error("this is not the only patch version");
          }
        })
      }
    }
  })

  describe('rev-index files', function() {
    for (let project in projects) {
      const projectVersions = projects[project];
      const revIndexFiles = readdirSync(`rev-index`).filter(item => item.match(new RegExp(`^${project}-\\d`)));

      for(let revIndexFile of revIndexFiles){
        it(`rev-index file sould only have the latest patch: ${project} ${revIndexFile}`, function() {
          const match = revIndexFile.match(/[\w-]+-(\d+\.\d+\.\d+).json/)
          if(match && !projectVersions.includes(match[1])) {

            folders.push(`rev-index/${revIndexFile}`);
            throw new Error("this is not the only patch version");
          }
        })
      }
    }
  })

  

  // if you want to bulk delete the duplicate files you can uncomment this
  // and then run `cat unused-folders.txt | xargs rm -r` to delete them
  after(function() {
    writeFileSync('unused-folders.txt', folders.join('\n'));
  })
})