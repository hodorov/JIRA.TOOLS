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
                            console.error(`Task ${task} already has version`);
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
