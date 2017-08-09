HentaiFeedFilter
================

You can use this to filter E-Hentai rss feed , so it will never be messy and annoying again.

Run the service:
----------------
		npm install
		node server.js
Then , you can subscribe the url like following with your rss reader:

    http://yourdomain/?tags=tagname

Demo:
-----
    Basic Usage
    http://hentaifeedfilter.herokuapp.com/?tags=non-h
    
    Filter by type
    http://hentaifeedfilter.herokuapp.com/?tags=doujinshi
    
    Filter by artist name
    http://hentaifeedfilter.herokuapp.com/?tags=taniguchi-san
    
    Filter by multiple tag
    http://hentaifeedfilter.herokuapp.com/?tags=doujinshi&&tags=english
    
    Filter by tag including space (big breasts for example)
    http://hentaifeedfilter.herokuapp.com/?tags=big_breasts

The filter directly read E-Hentai rss source and response you with filtering result , so it might be no result.
