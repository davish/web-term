#Web-Term

A webapp to interactively stream java CLI programs to the browser.

To install:

- `git clone https://github.com/dbh937/web-term.git`
- `cd web-term`
- `npm install`

To run:

- `node app.js`

1. Make a directory called `javafiles`, and one inside that called `compiled`.
  - All within the web-term directory.
  - TODO: generate these directories if they're not there in the first place.
2. Put java source files into the first folder.
3. Visit `localhost:3000` in a browser.
4. Type in name of file in the input area and hit enter.
5. Wait a few seconds for your file to compile
6. When alerted, your program is ready to run!

##WARNING
This app runs Java code with as many permissions as are given to the node app.

***I have no idea what I'm doing.*** Trusting this code to run on your computer is your own decision, and I am not responsible for anything bad that happens as a result. There will be more security precautions in the future, but as of now, there are NONE.