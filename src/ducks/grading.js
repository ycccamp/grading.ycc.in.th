import R from 'ramda'

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

function assertMax(section, scores) {
  const max = maxScores[section]

  for (const i in max) {
    if (scores[i] > max[i]) {
      throw new Error('given score exceeds maximum score')
    }
  }
}

function average(results, section = 'core') {
  // TODO: Filter out unfinished graders
  const scores = results.map(result => R.sum(result.scores))
  assertMax(section, scores)

  return R.sum(scores) / scores.length
}

function finalScore(grade, camper) {
  const core = average(grade.core)
  const major = average(grade.major, camper.major)

  return core + major
}
