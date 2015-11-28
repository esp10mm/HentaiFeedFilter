HentaiFeedFilter
================

You can use this to filter E-Hentai rss feed , so it will never be messy and annoying again.

Run the service:
----------------
		npm install
		node server.js
Then , you can subscribe the url like following with your rss reader:

    http://yourdomain/?tags=tagname
    http://yourdomain/?authors=authorname

Demo:
-----
    http://hentaifeedfilter.herokuapp.com/?tags=non-h
    http://hentaifeedfilter.herokuapp.com/?type=doujinshi
    http://hentaifeedfilter.herokuapp.com/?type=doujinshi&&tags=chinese
    http://hentaifeedfilter.herokuapp.com/?type=manga&&tags=Taishinkokuoh%20Anton

The filter directly read E-Hentai rss source and response you with filtering result , so it might be no result.
By the way, the "authors" parameter means the uploader of e-hentai not artist. If you want to subscribe by artist , you should add artist name to "tags" parameter.
