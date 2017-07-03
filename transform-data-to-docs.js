const faker = require('faker')

const transformToPageDoc = pageData => ({
  _id: `page/${faker.random.number(10000)}/${faker.random.number(10000)}`,
  url: pageData.url,
  title: pageData.title,
  content: {
    title: pageData.title,
    canonicalUrl: pageData.url,
    keywords: faker.random.words(8).split(' '),
    fullText: pageData.body,
    description: faker.random.words(10),
  },
})

const transformToVisitDoc = (pageData, assocPageDocId) => visitStart => ({
  _id: `visit/${visitStart}/${faker.random.number(10000)}`,
  visitStart,
  url: pageData.url,
  page: { _id: assocPageDocId },
})

const transformToBookmarkDoc = (pageData, assocPageDocId) => ({
  _id: `bookmark/${new Date(faker.date.past()).getTime()}/${faker.random.number(10000)}`,
  title: pageData.title,
  url: pageData.url,
  page: { _id: assocPageDocId },
})

const genVisitTimeArr = numVisits => Array.from({ length: numVisits }, () => new Date(faker.date.past()).getTime())

const transformToDocs = (pageData, maxVisits = 10) => {
  // Page data should be same format as doc
  const pageDoc = transformToPageDoc(pageData)

  // Make some visit docs for the page
  const numVisits = Math.floor(Math.random() * maxVisits)
  const visitDocs = genVisitTimeArr(numVisits).map(transformToVisitDoc(pageData, pageDoc._id))

  // Chance to make a bookmark doc
  const bookmarkDocs = Math.random() > 0.95 ? [transformToBookmarkDoc(pageData, pageDoc._id)] : []

  return [
    pageDoc,
    ...visitDocs,
    ...bookmarkDocs,
  ]
}

module.exports = transformToDocs
