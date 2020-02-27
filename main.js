// KjFYwd9
var Astoria = require('astoria')
var striptags = require('striptags');
const Entities = require('html-entities').XmlEntities;

const entities = new Entities();
let astoria = new Astoria({
	interval: 30, // 5 mins
	updatesOnly: false // We're only interested in threads posted from now
})

var boards = ['b', 'soc', 'r9k', 'lgbt', 'gif']
var triggers = [/corona/, /covid/, /COVID/, /SARS/, /sars/ ]
function triggerParse(str)
{
  if (str)
  {
      var r = []
      for (t in triggers)
      {
          var res = str.match(triggers[t])
          if (res) r.push(res)
      }
      return r;
  }

}

for (i in boards)
{
  astoria.board(boards[i])
  	.listen((context, threads, err) => {
  		if (err) {
  			//return console.log(err)
        return;
  		}

  		threads.forEach(thread => {


        var trig = triggerParse(thread.com)
        if (trig > 0) console.log(`[THREAD] https://boards.4chan.org/${boards[i]}/thread/${thread.no}: ${entities.decode(striptags(thread.com))}`)
        let unsubscribe = astoria.board(boards[i])
      	.thread(thread.no)
      	.listen((context, posts, err) => {
      		if (err) {
            	// Stop listening
          		unsubscribe()
              return;
      			//return console.log(err)
      		}

      		posts.forEach(post => {
            triggerParse(post.com)

            var trig = triggerParse(post.com)
            if (trig > 0) console.log(`[POST] https://boards.4chan.org/${boards[i]}/thread/${thread.no}: ${entities.decode(striptags(post.com))}`)
          })


      	})
      })
  	})
}
