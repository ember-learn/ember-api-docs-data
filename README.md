# Ember API Docs Data

![Sync with S3](https://github.com/ember-learn/ember-api-docs-data/workflows/Sync%20with%20S3/badge.svg)

The content of this repository is synced to the `s3://api-docs.emberjs.com`
S3 bucket via a [GitHub Action](./github/workflows/sync.yml). That data is
consumed by the [ember-api-docs frontend](https://github.com/ember-learn/ember-api-docs).

The content in this repository is generated via
[ember-jsonapi-docs](https://github.com/ember-learn/ember-jsonapi-docs). To build new versions of the files for this repository follow the instructions in `ember-jsonapi-docs`'s [README](https://github.com/ember-learn/ember-jsonapi-docs).

If you want to see how this content will look in the `ember-api-docs` frontend in your local environment follow [these instructions](https://github.com/ember-learn/ember-jsonapi-docs#optional-view-the-generated-docs-in-a-web-app).
