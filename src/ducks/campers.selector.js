import * as R from 'ramda'
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
        selected: evaluations.selected,
        alternate: evaluations.alternate,
        coreEvaluation: evaluations.core,
        majorEvaluation: evaluations.major,
      }
    })

    return submissions.sort(sortByScore)
  },
)

// Select only the top 30 campers for each major
export const topCampersSelector = createSelector(
  campersSelector,
  s => s.camper.currentMajor,
  (candidates, major) =>
    candidates
      .filter(entry => !entry.delisted && entry.major === major)
      .slice(0, 30),
)

export const candidateSelector = createSelector(
  campersSelector,
  (s, id) => id,
  (candidates, id) => candidates.find(candidate => candidate.id === id),
)
