import {createSelector} from 'reselect'

const sortByScore = (a, b) => (b.totalScore || 0) - (a.totalScore || 0)

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
