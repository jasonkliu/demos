YaleDemos
=========

This is the site for the Yale Demos page, hosted at www.yale.edu/demos

If you need to upload the site to the Yale domain, you will have to obtain
authentication to push to the server. Please contact the current webmaster,
Jason Liu, for more information.

This `gh-pages` branch uses Jekyll to serve a static set of webpages for documentation purposes.
The `master` branch contains the current Demos website (as of 10 June 2014) without images to save space.
The `f10photos` branch contains the site with a photos slideshow (from fall 2010) without images to save space.

Running locally:
```
bundle install  
bundle exec jekyll serve  
http://localhost:4000/shifts/  
```

If the Jekyll site works properly when running locally but doesn't work on gh-pages 
or a remote server, try these resources: 
http://jekyllrb.com/docs/deployment-methods/    
http://jekyllrb.com/docs/github-pages/   
https://help.github.com/articles/troubleshooting-github-pages-build-failures  

1. Ill-defined url: and baseurl: in config.yml. Url is the root server; baseurl is the 
folder on the server. Check whether the leads to any real location; if not, correct for it.  
2. http v. https. If you're using HTTPS Everywhere, github will allow you to redirect to a
https version of the github.io site -- but if the links to an http version (or vice versa), 
modern browsers will refuse to render it in order to maintain cross-site security. To solve 
for this, make sure that the website is consistently accessed on a single protocol.

