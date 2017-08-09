var RSS = require('rss');
var FeedParser = require('feedparser');
var request = require('request');
var express = require('express');
var app = express();

app.listen(process.env.PORT || 80);

app.get('/',function(req, res){

  var tags = req.query.tags;
  var authors = req.query.authors;
  var type = req.query.type;

  if(tags === undefined)
    tags = [];
  else if(!Array.isArray(tags))
    tags = [tags];

  if(authors === undefined)
    authors = [];
  else if(!Array.isArray(authors))
    authors = [authors];

  if(type === undefined)
    type = [];
  else if(!Array.isArray(type))
    type = [type];

  tags = tags.map(v => v.replace('_', ' '));
  authors = authors.map(v => v.replace('_', ' '));
  type = type.map(v => v.replace('_', ' '));

  fetch("http://xml.ehgt.org/ehg.xml", tags, authors, type, function(publish){
      res.send(publish.xml());
  });

})

function fetch(feed, tags, authors, type, callback) {
  var req = request(feed, {timeout: 10000, pool: false});

  req.setMaxListeners(50);

  var feedparser = new FeedParser();

  var publish = new RSS({
      title: 'e-hentai : ' + tags + authors,
      description: 'Custom e-hentai feed',
      feed_url: 'http://xml.ehgt.org/ehg.xml',
      language: 'en',
      pubDate: new Date()
  });

  // Define our handlers
  req.on('response', function(res) {
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
    var encoding = res.headers['content-encoding'] || 'identity'
    res.pipe(feedparser);
  });

  feedparser.on('end', function(){
    callback(publish);
  });

  feedparser.on('readable', function() {
    var item;

    while (item = this.read()) {

      var url_s = item.link.split("/");
      var gid = url_s[4];
      var pt = url_s[5];

      var item_tags;
      var item_author;

      item_tags =
        item.summary.split(', ').map(v => v.replace(/\w*:/, '').toLowerCase());

      var flag = true;

      if(tags.length > 0){
          for(var k in tags){
            flag = flag && item_tags.reduce((r, it) => (
                r || it.indexOf(tags[k].toLowerCase()) !== -1
            ), false)
          }
      }

      if(flag){
        item.description += "<br><a href=http://g.e-hentai.org/hathdler.php?gid="+gid+"&t="+pt+">hathdl</a><br>";
        publish.item({
          title:  item.title,
          description: item.description,
          url: item.link, 
          date: item.date
        });
      }
    }
  });

}
