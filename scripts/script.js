// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;
const entryArr = [];
const indEntLoc = document.querySelector('entry-page');

//this listens for clicking the title
let titleBtn = document.querySelector("h1");
titleBtn.addEventListener('click', () => {
  history.pushState({page: "default"}, "", "https://ecstaticstupidity.github.io/Lab7/");
  router.setState("default");
});

//this listens for clicking the settings button
let settingsBtn = document.querySelector('[alt = "settings"]');
settingsBtn.addEventListener('click', () => {

  if(document.location == "https://ecstaticstupidity.github.io/Lab7/#Settings") {
    return;
  }
  history.pushState({page: "settings"}, "Settings", "#Settings");
  router.setState("settings");
});


//this listens for page going forward/backward in history
window.onpopstate = () => {
  if(history.state.page == "default") {
    router.setState("default");
  }

  else if(history.state.page == "Settings") {
    router.setState("settings");
  }
}

// Make sure you register your service worker here too

//this listens for the page booting up
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        entryArr.push(newPost);
        document.querySelector('main').appendChild(newPost);

        //listens for when you click an entry
        newPost.addEventListener('click', () => {
          for(let i = 0; i < entryArr.length; i++) {
            if(entryArr[i] == newPost) {

              history.pushState({page: "Entry: " + i}, "Entry " + i, "#Entry" + i);
              router.setState("entry");

              console.log(indEntLoc);

              let entryPageElement = document.createElement('entry-page');
              entryPageElement.entry = newPost.entry;
              console.log(entryPageElement.entry);
              indEntLoc.appendChild(entryPageElement);
              

            }
          }
        });
      });
    });
});
