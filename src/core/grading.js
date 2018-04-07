import R from 'ramda'

import questions from '../core/questions'

const sample = {
  core: [
    {
      gradedBy: 'A',
      scores: [7, 10, 8],
      notes: 'Good',
    },
    {
      gradedBy: 'B',
      scores: [10, 9, 15],
    },
  ],
  major: [
    {
      gradedBy: 'C',
      scores: [10, 10, 10],
    },
  ],
}

const maxScores = {
  core: [10, 15, 15],
  design: [20, 20, 20],
  content: [45, 15],
  marketing: [20, 20, 20],
  programming: [20, 20, 20],
}

const zipQuestion = R.zipWith((q, m) => ({question: q, max: m}))

// Validate if all the given score is below the maximum score
export function assertMax(scores, section = 'core') {
  const max = maxScores[section]

  for (const i in max) {
    if (scores[i] > max[i]) {
      throw new Error('Given score cannot exceed maximum score.')
    }
  }
}

export const getQuestions = (type = 'core') =>
  zipQuestion(questions[type], maxScores[type])

const average = R.converge(R.divide, [R.sum, R.length])

// TODO: Filter out unfinished graders
function computeScore(results) {
  const scores = results.map(result => R.sum(result.scores))

  return average(scores)
}

export const finalScore = grade =>
  computeScore(grade.core) + computeScore(grade.major)
