import { ICherryPickProgress } from '../../models/progress'
import { Repository } from '../../models/repository'
import { git, IGitResult } from './core'

/** The app-specific results from attempting to cherry pick commits*/
export enum CherryPickResult {
  /**
   * Git completed the cherry pick without reporting any errors, and the caller can
   * signal success to the user.
   */
  CompletedWithoutError = 'CompletedWithoutError',

  /**
   * An unexpected error as part of the cherry pick flow was caught and handled.
   *
   * Check the logs to find the relevant Git details.
   */
  Error = 'Error',
}

/**
 * A stub function to initiate cherry picking in the app.
 *
 * @param commits an array of commits?
 */
export async function cherryPick(
  repository: Repository,
  commitSha: string,
  progressCallback?: (progress: ICherryPickProgress) => void
): Promise<CherryPickResult> {
  const result = await git(
    ['cherry-pick', commitSha],
    repository.path,
    'cherry pick'
  )

  return parseCherryPickResult(result)
}

function parseCherryPickResult(result: IGitResult): CherryPickResult {
  if (result.exitCode === 0) {
    return CherryPickResult.CompletedWithoutError
  }

  // TODO: handle known exceptions

  throw new Error(`Unhandled result found: '${JSON.stringify(result)}'`)
}
