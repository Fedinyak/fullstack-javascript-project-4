#!/usr/bin/env node
// eslint-disable-next-line import/no-extraneous-dependencies
import { Command } from 'commander';
import PageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .argument('<url>')
  .version('0.0.1')
  .action((url, option) => {
    // console.log(option.output, url);
    // const link = 'Some content!';
    const path = option.output;
    // const path = 'testrRq.txt';
    PageLoader(url, path);
  });
// .usage('[options] <url>'); // delete!!!!!!
// .argument('[password]', 'password for user, if required', 'no password given')
// .action((username, password) => {
//   console.log('username:', username);
//   console.log('password:', password);
// });
// program.parse(process.argv);
program.parse(process.argv);
// const options = program.opts();
// if (options.output) console.log(options.output);

// if (options.pizzaType) console.log(`- ${options.pizzaType}`);
// program.command('split')
//   .description('Split a string into substrings and display as an array')
//   .argument('<string>', 'string to split')
//   .option('--first', 'display just the first substring')
//   .option('-s, --separator <char>', 'separator character', ',')
//   .action((str, options) => {
//     const limit = options.first ? 1 : undefined;
//     console.log(str.split(options.separator, limit));
//   });

// Usage: page-loader [options] <url>

// Page loader utility

// Options:
//   -V, --version      output the version number
//   -o --output [dir]  output dir (default: "/home/user/current-dir")
//   -h, --help         display help for command
