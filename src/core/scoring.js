import * as R from 'ramda'

// Compute the mathematical average for the given list
const average = list => R.sum(list) / list.length

// Scoring ratio used for normalizing the score for each majors
export const scoringRatio = {
  designer: 0.8,
  content: 0.4,
  creative: 1.0,
  developer: 2.0,
}

// Maximum scores for each type of questions
export const maxScores = {
  core: [10, 10, 10],
  designer: [10, 10],
  creative: [10, 10],
  developer: [10, 10],
}

// Average the scores given by every graders
export function averageScore(evaluations) {
  if (evaluations) {
    const scores = Object.values(evaluations).map(entry => R.sum(entry.scores))

    return average(scores)
  }

  return 0
}

// Compute the averaged and normalized scores for admins
export function computeScores(evaluations, major) {
  const ratio = scoringRatio[major]

  if (evaluations) {
    // First, we average the scores for core questions
    const coreScore = averageScore(evaluations.core)

    // Next, we average the scores for major questions
    let majorScore = averageScore(evaluations.major)
    let extraScore = 0

    // Then, we normalize the major score to 60
    majorScore = majorScore * ratio

    // If the major score exceeds 60, compute the extra score.
    if (majorScore > 60) {
      extraScore = majorScore - 60
      majorScore = 60
    }

    // Finally, we sum the scores
    const totalScore = coreScore + majorScore

    return {coreScore, majorScore, extraScore, totalScore}
  }
}
