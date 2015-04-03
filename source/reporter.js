var fs = require('fs');
var chalk = require('chalk');

/**
 * Outputs formatted JSHint error entries to the console.
 *
 * @see   {@link http://jshint.com/docs/reporters/}
 * @param {Object[]} entries Error entries from JSHint.
 */
function reportErrors(entries) {
  var errorCount = entries.length;

  if (errorCount === 0) {
    console.log('No code quality errors found.');
    return;
  }

  entries.map(writeEntry).forEach(function(entry) {
    console.log(entry);
  });

  if (errorCount === 1) {
    console.log(errorCount + ' code quality error found.');
  } else {
    console.log(errorCount + ' code quality errors found.');
  }
}

/**
 * Writes a formatted JSHint error entry.
 *
 * @see    {@link http://jshint.com/docs/reporters/}
 * @param  {Object} entry Error entry from JSHint.
 * @return {string}
 */
function writeEntry(entry) {
  var lines = fs.readFileSync(entry.file).toString().split('\n');

  // Remove the trailing dot from the reason string
  var reason = entry.error.reason.replace(/\.+$/, '');

  var file = entry.file;
  var line = entry.error.line;
  var column = entry.error.character;

  var output = '';

  output += chalk.bold(reason) + ' at ' + chalk.green(file) + ' :\n';
  output += writeLines(lines, line, -2);
  output += writeArrow(column);
  output += writeLines(lines, line, 2);

  return output;
}

/**
 * Writes formatted lines with human-readable line numbers.
 *
 * @param  {string[]} lines  Lines from a file.
 * @param  {number}   index  Index of the target line.
 * @param  {number}   offset If nonpositive, writes the lines in range
 *                           [index + offset, index]. Otherwise writes lines
 *                           (index, index + offset].
 * @return {string}
 */
function writeLines(lines, index, offset) {
  var minIndex = Math.min(index, index + offset - 1);
  var maxIndex = Math.max(index, index + offset);

  // Limit range to [0, lines.length].
  minIndex = Math.max(minIndex, 0);
  maxIndex = Math.min(maxIndex, lines.length);

  var output = '';

  for (var i = minIndex; i < maxIndex; i++) {
    output += writeLine(lines[i], i);
  }

  return output;
}

/**
 * Writes a formatted line with a human-readable line number.
 *
 * @param  {string} line  Line from a file.
 * @param  {number} index Zero-based index of the line.
 * @return {string}
 */
function writeLine(line, index) {
  var humanLineNumber = pad(6, index + 1);
  var output = '';

  output += chalk.grey(humanLineNumber + ' | ');
  output += line;
  output += '\n';

  return output;
}

/**
 * Writes an arrow marker below a line that marks a specific character.
 *
 * @param  {number} column Column number of the marked character.
 * @return {string}
 */
function writeArrow(column) {
  // Column number offset by the number of characters before the actual line
  // in the output.
  var dashes = new Array(column + 9).join('-');
  return chalk.grey(dashes + '^') + '\n';
}

/**
 * Adds leading spaces to the given number if it's shorter than the given
 * length. Otherwise just returns the number as a string.
 *
 * @param  {number} length Length of the returned string.
 * @param  {number} number Number to pad.
 * @return {string}
 */
function pad(length, number) {
  var numberString = number.toString();
  var paddingLength = length - numberString.length;

  if (paddingLength < 1) {
    return numberString;
  }

  return new Array(paddingLength + 1).join(' ') + numberString;
}

module.exports = {
  reporter: reportErrors
};
