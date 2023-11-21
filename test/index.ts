import path from 'path'

import { checkoutRepository } from 'repositree'

const repo = checkoutRepository(path.resolve('../'));

console.log(repo.gitVersion());

const branches = repo.branches();

console.log(branches);

const tree = repo.lsTree();

console.log(tree);

repo.cdTree('src');

console.log(repo.currentTree);

console.log(repo.lsTree());

console.log(repo.catFile('index.ts'));
