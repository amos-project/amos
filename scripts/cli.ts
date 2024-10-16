/*
 * @since 2023-08-04 15:40:56
 * @author junbao <junbao@moego.pet>
 */

import * as yargs from 'yargs';
import { Argv } from 'yargs';
import * as fs from 'fs-extra';
import * as G from 'glob';
import * as assert from 'assert';
import * as child_process from 'child_process';

const updatePkgJson = (file: string, version: string) => {
  const pkgJson = fs.readJsonSync(file);
  pkgJson.version = version;
  for (const d in ['devDependencies', 'peerDependencies', 'optionalDependencies', 'dependencies']) {
    for (const p in pkgJson[d] || {}) {
      if (/^amos(-|$)/.test(p)) {
        pkgJson[d][p] = version;
      }
    }
  }
  fs.writeJsonSync(file, pkgJson, { spaces: 2 });
};

async function version({ level, tag }: { level: string; tag: string }) {
  if (tag !== 'latest') {
    // allow latest build for drop tag suffix
    assert.equal(level, 'build', 'level must be build when tag is not latest');
  }
  const pkgJson = fs.readJsonSync('./package.json');
  let [, major, minor, patch, currTag, build] = pkgJson.version.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-(\w+)\.(\d+))?$/,
  );
  switch (level) {
    case 'major':
      major++;
      break;
    case 'minor':
      minor++;
      break;
    case 'patch':
      patch++;
      break;
    case 'build':
      build = currTag === tag ? +build + 1 : 1;
      break;
  }
  const version = `${major}.${minor}.${patch}${tag === 'latest' ? '' : `-${tag}.${build}`}`;
  updatePkgJson('./package.json', version);
  G.sync('./packages/*/package.json').forEach((path) => updatePkgJson(path, version));
  console.log(`Updated version to ${version}.`);
}

async function compile() {
  fs.removeSync('lib');
  fs.removeSync('esm');
  child_process.execSync('yarn tsc --noEmit false -m commonjs --outDir lib', { stdio: 'inherit' });
  child_process.execSync('yarn tsc --noEmit false -m esnext --outDir esm -d', { stdio: 'inherit' });
  for (const dir of G.sync('packages/*/', { nodir: false })) {
    const pkg = fs.readJsonSync(dir + '/package.json');
    if (pkg.private) {
      continue;
    }
    fs.removeSync(dir + '/lib');
    fs.removeSync(dir + '/esm');
    if (fs.existsSync('esm/' + dir)) {
      fs.moveSync('esm/' + dir + '/src', dir + '/esm');
    }
    if (fs.existsSync('lib/' + dir)) {
      fs.moveSync('lib/' + dir + '/src', dir + '/lib');
    }
  }
}

async function publish() {
  for (const dir of G.sync('packages/*/', { nodir: false })) {
    const pkg = fs.readJsonSync(dir + '/package.json');
    if (pkg.private) {
      continue;
    }
    const tag = (pkg.version.split('-')[1] || 'latest').split('.')[0];

    console.log(`Publishing ${pkg.name}@${pkg.version} with tag ${tag}.`);

    child_process.execSync(
      `npm publish --tag ${tag} --registry https://registry.npmjs.com --loglevel silent`,
      {
        cwd: process.cwd() + '/' + dir,
        stdio: 'inherit',
      },
    );
  }
}

yargs
  .command(
    'version <tag> <level>',
    'set version',
    (args: Argv<{}>) =>
      args
        .positional('tag', {
          type: 'string',
          desc: 'The tag to use for the version',
          demandOption: true,
        })
        .positional('level', {
          type: 'string',
          choices: ['major', 'minor', 'patch', 'build'],
          desc: 'The version part to update',
          demandOption: true,
        }),
    version,
  )
  .command('compile', 'compile project', () => {}, compile)
  .command('publish', 'publish project', () => {}, publish)
  .demandCommand()
  .strict().argv;
