import * as R from 'ramda'

import {app} from '../core/fire'
import questions from '../core/questions'

/*
  core: {
    tul: {
      scores: [7, 10, 8],
    },
  },
  major: {
    chun: {
      scores: [10, 9, 15],
      notes: 'GG EZ',
    }
  }
*/

const db = app.firestore()

/**
 * updateGrading - Update the grading information
 *
 * @param  {type} id       ID of the answer
 * @param  {type} payload  Grading Data
 * @param  {type} gradedBy Name of the grader
 * @param  {type} type     Type of the answer
 * @return {type}          description
 */
export async function updateGrading(id, payload, gradedBy, type = 'major') {
  const docRef = db.collection('grading').doc(id)

  // Prevent notes from being undefined
  if (!payload.notes) payload.notes = ''

  await db.runTransaction(async transaction => {
    const data = {
      [type]: {
        [gradedBy]: {
          ...payload,
          gradedAt: new Date(),
        },
      },
    }

    transaction.set(docRef, data, {merge: true})
  })
}

export const maxScores = {
  core: [10, 15, 15],
  design: [20, 20, 20],
  content: [15, 45],
  marketing: [20, 20, 20],
  programming: [20, 20, 20],
}

const zipQuestion = R.zipWith((q, m) => ({question: q, max: m}))

export const getQuestions = (type = 'core') =>
  zipQuestion(questions[type], maxScores[type])

const average = R.converge(R.divide, [R.sum, R.length])

// const listOf = obj =>
//   Object.entries(obj).map(([gradedBy, payload]) => ({
//     gradedBy,
//     ...payload,
//   }))

// TODO: Filter out unfinished graders
function computeScore(results) {
  if (results) {
    const scores = Object.values(results).map(result => R.sum(result.scores))

    console.log('Scores:', scores)

    return average(scores)
  }

  return 0
}

export function computeGrading(grading, name, role) {
  if (grading) {
    const {core, major} = grading
    console.log('Grading:', grading)

    const coreScore = computeScore(core)
    const majorScore = computeScore(major)
    const totalScore = coreScore + majorScore

    if (role && role !== 'admin') {
      const type = role === 'core' ? 'core' : 'major'
      const grades = grading[type]

      if (grades) {
        const grade = grades[name]

        if (grade) {
          grading.notes = grade.notes || null
          grading.scores = grade.scores
          grading.gradedAt = grade.gradedAt
        }
      }
    }

    return {coreScore, majorScore, totalScore, ...grading}
  }
}
