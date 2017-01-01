var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var Git = require("nodegit");
  Git.Clone("https://github.com/LandvibeDev/seuksak", "./tmp")
    .then(function(repo){
    return repo.getCommit("27408963debece5904b38099f41ccb98d7b07eea");
    })
    .then(function(commit) {
      return commit.getEntry("README.md");
    })
    .then(function(entry){
      return entry.getBlob().then(function(blob){
        blob.entry = entry;
        return blob;
    });
  })
    .then(function(blob){
      console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

      console.log(Array(72).join("=") + "\n\n");

      console.log(String(blob));
    })
  .catch(function(err) { console.log(err); });

  res.render('project');
});

module.exports = router;
