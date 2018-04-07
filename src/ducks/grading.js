import R from 'ramda'

// camper1: {
//   general: [{
//     gradedBy: 'tul',
//     scores: [7, 10, 8],
//     notes: '-'
//   }],
//   major: []
// }

function average(results) {
  // TODO: Filter out unfinished graders
  const scores = results.map(result => R.sum(result.scores))

  return R.sum(scores) / scores.length
}

function finalScore(camper) {
  const general = average(camper.general)
  const major = average(camper.major)

  return general + major
}
