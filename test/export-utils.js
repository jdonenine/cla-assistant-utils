const expect = require('chai').expect;
const ExportUtils = require('../lib/export-utils');

describe('ExportUtils', function () {
    describe('getAllSigningsUrl', function () {
        it('should throw error when claAssistantApiBaseUrl parameter is empty', function () {
            expect(() => ExportUtils.getAllSigningsUrl('')).to.throw(Error);
        });

        it('should be default when claAssistantApiBaseUrl parameter is not present', function () {
            expect(ExportUtils.getAllSigningsUrl()).to.equal(
                'https://cla-assistant.io/api/cla/getAll'
            );
        });

        it('should include suffix when claAssistantApiBaseUrl parameter is present', function () {
            expect(
                ExportUtils.getAllSigningsUrl('https://api.example.com/')
            ).to.equal('https://api.example.com/api/cla/getAll');
        });

        it('should include appended slash and suffix when claAssistantApiBaseUrl parameter is present without a trailing slash', function () {
            expect(
                ExportUtils.getAllSigningsUrl('https://api.example.com')
            ).to.equal('https://api.example.com/api/cla/getAll');
        });
    });

    describe('getAllSignings', function () {
        it('should throw error when no parameters are provided', async function () {
            var caughtError = false;
            try {
                const ret = await ExportUtils.getAllSignings();
            } catch (error) {
                caughtError = true;
            }
            expect(caughtError).to.be.true;
        });

        it('should throw error when only 1 parameters are provided', async function () {
            var caughtError = false;
            try {
                const ret = await ExportUtils.getAllSignings(
                    'gitHubPersonalAccessToken'
                );
            } catch (error) {
                caughtError = true;
            }
            expect(caughtError).to.be.true;
        });

        it('should throw error when only 2 parameters are provided', async function () {
            var caughtError = false;
            try {
                const ret = await ExportUtils.getAllSignings(
                    'gitHubPersonalAccessToken',
                    'gitHubRepositoryId'
                );
            } catch (error) {
                caughtError = true;
            }
            expect(caughtError).to.be.true;
        });

        it('should throw error when parameters are provided but empty', async function () {
            var caughtError = false;
            try {
                const ret = await ExportUtils.getAllSignings('', '', '');
            } catch (error) {
                caughtError = true;
            }
            expect(caughtError).to.be.true;
        });

        it('should throw error when invalid gitHubPersonalAccessToken is provided for a valid gitHubRepositoryId and claGistUrl', async function () {
            var caughtError = false;
            try {
                const ret = await ExportUtils.getAllSignings(
                    'bad-token',
                    '320589903',
                    'https://gist.github.com/fc73e83c067fa38cfc79ecb5400175c5'
                );
            } catch (error) {
                caughtError = true;
            }
            expect(caughtError).to.be.true;
        });

        it('should return signings given valid test parameters via environment variables', async function () {
            this.timeout(10000);
            const signings = await ExportUtils.getAllSignings(
                process.env.CLA_ASSISTANT_UTILS_GITHUB_PERSONAL_ACCESS_TOKEN,
                process.env.CLA_ASSISTANT_UTILS_GITHUB_REPO_ID,
                process.env.CLA_ASSISTANT_UTILS_GITHUB_CLA_GIST_URL
            );
            expect(signings).to.not.be.undefined;
            expect(signings).to.not.be.empty;
        });

        it('should return signings given valid test parameters for specific gist version via environment variables', async function () {
            this.timeout(10000);
            const signings = await ExportUtils.getAllSignings(
                process.env.CLA_ASSISTANT_UTILS_GITHUB_PERSONAL_ACCESS_TOKEN,
                process.env.CLA_ASSISTANT_UTILS_GITHUB_REPO_ID,
                process.env.CLA_ASSISTANT_UTILS_GITHUB_CLA_GIST_URL,
                true,
                process.env.CLA_ASSISTANT_UTILS_GITHUB_CLA_GIST_VERSION_ID
            );
            expect(signings).to.not.be.undefined;
            expect(signings).to.not.be.empty;
        });
    });
});
