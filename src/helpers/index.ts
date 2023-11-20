import child_process from 'child_process'
import fs from 'fs'

import { RepositreeInstance, TreeObject, ObjectType } from '../types'

function gitVersion(): string {
  const cmd = 'git --version';

  const output = child_process.execSync(cmd, { encoding: 'utf-8' });

  return output;
}

function repositreeInstanceHelper(repoDir: string): RepositreeInstance {
  let exists = false;
  try {
    const dir = fs.readdirSync(repoDir);
    if (dir.includes('.git')) {
      exists = true;
    } else {
      exists = false;
    }
  } catch {
    exists = false;
  }

  const instance: RepositreeInstance = {
    name: '',
    fullPath: repoDir,
    exists: exists,
    currentBranch: ((): string => {
      const cmd = `cd ${repoDir} && git branch --show-current`;
      const output = child_process.execSync(cmd, { encoding: 'utf-8' });

      return output.trim();
    })(),
    currentTree: 'HEAD',

    branches: (): string[] => {
      const cmd = `cd ${repoDir} && git branch`;
      const output = child_process.execSync(cmd, { encoding: 'utf-8' });
      const lines = output.split('\n');

      return lines.map(line => {
        return line.replace('*', '').trim();
      });
    },

    switchBranch: (branch: string) => {
      if (!this.branches().includes(branch)) {
        throw Error('No such branch.');
      }
      this.currentTree = 'HEAD';

      this.currentBranch = branch;
    },

    lsTree: (): TreeObject[] => {
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

    cdTree: (treeName: string) => {
      const ls: TreeObject[] = this.lsTree();
      const found = ls.find(object => {
        return object.name === treeName;
      });
      if (found === undefined) {
        throw Error('No matching tree name.');
      }

      this.currentTree = found.hash;
    },

    gitVersion: gitVersion,
  };

  return instance;
}

export {
  repositreeInstanceHelper,
}
