var RSS = require('rss');
var FeedParser = require('feedparser');
var request = require('request');
var express = require('express');
var app = express();

app.listen(process.env.PORT || 80);

var publish;
var authors;
var tags;
var type;

app.get('/',function(req, res){

  tags = req.query.tags;
  authors = req.query.authors;
  type = req.query.type;

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

  fetch("http://xml.ehgt.org/ehg.xml", function(){
      res.send(publish.xml());
  });

})

function fetch(feed, callback) {
  var req = request(feed, {timeout: 10000, pool: false});

  req.setMaxListeners(50);

  var feedparser = new FeedParser();

  publish = new RSS({
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
    callback();
  });

  feedparser.on('readable', function() {
    var item;

    while (item = this.read()) {

      var url_s = item.link.split("/");
      var gid = url_s[4];
      var pt = url_s[5];

      var item_tags;
      var item_author;

      item_tags = item.summary.substring(6, item.summary.indexOf("Description")).toLowerCase().split(", ");
      item_author = item.author.toLowerCase();
      item_title = item.title.toLowerCase();

      var flag = true;

      if(tags.length > 0){

          for(var k in tags){
            if(item_tags.indexOf(tags[k].toLowerCase()) != -1)
              flag = flag && true;
            else
              flag = flag && false;
          }
      }

      if(authors.length > 0){
          for(var k in authors)
            authors[k] = authors[k].toLowerCase();

          if(authors.indexOf(item_author) != -1)
            flag = flag && true;
          else
            flag = flag && false;
      }

      if(type.length > 0) {
          for(var k in type) {
              type[k] = type[k].toLowerCase();
              
              if(item_title.indexOf(type[k]) != -1)
                  flag = flag && true;
              else
                flag = flag && false;
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
