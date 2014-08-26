var RSS = require('rss');
var FeedParser = require('feedparser');
var request = require('request');
var express = require('express');
var app = express();
app.listen(process.env.PORT || 3000);

var publish;

app.get('/',function(req,res){

  var tags = req.query.tags;
  if(!Array.isArray(tags))
    tags = [tags];
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("Request from "+ip+" for " + tags);
  fetch("http://xml.ehgt.org/ehg.xml",tags,function(){
      res.send(publish.xml());
  });

})

function fetch(feed,tags,callback) {
  // Define our streams
  var req = request(feed, {timeout: 10000, pool: false});
  req.setMaxListeners(50);
  // Some feeds do not respond without user-agent and accept headers.
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
     .setHeader('accept', 'text/html,application/xhtml+xml');

  var feedparser = new FeedParser();

  publish = new RSS({
      title: 'e-hentai : ' + tags,
      description: 'Custom e-hentai feed',
      feed_url: 'http://example.com/rss.xml',
      author: 'aaadult',
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
      item.summary = item.summary.substring(6,item.summary.indexOf("Description"));
      item_tags = item.summary.split(", ");
      var flag = true;

      for(var k in tags){

        if(item_tags.indexOf(tags[k])!=-1)
          flag = flag && true;
        else
          flag = flag && false;

      }
      if(flag){
        item.description += "<br><a href=http://g.e-hentai.org/hathdler.php?gid="+gid+"&t="+pt+">hathdl</a>";
        publish.item({
          title:  item.title,
          description: item.description,
          url: item.link, // link to the item
          date: item.date
        });
      }
    }
  });
}
