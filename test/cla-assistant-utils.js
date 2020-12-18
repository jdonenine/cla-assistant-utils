const expect = require('chai').expect;
const ClaAssistantUtils = require('../lib/cla-assistant-utils');

describe('ClaAssistantUtils', function () {
    describe('exportUtils', function () {
        it('should exist', function () {
            expect(ClaAssistantUtils.exportUtils).not.to.be.undefined;
        });

        it('should export getAllSignings', function () {
            expect(ClaAssistantUtils.exportUtils.getAllSignings).not.to.be
                .undefined;
        });

        it('should export getAllSigningsUrl', function () {
            expect(ClaAssistantUtils.exportUtils.getAllSigningsUrl).not.to.be
                .undefined;
        });
    });
});
