# Spotify Playlist Creator
![image](https://github.com/user-attachments/assets/2f234d1d-c9d3-4def-90e7-6784cc65b87a)


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features
- search for artists to find their top songs
- preview the songs by clicking the play button (some songs on Spotify don't have a preview file)
- add and remove songs from the playlist
- name the playlist
- save the playlist
- error messages when not setting a name or when the playlist is empty

## Tech Stack
- HTML
- CSS
- React

## Available Scripts

### create a .env
To use the Spotify API you'll need to create a account at [](https://developer.spotify.com/). Then copy the Client ID from your profile and paste it into the `.env` file in this format:\
`REACT_APP_SPOTIFY_CLIENT_ID=client-id-here`\
Then additionally add the client secret:\
`REACT_APP_SPOTIFY_CLIENT_SECRET=client-secret-here`\
Now you're good to go 👍

In the project directory, you can run:

### `npm install`
and then
### `npm start`

This will install dependencies and run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\


