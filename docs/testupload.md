Foresight CLI Test Uploader
==========

The Foresight CLI Test Uploader used to upload test reports to Foresight.

Installation
======

If ``@runforesight/foresight-cli`` installed, don't need to install ``@runforesight/foresight-cli-test-uploader``.

```bash
npm install -g @runforesight/foresight-cli-test-uploader
```

# Command

* [`foresight-cli upload-test`] - Upload test results


# Options

| Flag                              | Requirement       | Environment Variable            | Default
| ---                               | ---               | ---                             | ---
| -a, --apiKey <string>             | Required          | FORESIGHT_APIKEY                | None
| -p, --projectId <string>          | Required          | FORESIGHT_PROJECT_ID            | None
| -ud, --uploadDir <string>         | Required          | FORESIGHT_UPLOADER_REPORT_DIR   | None
| -f, --framework <enum>            | Required          | FORESIGHT_UPLOADER_FRAMEWORK    | None
| -su, --uploaderSignerUrl <string> | Optional          | FORESIGHT_UPLOADER_SIGNER_URL   | ForesightSignedUrl
| -ms, --uploaderMaxSize <string>   | Optional          | FORESIGHT_FORESIGHT_SIZE_MAX    | 20 MB
| -l, --logLevel <string>           | Optional          | FORESIGHT_FORESIGHT_LOG_LEVEL   | error

* FORESIGHT_UPLOADER_FRAMEWORK value should be one of the ("TESTNG", "JUNIT", "JEST", "PYTHON", "TRX", "XUNIT2").

Issues
======

For problems directly related to the CLI, [add an issue on GitHub](https://github.com/runforesight/foresight-cli/issues/new).

[Contributors](https://github.com/runforesight/foresight-cli/contributors)