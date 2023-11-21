import { RepositreeInstance } from './types'
import { repositreeInstanceHelper } from './helpers'

function checkoutRepository(repoDir: string): RepositreeInstance {
  return repositreeInstanceHelper(repoDir);
}

export {
  checkoutRepository,
}
