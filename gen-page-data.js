const faker = require('faker')

const genPageData = () => {
  const url = faker.internet.url()
  const title = faker.random.words(5)

  return {
    _id: `page/${new Date(faker.date.past()).getTime()}/${faker.random.number(10000)}`,
    url, title,
    content: {
      title,
      canonicalUrl: url,
      keywords: faker.random.words(8).split(' '),
      fullText: faker.random.words(1000),
      description: faker.random.words(10),
    },
  }
}

module.exports = genPageData
