Thundra Foresight CLI Test Uploader
==========

The Thundra Foresight CLI Test Uploader used to upload JUnit formated test reports to Thundra Foresight.

Installation
======

If ``@thundra/foresight-cli`` installed, don't need to install ``@thundra/foresight-cli-test-uploader``.

```bash
npm install -g @thundra/foresight-cli-test-uploader
```

# Command

* [`thundra-foresight-cli upload-test`] - Upload JUnit formated test results


# Options

| Flag                          | Requirement       | Environment Variable
| ---                           | ---               | ---
| --apiKey <string>             | Required          | THUNDRA_APIKEY
| --projectId <string>          | Required          | THUNDRA_FORESIGHT_PROJECT_ID
| -ud, --uploadDir <string>     | Required          | THUNDRA_UPLOADER_REPORT_DIR
| -f, --framework <enum>        | Required          | THUNDRA_UPLOADER_FRAMEWORK   ("TESTNG", "JUNIT", "JEST", "PYTHON", "TRX", "XUNIT2")


# Environment Variables (Optional)

| Environment Variable          | Requirement       | Default
| ---                           | ---               | ---
| THUNDRA_UPLOADER_SIZE_MAX     | Optional          | 20 MB
| THUNDRA_UPLOADER_LOG_LEVEL    | Optional          | error
| THUNDRA_UPLOADER_SIGNER_URL   | Optional          | Thundra Sign Url


Issues
======

For problems directly related to the CLI, [add an issue on GitHub](https://github.com/thundra-io/thundra-foresight-cli/issues/new).

[Contributors](https://github.com/thundra-io/thundra-foresight-cli/contributors)