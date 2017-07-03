const faker = require('faker')

const transformToVisitDoc = pageData => visitStart => ({
  _id: `visit/${visitStart}/${faker.random.number(10000)}`,
  visitStart,
  url: pageData.url,
  page: { _id: pageData._id },
})

const transformToBookmarkDoc = pageData => {
  const bookmarkTime = new Date(faker.date.past()).getTime()

  return {
    _id: `bookmark/${bookmarkTime}/${faker.random.number(10000)}`,
    title: pageData.title,
    url: pageData.url,
    page: { _id: pageData._id },
  }
}

const genVisitTimeArr = (maxVisits = 10) => {
  const numVisits = Math.floor(Math.random() * maxVisits)
  return Array.from({ length: numVisits }, () => new Date(faker.date.past()).getTime())
}

const transformToDocs = pageData => {
  // Page data should be same format as doc
  const pageDoc = pageData

  // Make some visit docs for the page
  const visitDocs = genVisitTimeArr().map(transformToVisitDoc(pageData))

  // Chance to make a bookmark doc
  const bookmarkDocs = Math.random() > 0.95 ? [transformToBookmarkDoc(pageData)] : []

  return [
    pageDoc,
    ...visitDocs,
    ...bookmarkDocs,
  ]
}

module.exports = transformToDocs
