const express = require('express')
const app = express()

const axios = require('axios')

app.get('/', async function (req, res) {
	console.log('incoming http request....')
  axios({
    method: 'get',
    url: 'https://www.reddit.com/r/mlbstreams/search.json?q=red+sox&restrict_sr=on',
  }).then(function (response) {
    let commentUrl = response.data.data.children[0].data.url

    if (commentUrl) {
      axios({
        method: 'get',
        url: `${commentUrl}.json`,
      }).then(function (response) {
        let comments = response.data[1].data.children

        if (comments) {
          let sportsHdComment = comments.filter((comment) => {
            //Tested up to here
            return comment.data.body.includes('SportsHD')
          })[0].data.body

          if (sportsHdComment) {
            let regexp = /http\:\/\/sportshd[^\)]*/

            let firstMatch = sportsHdComment.match(regexp)
            let secondMatch = sportsHdComment.substring(firstMatch.index + 1).match(regexp)

            let homeLink = firstMatch[0]
            let awayLink = secondMatch[0]

            if (sportsHdComment) {

              if (sportsHdComment.includes('at RedSox')) {
                console.log('a')
                res.send(homeLink)
              } else if (sportsHdComment.includes('RedSox at')) {
                console.log('b')
                res.redirect(awayLink)
              } else {
                console.log('something didn\'t work...')
              }
            }
          } else {
            console.log('error finding the sportshd comment')
          }
        } else {
          console.log('could not find comments')
        }
      })
    } else {
      console.log('could not find link url')
    }
  })
})

app.use(express.static('public'))

app.listen(3000, function() {
  console.log('Listening on port 3000....')
})
