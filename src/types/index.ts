export type ObjectType = 'blob' | 'tree';

export interface TreeObject {
  mode: string;
  type: ObjectType;
  hash: string;
  name: string;
}

export interface RepositreeInstance {
  /**
   * Name of the repository. Same as root git directory name.
   */
  name: string;
  fullPath: string;
  exists: boolean;
  currentBranch: string;
  currentTree: string;

  branches: () => string[];
  /**
   * Switch branch. `currentTree` set to HEAD.
   */
  switchBranch: (branch: string) => void;
  lsTree: () => TreeObject[];
  cdTree: (treeName: string) => void;
  gitVersion: () => string;
}
