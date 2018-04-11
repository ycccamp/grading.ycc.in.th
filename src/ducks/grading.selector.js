import * as R from 'ramda'
import {createSelector} from 'reselect'

const idSelector = (s, p) => p.id || p.match.params.id

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

// Show how many people have been graded
// LISTING - GRADERS
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
// LISTING - GRADERS
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

// Retrieve the evaluation that matches the specific user ID.
// DETAIL - GRADERS
const gradingSelector = createSelector(
  s => s.grading.data,
  idSelector,
  (evaluations, id) => evaluations.find(evaluation => evaluation.id === id),
)

// Selects the evaluation result that you had submitted beforehand
// DETAIL - GRADERS
export const evaluationSelector = createSelector(
  gradingSelector,
  s => s.user.name,
  s => s.user.role,
  (evaluation, name, role) => findEvaluation(evaluation, name, role),
)

// Determines if the camper is delisted or not. Returns the evaluator's name.
// DETAIL - GRADERS
export const delistedSelector = createSelector(
  gradingSelector,
  evaluation => evaluation && evaluation.delisted && evaluation.delistedBy,
)

// DETAIL - GRADERS
export const submissionSelector = createSelector(
  submissionsSelector,
  idSelector,
  (submissions, id) => submissions.find(submission => submission.id === id),
)

// Determine where the grader previously left off
// INTERNAL - GRADERS
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
