const Joi = require('joi');

const MetadataSchema = Joi.object()
    .keys({
        apiKey: Joi.string().required(),
        cliRunId:Joi.string().required(),
        environment: Joi.string().required(),
        repoURL: Joi.string().required(),
        repoName: Joi.string().required(),
        repoFullName: Joi.string().required(),
        branch: Joi.string().required().allow(''),
        commitHash: Joi.string().required().allow(''),
        commitMessage: Joi.string().required().allow(''),
        createdAt: Joi.number().required(),
        root: Joi.string(),
        framework: Joi.string(),
        format: Joi.string(),
        projectId: Joi.string(),
        runId: Joi.string(),
        runAttempt: Joi.string(),
        jobId: Joi.string(),
        jobName: Joi.string(),
        runnerName: Joi.string(),
        host: Joi.string(),
    })


module.exports = {
    MetadataSchema,
}