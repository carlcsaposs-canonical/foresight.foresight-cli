Thundra Foresight CLI Test Uploader
==========

The Thundra Foresight CLI Test Uploader used to upload test reports to Thundra Foresight.

Installation
======

If ``@thundra/foresight-cli`` installed, don't need to install ``@thundra/foresight-cli-test-uploader``.

```bash
npm install -g @thundra/foresight-cli-test-uploader
```

# Command

* [`thundra-foresight-cli upload-test`] - Upload test results


# Options

| Flag                              | Requirement       | Environment Variable          | Default
| ---                               | ---               | ---                           | ---
| -a, --apiKey <string>             | Required          | THUNDRA_APIKEY                | None
| -p, --projectId <string>          | Required          | THUNDRA_FORESIGHT_PROJECT_ID  | None
| -ud, --uploadDir <string>         | Required          | THUNDRA_UPLOADER_REPORT_DIR   | None
| -f, --framework <enum>            | Required          | THUNDRA_UPLOADER_FRAMEWORK    | None
| -su, --uploaderSignerUrl <string> | Optional          | THUNDRA_UPLOADER_SIGNER_URL   | ThundraSignedUrl
| -ms, --uploaderMaxSize <string>   | Optional          | THUNDRA_FORESIGHT_SIZE_MAX    | 20 MB
| -l, --logLevel <string>           | Optional          | THUNDRA_FORESIGHT_LOG_LEVEL   | error

* THUNDRA_UPLOADER_FRAMEWORK value should be one of the ("TESTNG", "JUNIT", "JEST", "PYTHON", "TRX", "XUNIT2").

Issues
======

For problems directly related to the CLI, [add an issue on GitHub](https://github.com/thundra-io/thundra-foresight-cli/issues/new).

[Contributors](https://github.com/thundra-io/thundra-foresight-cli/contributors)