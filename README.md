# thundra-foresight-cli
Thundra Foresight CLI

```js
npm run bootstrap
cd packages/artifact-upload
npm run compile
npm i -g .
THUNDRA_UPLOADER_SIGNER_URL='https://jw9s714c5c.execute-api.eu-west-1.amazonaws.com/signedurl' THUNDRA_APIKEY='api-key' thundra upload --testProjectId='test-id' -ud ./tmp --type=TEST

