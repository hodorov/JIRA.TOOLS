const fs = require('fs');
const REGEX = /#?([A-Z]+\-[0-9]+)/g

fs.readFile('./in.txt', 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    let tasks = new Set();

    [...data.matchAll(REGEX)].forEach(it => tasks.add(it[1]));

    fs.writeFile('./out.txt', [...tasks].join("\r\n"), 'utf8', function(err) {
        if (err) return console.log(err);
    });
});
