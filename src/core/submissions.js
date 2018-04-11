import * as R from 'ramda'

import {app} from '../core/fire'
import questions from '../core/questions'
import {maxScores} from '../core/scoring'

const db = app.firestore()

const zipQuestion = R.zipWith((q, m) => ({question: q, max: m}))

export const getQuestions = (type = 'core') =>
  zipQuestion(questions[type], maxScores[type])

/**
 * updateGrading - Update the grading information
 *
 * @param  {type} id       ID of the answer
 * @param  {type} payload  Grading Data
 * @param  {type} gradedBy Name of the grader
 * @param  {type} type     Type of the answer
 */
export async function updateGrading(id, payload, gradedBy, type = 'major') {
  const docRef = db.collection('grading').doc(id)

  await db.runTransaction(async transaction => {
    const data = {
      [type]: {
        [gradedBy]: {
          notes: payload.notes || '',
          scores: payload.scores,
          gradedAt: new Date(),
        },
      },
    }

    transaction.set(docRef, data, {merge: true})
  })
}
