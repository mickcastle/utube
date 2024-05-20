# Locally hosted mp4 player

This is a simple mp4 player that can play mp4 files from the local storage. It is built using Vite and HTML5 video player.

## Features

- Play mp4 files from local storage
- Navigator key bindings for play/pause, volume up/down, next/previous video
- Responsive design
- Filter videos by name by typing anywhere in the app as it is focused on keydown event
- Scroll pretty much anywhere on the page to scroll the video list
- Click on the video name to play the video

## How to use

- Clone the repository
- Run `yarn install`
- Create an assets folder in `public` and add your mp4 files there
- Run `node indexMusic.js` to create the index.json file which will be used to list the videos
- Run `yarn start` to start the server
