import child_process from 'child_process'
import path from 'path'

import { RepositreeInstance, TreeObject, ObjectType } from '../types'

function gitVersion(): string {
  const cmd = 'git --version';

  const output = child_process.execSync(cmd, { encoding: 'utf-8' });

  return output;
}

function repositreeInstanceHelper(repoDir: string): RepositreeInstance {
  let exists = false;
  try {
    const cmd = `cd ${repoDir} && git rev-parse --is-inside-work-tree`;
    const altCmd = `cd ${repoDir} && git rev-parse --is-bare-repository`;

    const output = child_process.execSync(cmd, { encoding: 'utf-8' }).trim();
    const altOutput = child_process.execSync(altCmd, { encoding: 'utf-8' }).trim();

    if (output === 'true' || altOutput === 'true') {
      exists = true;
    } else {
      exists = false;
    }
  } catch {
    exists = false;
  }

  const name = path.basename(repoDir);

  const instance: RepositreeInstance = {
    name: name,
    fullPath: repoDir,
    exists: exists,
    currentBranch: ((): string => {
      const cmd = `cd ${repoDir} && git branch --show-current`;
      const output = child_process.execSync(cmd, { encoding: 'utf-8' });

      return output.trim();
    })(),
    currentTree: 'HEAD',

    branches: function(): string[] {
      const cmd = `cd ${repoDir} && git branch`;
      const output = child_process.execSync(cmd, { encoding: 'utf-8' });
      const lines = output.split('\n');

      return lines.map(line => {
        if (line.trim() === '') {
          return;
        }
        return line.replace('*', '').trim();
      });
    },

    switchBranch: function(branch: string) {
      if (!this.branches().includes(branch)) {
        throw Error('No such branch.');
      }
      this.currentTree = 'HEAD';

      this.currentBranch = branch;
    },

    lsTree: function(): TreeObject[] {
      const cmd = `cd ${this.fullPath} && git ls-tree ${this.currentTree}`;
      let treeObjects: TreeObject[] = [];

      try {
        const output = child_process.execSync(cmd, { encoding: 'utf-8' });
        const lines = output.split('\n');

        lines.forEach(line => {
          // Ignore empty line.
          if (line.trim() === '') {
            return;
          }
          const m = line.match(/([0-9]*) *([a-z]*) *([0-9a-f]*)[ \t]*(.*)/);
          if (m === null) {
            return;
          }
          treeObjects.push({
            mode: m[1],
            type: m[2] as ObjectType,
            hash: m[3],
            name: m[4],
          });
        });
      } catch {
        throw Error('Error.');
      }

      return treeObjects;
    },

    cdTree: function(treeName: string) {
      const ls: TreeObject[] = this.lsTree();
      const found = ls.find(object => {
        return object.name === treeName;
      });
      if (found === undefined) {
        throw Error('No matching tree name.');
      }

      this.currentTree = found.hash;
    },

    catFile: function(fileName: string): string {
      const ls: TreeObject[] = this.lsTree();
      const found = ls.find(object => {
        return object.name === fileName;
      });
      const cmd = `cd ${this.fullPath} && git cat-file ${found.hash}`;

      try {
        const output = child_process.execSync(cmd, { encoding: 'utf-8' });

        return output;
      } catch {
        throw Error('No such file.');
      }
    },

    gitVersion: gitVersion,
  };


  return instance;
}

export {
  repositreeInstanceHelper,
}
