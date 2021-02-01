const JiraApi = require('jira-client');
const fs = require('fs');

const jira = new JiraApi({
    protocol: 'http',
    host: 'HOST',
    port: 28080,
    base: "jira",
    username: 'USER',
    password: 'PASS',
    apiVersion: '2',
    strictSSL: true
});

const versionCode = "10303";

fs.readFile('./out.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    jira.getVersion(versionCode).then(version => {
        data
            .split("\n")
            .filter(Boolean)
            .forEach(task => {
                jira.findIssue(task)
                    .then(function (issue) {
                        if (issue.fields.fixVersions.length) {
                            if(issue.fields.fixVersions[0].name != version.name) {
                                console.error(`VERSION IN TASK ${task} DOESN'T EQUAL TO SPECIFIED. CURRENT VERSION: ${task.fields.fixVersions[0].name}`)
                            } else {
                                console.log(`Task ${task} already has specified version`);
                            }
                            return;
                        }
                        jira.updateIssue(task, {update: {fixVersions: [{set: [{name: version.name}]}]}}).then(() => console.log(`Task ${task} updated`)).catch(err => console.log(err));
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            });
    })
});
