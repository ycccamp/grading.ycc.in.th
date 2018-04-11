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

// Determines if the camper is delisted or not; returns the grader's name
export const delistedSelector = createSelector(
  s => s.grading.data,
  (s, p) => p.id || p.match.params.id,
  (entries, id) => {
    const entry = entries.find(grading => grading.id === id)

    if (entry) {
      if (entry.delisted) {
        return entry.delistedBy
      }
    }
  },
)

// Selects the previous evaluation result for the grading route
export const evaluationSelector = createSelector(
  s => s.grading.data,
  (s, p) => p.match.params.id,
  s => s.user.name,
  s => s.user.role,
  (entries, id, name, role) => {
    const grading = entries.find(grading => grading.id === id)

    if (grading) {
      return findEvaluation(grading, name, role)
    }

    return {}
  },
)

// Joins the camper's information with the current grading result to use in the submissions page
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
      const grading = entries.find(entry => entry.id === camper.id)

      return {
        coreEvaluation: grading.core,
        majorEvaluation: grading.core,
        ...camper,
      }
    })

    return submissions.sort(sortByScore)
  },
)
