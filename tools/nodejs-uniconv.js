#!/usr/bin/env nodejs

/*
var spawn = require('child_process').spawn;
//var prc = spawn('java',  ['-jar', '-Xmx512M', '-Dfile.encoding=utf8', 'script/importlistings.jar']);
var prc = spawn('unoconv',  ['--format=pdf','--outputpath=outdir','test_wurth_czcionki.odt']);
//
prc.stdout.setEncoding('utf8');
prc.stdout.on('data', function (data) {
    console.log("stdout: "+data);
});
//
prc.stderr.on('data', function (data) {
    console.log("stderr: "+data);
});
//
prc.on('close', function (code) {
    console.log('process exit code ' + code);
});

*/
var exec = require('child_process').exec,
    child;
var cmd = "unoconv --format=pdf --outputpath=outdir/aaa.pdf test_wurth_czcionki.odt";

child = exec(cmd,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
	console.log('exec error: ' + error);
    }
});