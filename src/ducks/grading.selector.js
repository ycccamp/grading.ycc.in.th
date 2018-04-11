import * as R from 'ramda'
import {createSelector} from 'reselect'

import {findEvaluation} from '../core/evaluation'

// Calculate the total and delisted submissions
// LISTING - SHARED
export const totalSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  (campers, entries) => {
    const delisted = entries.filter(x => x.delisted).length

    return {total: campers.length - delisted, delisted}
  },
)

/*
  # Listing Selectors
    These selectors will be used in routes/submissions
*/

// Show how many people have been graded
export const gradedSelector = createSelector(
  s => s.grading.data,
  s => s.user.role,
  s => s.user.name,
  (entries, role, name) => {
    const type = role === 'core' ? 'core' : 'major'

    return entries.filter(x => x[type] && x[type][name] && !x.delisted).length
  },
)

// Joins the camper's information with the current grading result.
// This will be used in the list of submissions by the graders only.
export const submissionsSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  s => s.user.name,
  (campers, entries, gradedBy) => {
    return campers.map(camper => {
      const grading = entries.find(entry => entry.id === camper.id)
      const evaluation = findEvaluation(grading, gradedBy, camper.major)

      return {...evaluation, ...camper}
    })
  },
)

/*
  # Detail Selectors
    These selectors will be used in routes/grading
*/

// Selects the user ID
const idSelector = (s, p) => p.id || p.match.params.id

// Retrieve the evaluations that matches the specific user ID.
const evaluationsSelector = createSelector(
  s => s.grading.data,
  idSelector,
  (evaluations, id) => evaluations.find(evaluation => evaluation.id === id),
)

// Selects the evaluation result that you had submitted beforehand
export const evaluationSelector = createSelector(
  evaluationsSelector,
  s => s.user.name,
  s => s.user.role,
  (evaluation, name, role) => findEvaluation(evaluation, name, role),
)

// Determines if the camper is delisted or not. Returns the evaluator's name.
export const delistedSelector = createSelector(
  evaluationsSelector,
  evaluation => evaluation && evaluation.delisted && evaluation.delistedBy,
)

export const submissionSelector = createSelector(
  submissionsSelector,
  idSelector,
  (submissions, id) => submissions.find(submission => submission.id === id),
)

/*
  Internal Selectors
*/

// Determine where the grader previously left off
// INTERNAL
export const leftoffSelector = createSelector(
  submissionsSelector,
  s => s.user.name,
  s => s.user.role,
  (entries, name, role) => {
    const getLeftOff = R.findIndex(entry => {
      const grading = findEvaluation(entry, name, role)

      if (grading) {
        return !grading.delisted && !grading.scores
      }
    })

    return getLeftOff(entries)
  },
)
