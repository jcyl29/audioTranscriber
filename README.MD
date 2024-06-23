# Run React 18+ without a build step nor a transpiler!
# How?
* Native js module support
  * Require local server to avoid CORS errors from module imports
  * Use a tool like [Simple Web Server](https://simplewebserver.org/) make a localhost
* [esh.sh](https://esm.sh/) to import React from CDN
  * Put `https://esm.sh/react-dom` in the browser and it auto resolve to the latest version
  * Will work with any other package, such as [htm](https://github.com/developit/htm)
* htm, although it has some new syntax, will give JSX support, and thus eliminate Babel dependency
* Only added package.json for prettier and later test library
## Instructions
* clone repo
* Set up localhost with simple web server
* go the localhost url provided from above
* That's it!