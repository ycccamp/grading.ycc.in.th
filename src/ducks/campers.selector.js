import {createSelector} from 'reselect'

import {computeScores} from '../core/scoring'

const sortByScore = (a, b) => (b.totalScore || 0) - (a.totalScore || 0)

// Joins the camper's information with the average grading result
export const campersSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  (campers, entries) => {
    const submissions = campers.map(camper => {
      const evaluations = entries.find(entry => entry.id === camper.id)

      if (!evaluations) {
        return camper
      }

      const scores = computeScores(evaluations, camper.major)

      return {
        ...camper,
        ...scores,
        delisted: evaluations.delisted,
        delistedBy: evaluations.delistedBy,
        coreEvaluation: evaluations.core,
        majorEvaluation: evaluations.major,
      }
    })

    return submissions.sort(sortByScore)
  },
)
