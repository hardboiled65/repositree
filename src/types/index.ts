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
   * Switch branch. `currentTree` set to `branch`.
   */
  switchBranch: (branch: string) => void;
  /**
   * List current tree.
   */
  lsTree: () => TreeObject[];
  /**
   * Change tree. `treeName` must be a valid tree object name.
   */
  cdTree: (treeName: string) => void;
  /**
   * Get the content of blob object.
   */
  catFile: (fileName: string) => string;
  /**
   * Returns git version string.
   */
  gitVersion: () => string;
}
