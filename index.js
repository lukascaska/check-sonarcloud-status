const core = require('@actions/core');
const github = require('@actions/github');
const { default: axios } = require('axios');

const sonarToken = core.getInput('SONAR_TOKEN');
const sonarProject = core.getInput('SONAR_PROJECT');
axios.get(`https://sonarcloud.io/api/project_pull_requests/list?project=${sonarProject}`, {
    headers: {
        Authorization: `Bearer ${sonarToken}`
    }
}).then((r) => {
    const { pullRequests } = r.data
    const prNumber = github.context.issue.number;
    const PrDetailsPosition = pullRequests.findIndex(pr => pr.key === String(prNumber))
    const PRDetails = pullRequests[PrDetailsPosition]
    console.log(PRDetails.status.qualityGateStatus)
    if (PRDetails.status.qualityGateStatus === "ERROR") {
        throw new Error(`Sonarcloud status: FAILED, please check sonar cloud for more details`)
    }
    console.log(`Sonarcloud status: SUCCESS`);
}).catch(error => {
    core.setFailed(error.message);
})
