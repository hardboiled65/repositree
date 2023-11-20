import { checkoutRepository } from 'repositree'

const repo = checkoutRepository(process.env.HOME + '/myorg/bash.git');

console.log(JSON.stringify(repo));
