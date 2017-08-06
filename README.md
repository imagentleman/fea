# FEA
Front End Activities: An interactive playground to learn about Front End

![Screenshot](http://imagentleman.github.io/fea-screenshot.jpg)

## Demo
https://imagentleman.github.io/fea/

## Usage
Just run an HTTP server on the ```public``` folder (e.g with https://www.npmjs.com/package/httpea or https://docs.python.org/2/library/simplehttpserver.html).

All your work inside the app will be saved automatically on the browser local storage (indexedDB).

## Activities/Exercises
You can easily create new ones. Just create a new folder under ```/code``` and create the 4 files:

* subject.html is the landing screen (usually just the title and subtitle of the exercise).
* explaination.html is a longer account of what we want to do (can have any HTML and be as long as we want).
* code.html is the mixed HTML/CSS/Javascript file that we'll load on the interactive editor.
* tests.js are the unit tests that score if you completed the exercise.

## Tech Stack
* https://github.com/Microsoft/monaco-editor
* https://github.com/vuejs/vue
* https://github.com/localForage/localForage
* https://github.com/imagentleman/fittest
