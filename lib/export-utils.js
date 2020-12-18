const axios = require('axios');
const claAssistantConstants = require('./cla-assistant-constants');

class ExportUtils {
    static getAllSigningsUrl(
        claAssistantApiBaseUrl = claAssistantConstants.DEFAULT_API_BASE_URL
    ) {
        if (!claAssistantApiBaseUrl || !claAssistantApiBaseUrl.length) {
            throw new Error('claAssistantApiBaseUrl is invalid');
        }
        claAssistantApiBaseUrl = claAssistantApiBaseUrl
            .trim()
            .toLocaleLowerCase();
        if (!claAssistantApiBaseUrl.endsWith('/')) {
            claAssistantApiBaseUrl = claAssistantApiBaseUrl + '/';
        }
        return claAssistantApiBaseUrl + claAssistantConstants.GET_ALL_URL_PATH;
    }

    static async getAllSignings(
        gitHubPersonalAccessToken,
        gitHubRepositoryId,
        claGistUrl,
        claGistShared = true,
        claGistVersion,
        claAssistantApiBaseUrl = claAssistantConstants.DEFAULT_API_BASE_URL
    ) {
        if (
            !gitHubPersonalAccessToken ||
            !gitHubPersonalAccessToken.trim().length
        ) {
            const envGitHubPersonalAccessToken = process.env.CLA_ASSISTANT_UTILS_GITHUB_PERSONAL_ACCESS_TOKEN;
            if (envGitHubPersonalAccessToken && envGitHubPersonalAccessToken.trim().length) {
                gitHubPersonalAccessToken = envGitHubPersonalAccessToken;
            } else {
                throw new Error('gitHubPersonalAccessToken is invalid');
            }
        }

        if (!gitHubRepositoryId || !gitHubRepositoryId.trim().length) {
            throw new Error('gitHubRepositoryId is invalid');
        }

        if (!claGistUrl || !claGistUrl.trim().length) {
            throw new Error('claGistUrl is invalid');
        }

        const url = ExportUtils.getAllSigningsUrl(claAssistantApiBaseUrl);
        const body = {
            repoId: gitHubRepositoryId.trim(),
            gist: {
                gist_url: claGistUrl.trim(),
            },
            sharedGist: claGistShared,
        };
        if (claGistVersion && claGistVersion.trim().length) {
            body.gist['gist_version'] = claGistVersion.trim();
        }

        const response = await axios
            .post(url, body, {
                headers: {
                    'x-token': gitHubPersonalAccessToken.trim(),
                },
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                const message = error
                    ? error.response
                        ? error.response.status +
                          '/' +
                          error.response.statusText
                        : error.message
                    : 'Unknown';
                throw new Error('Unable to retrieve signings: ' + message);
            });

        if (!response || response.status != 200) {
            throw new Error(
                'Unable to retrieve signings: ' +
                    response.status +
                    '/' +
                    response.statusText
            );
        }

        return response.data ? response.data : [];
    }
}

module.exports = ExportUtils;
