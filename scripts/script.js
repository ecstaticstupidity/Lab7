// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;
const entryArr = [];


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

  else if(history.state.page == "settings") {
    router.setState("settings");
  }

  else {
    for(let i = 0; i < entryArr.length; i++) {
      if(history.state.page == "Entry: " + i) {
        let title = document.querySelector('h1');
        let text = 'Entry ' + (i+1);
        title.innerHTML = text;
        router.setState('entry');
      }
    }
  }
}

// Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

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

              let prevEntryElem = document.querySelector('entry-page');
              let body = prevEntryElem.parentNode
              body.removeChild(prevEntryElem);
              let entryPageElement = document.createElement('entry-page');
              entryPageElement.entry = newPost.entry;
              body.appendChild(entryPageElement);
              history.pushState({page: "Entry: " + i}, "Entry " + i, "#Entry" + i);
              let title = document.querySelector('h1');
              let text = 'Entry ' + (i+1);
              title.innerHTML = text;
              router.setState("entry");
            }
          }
        });
      });
    });
});
