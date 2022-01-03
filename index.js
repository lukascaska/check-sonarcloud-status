const core = require('@actions/core');
const github = require('@actions/github');
const { default: axios } = require('axios');

const sonarToken = core.getInput('sonarToken');
const sonarProject = core.getInput('sonarProject');
axios.get(`https://sonarcloud.io/api/project_pull_requests/list?project=${sonarProject}`, {
    headers: {
        Authorization: `Bearer ${sonarToken}`
    }
}).then((r) => {
    const { pullRequests } = r.data
    const prNumber = github.context.issue.number;
    const PrDetailsPosition = pullRequests.findIndex(pr => pr.key === String(prNumber))
    const PRDetails = pullRequests[PrDetailsPosition]
    if (PRDetails.status.qualityGateStatus === "ERROR") {
        throw new Error(`Sonarcloud status: FAILED, please check sonar cloud for more details`)
    }
    core.info(`Sonarcloud status: SUCCESS`);
}).catch(error => {
    core.setFailed(error.message);
})
