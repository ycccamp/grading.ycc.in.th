import * as R from 'ramda'
import {createSelector} from 'reselect'

const evaluationProps = ['scores', 'notes', 'gradedAt']

// Select an evaluation based on grader and major from the entries
export function findEvaluation(entries, gradedBy, major) {
  if (major && entries) {
    const type = major === 'core' ? 'core' : 'major'
    const select = R.path([type, gradedBy])

    return R.pick(evaluationProps, select(entries))
  }
}

// Calculate the total and delisted submissions
// This will be used for listing pages
export const totalSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  (campers, entries) => {
    const delisted = entries.filter(x => x.delisted)

    return {
      total: campers.length - delisted.length,
      delisted: delisted.length,
    }
  },
)

// Retrieve the evaluation that matches the specific user ID.
const gradingSelector = createSelector(
  s => s.grading.data,
  (s, p) => p.id || p.match.params.id,
  (evaluations, id) => {
    return evaluations.find(evaluation => evaluation.id === id)
  },
)

// Determines if the camper is delisted or not. Returns the evaluator's name.
export const delistedSelector = createSelector(gradingSelector, evaluation => {
  if (evaluation && evaluation.delisted) {
    return evaluation.delistedBy
  }
})

// Selects the evaluation result that you had submitted beforehand
export const selfEvaluatedSelector = createSelector(
  gradingSelector,
  s => s.user.name,
  s => s.user.role,
  (evaluation, name, role) => findEvaluation(evaluation, name, role),
)

// Joins the camper's information with the current grading result.
// This will be used in the submissions route by the graders only.
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

const sortByScore = (a, b) => {
  return (b.totalScore || 0) - (a.totalScore || 0)
}

// Joins the camper's information with the average grading result
export const campersSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  (campers, entries) => {
    const submissions = campers.map(camper => {
      const evaluation = entries.find(entry => entry.id === camper.id)

      return {
        ...camper,
        coreEvaluation: evaluation.core,
        majorEvaluation: evaluation.major,
      }
    })

    return submissions.sort(sortByScore)
  },
)
