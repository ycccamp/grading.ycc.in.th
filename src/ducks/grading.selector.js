import * as R from 'ramda'
import {createSelector} from 'reselect'

import {getEvaluation} from '../core/evaluation'

/*
  # Counting Selectors
    These selectors will be used for counting submissions in routes/submissions
*/

// Calculate the total and delisted submissions
export const totalSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  (campers, entries) => {
    const delisted = entries.filter(x => x.delisted).length

    return {total: campers.length - delisted, delisted}
  },
)

// Show how many people have been graded
export const gradedSelector = createSelector(
  s => s.grading.data,
  s => s.user.role,
  s => s.user.name,
  (entries, role, name) => {
    const type = role === 'core' ? 'core' : 'major'

    return entries.filter(x => !x.delisted && x[type] && x[type][name]).length
  },
)

/*
  # Evaluations Selector
*/

export const evaluationsSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  s => s.user.name,
  s => s.user.role,
  (campers, entries, gradedBy, role) => {
    const submissions = campers.map(camper => {
      const evaluations = entries.find(entry => entry.id === camper.id)

      const evaluation = getEvaluation(evaluations, gradedBy, role)

      return {
        id: camper.id,
        ...evaluation,
      }
    })

    return submissions.filter(x => !x.delisted)
  },
)

/*
  # Submissions Record Selectors
    This selectors will be used to populate the data in SubmissionsRecord
*/

function sortByGraded(a, b) {
  return (
    !a.gradedAt - !b.gradedAt ||
    +(a.gradedAt > b.gradedAt) ||
    -(a.gradedAt < b.gradedAt)
  )
}

const withIndex = (item, i) => ({...item, number: i + 1})

// Joins the camper's information with your evaluation result.
// This will be used in the list of submissions by the graders only.
export const submissionsSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  s => s.user.name,
  s => s.user.role,
  (campers, entries, gradedBy, role) => {
    const submissions = campers.map(camper => {
      const evaluations = entries.find(entry => entry.id === camper.id)

      if (!evaluations) {
        return camper
      }

      const evaluation = getEvaluation(evaluations, gradedBy, role)

      return {
        delisted: evaluations.delisted,
        delistedBy: evaluations.delistedBy,
        ...evaluation,
        ...camper,
      }
    })

    return submissions.sort(sortByGraded).map(withIndex)
  },
)

/*
  # Detail Selectors
    These selectors will be used in routes/evaluate
*/

// Selects the user ID
const idSelector = (s, id) => id

// Retrieve all evaluations from every graders for a user.
const gradingSelector = createSelector(
  s => s.grading.data,
  idSelector,
  (evaluations, id) => evaluations.find(evaluation => evaluation.id === id),
)

// Selects the evaluation result that you had submitted beforehand
export const evaluationSelector = createSelector(
  gradingSelector,
  s => s.user.name,
  s => s.user.role,
  (evaluation, name, role) => getEvaluation(evaluation, name, role),
)

// Determines if the camper is delisted or not. Returns the evaluator's name.
export const delistedSelector = createSelector(
  gradingSelector,
  evaluation => evaluation && evaluation.delisted && evaluation.delistedBy,
)

// Retrieves the camper's evaluation
export const submissionSelector = createSelector(
  submissionsSelector,
  idSelector,
  (submissions, id) => submissions.find(submission => submission.id === id),
)

/*
  Internal Selectors
*/

const isLeftOff = evaluation =>
  evaluation && !evaluation.delisted && !evaluation.scores

// Determine where the grader previously left off
export const leftoffSelector = createSelector(
  submissionsSelector,
  entries => entries.findIndex(isLeftOff),
)
