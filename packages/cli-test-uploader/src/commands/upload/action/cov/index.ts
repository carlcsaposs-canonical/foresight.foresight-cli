
import { logger } from '@runforesight/foresight-cli-logger';
import { UPLOADER_SIGNED_URL_TYPES } from '../../../../constants';
import { initCoverage } from '../../../../init/cov';
import Upload from '..';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { ConfigNames } from '../../../../config/ConfigNames';
import { MetadataProvider } from '@runforesight/foresight-cli-metadata-provider';
import { COVERAGE_FORMAT_TYPES } from '../../../../constants';

const getAdditinalInfoForCoverage = () => {
    const tags = ConfigProvider.get<{ [key: string]: any }>(ConfigNames.command.general.tag);
    return {
        apiKey: ConfigProvider.get<string>(ConfigNames.general.apiKey),
        projectId: ConfigProvider.get<string>(ConfigNames.general.projectId),
        format: COVERAGE_FORMAT_TYPES[ConfigProvider.get<string>(ConfigNames.command.coverage.format)],
        ...( tags && Object.keys(tags).length ? { userTags: tags }: undefined )
    }
}

export const preAction = async (command: any) => {
    if (!command) {
        logger.error('<PreAction> Command can not be null');
        return;
    }
    
    await initCoverage(command.opts());
};

export const action = async () => {
    let metadata = MetadataProvider(getAdditinalInfoForCoverage());

    function getWorkflowPath() {
        return metadata.workflowRef ? metadata.workflowRef.split('@')[0].replace(new RegExp("/", 'g'), "***").replace(new RegExp("\\\\", 'g'), "***") : undefined;
    }

    let workflowPath = getWorkflowPath();
    let filePath = workflowPath ? `${metadata.commitHash}/${workflowPath}/${metadata.runId}/${metadata.runAttempt}`
        : `${metadata.commitHash}/${metadata.runId}/${metadata.runAttempt}`
    await Promise.all([Upload({
        type: UPLOADER_SIGNED_URL_TYPES.COVERAGE,
        filepath: `${metadata.apiKey}`,
        metadata: metadata
    }), Upload({
        type: UPLOADER_SIGNED_URL_TYPES.COVERAGEV2,
        filepath: filePath,
        metadata: metadata
    })]);
}