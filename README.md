# Ember API Docs Data

![Sync with S3](https://github.com/ember-learn/ember-api-docs-data/workflows/Sync%20with%20S3/badge.svg)

The content of this repository is synced to the `s3://api-docs.emberjs.com`
S3 bucket via a [GitHub Action](./github/workflows/sync.yml). The data is
consumed by the [API Docs Viewer](https://github.com/ember-learn/ember-api-docs).

These files are auto-generated via
https://github.com/ember-learn/ember-jsonapi-docs

## Previewing these docs in the front end

If you want to see how these docs will look in the
front end app:

```
git clone https://github.com/ember-learn/ember-api-docs-data
cd ember-api-docs-data
yarn install
yarn serve

cd ..
git clone https://github.com/ember-learn/ember-api-docs
cd ember-api-docs-data
yarn install
yarn start:local
```

The JSON files will be served at `http://localhost:5050` and the app can be viewed in the browser at [http://localhost:4200]().
