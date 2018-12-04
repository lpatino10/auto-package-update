var bodyParser = require('body-parser');
var shell = require('shelljs');
var git = require('nodegit');

module.exports = function(app) {
  app.use(bodyParser.json());

  app.post('/listener', function (req, res) {
    console.log(req.body);

    // will change with real hooks
    var newVersion = req.body.version;

    // clone repo
    git.Clone('https://github.com/heroku/node-js-sample', './tmp')
      // update package version and install
      .then(() => {
        shell.cd('./tmp');
        var newString = `"version": "${newVersion}"`;
        shell.sed('-i', /"version": "[0-9].[0-9].[0-9]"/g, newString, 'package.json');
        shell.exec('npm install');
      })
      // TODO: run tests, verify that it's okay, commit
      .done();

    res.json({ status: 'all good' });
  });
}
