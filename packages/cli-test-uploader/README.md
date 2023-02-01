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


### Options

| Flag                                       | Requirement       | Environment Variable                  | Default
| ---                                        | ---               | ---                                   | ---
| -a, --apiKey <string>                      | Required          | FORESIGHT_APIKEY                      | None
| -ud, --uploadDir <string>                  | Required          | FORESIGHT_UPLOADER_REPORT_DIR         | None
| -fw, --framework <enum>                    | Required          | FORESIGHT_UPLOADER_TEST_FRAMEWORK     | None
| -fm, --format <enum>                       | Required          | FORESIGHT_UPLOADER_TEST_FORMAT        | None
| -su, --signerUrl <string>                  | Optional          | FORESIGHT_UPLOADER_SIGNER_URL         | ForesightSignedUrl
| -upms, --uploadMaxSize <string>            | Optional          | FORESIGHT_UPLOADER_SIZE_MAX           | 20 MB
| -uptout, --uploadProcessTimeout <string>   | Optional          | FORESIGHT_UPLOAD_PROCESS_TIMEOUT      | 30000 ms
| -uptp, --uploadTrackProgress <string>      | Optional          | FORESIGHT_UPLOAD_TRACK_PROGRESS       | true
| -apsmd, --archiveScanPathMaxDepth <string> | Optional          | FORESIGHT_SCAN_PATH_MAX_DEPTH         | 5
| -aptout, --archiveProcessTimeout <string>  | Optional          | FORESIGHT_ARCHIVE_PROCESS_TIMEOUT     | 30000 ms
| -p, --projectId <string>                   | Optional          | FORESIGHT_PROJECT_ID                  | None
| -l, --logLevel <string>                    | Optional          | FORESIGHT_LOG_LEVEL                   | info

** FORESIGHT_UPLOADER_TEST_FRAMEWORK value should be one of the ("TESTNG", "JUNIT", "JEST", "PYTEST", "XUNIT2", 
"CYPRESS", "MOCHA", "ELIXIR"). \
** FORESIGHT_UPLOADER_TEST_FORMAT value should be one of the ("JUNIT", "TRX").

* [`foresight-cli upload-test-coverage`] - Upload test coverage results

### Options

| Flag                                       | Requirement       | Environment Variable                  | Default
| ---                                        | ---               | ---                                   | ---
| -a, --apiKey <string>                      | Required          | FORESIGHT_APIKEY                      | None
| -ud, --uploadDir <string>                  | Required          | FORESIGHT_UPLOADER_REPORT_DIR         | None
| -fm, --format <enum>                       | Required          | FORESIGHT_UPLOADER_COVERAGE_FORMAT    | None
| -su, --signerUrl <string>                  | Optional          | FORESIGHT_UPLOADER_SIGNER_URL         | ForesightSignedUrl
| -upms, --uploadMaxSize <string>            | Optional          | FORESIGHT_UPLOADER_SIZE_MAX           | 20 MB
| -uptout, --uploadProcessTimeout <string>   | Optional          | FORESIGHT_UPLOAD_PROCESS_TIMEOUT      | 30000 ms
| -uptp, --uploadTrackProgress <string>      | Optional          | FORESIGHT_UPLOAD_TRACK_PROGRESS       | true
| -apsmd, --archiveScanPathMaxDepth <string> | Optional          | FORESIGHT_SCAN_PATH_MAX_DEPTH         | 5
| -aptout, --archiveProcessTimeout <string>  | Optional          | FORESIGHT_ARCHIVE_PROCESS_TIMEOUT     | 30000 ms
| -p, --projectId <string>                   | Optional          | FORESIGHT_PROJECT_ID                  | None
| -l, --logLevel <string>                    | Optional          | FORESIGHT_LOG_LEVEL                   | info

** FORESIGHT_UPLOADER_TEST_FORMAT value should be one of the ("JACOCO/XML", "COBERTURA/XML", "GOLANG").

Issues
======

For problems directly related to the CLI, [add an issue on GitHub](https://github.com/runforesight/foresight-cli/issues/new).

[Contributors](https://github.com/runforesight/foresight-cli/contributors)