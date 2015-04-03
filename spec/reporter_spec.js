var chalk = require('chalk');
var jshintCli = require('jshint/src/cli').run;
var reporter = require('..').reporter;
var stdout = require('test-console').stdout;

describe('When there are errors', function() {

  var output = jshint(['spec/fixtures/fail.js']);

  it('reports errors', function() {
    expect(output).toMatch(/\d+ code quality errors? found/i);
  });

  it('shows the file', function() {
    expect(output).toMatch(/fail\.js/i);
  });

  it('shows line numbers and code previews', function() {
    expect(output).toMatch(/^\s*4.*line four/im);
  });

  it('shows a marker', function() {
    expect(output).toMatch(/^-+\^/m);
  });

});

describe('When there are no errors', function() {

  var output = jshint(['spec/fixtures/pass.js']);

  it('reports no errors', function() {
    expect(output).toMatch(/no code quality errors found/i);
  });

  it('does not show the file', function() {
    expect(output).not.toMatch(/pass\.js/);
  });

});

/**
 * Runs JSHint with the given arguments and returns the output.
 *
 * @param  {string[]} args
 * @return {string}
 */
function jshint(args) {
  var lines = stdout.inspectSync(function() {
    jshintCli({ args: args, reporter: reporter });
  });

  var output = lines.join('\n');

  return chalk.stripColor(output);
}
