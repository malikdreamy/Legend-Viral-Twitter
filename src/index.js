const { app, BrowserWindow, ipcMain } = require('electron');
const { dialog } = require('electron');
const path = require('path');

app.userAgentFallback = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',

    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  ipcMain.on('insertText', (event, text) => {
    twitterWindow.webContents.insertText(text);
   });

   ipcMain.on('insertTextK', (event, text) => {
    twitterWindowK.webContents.insertText(text);
   });

// Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  
  ipcMain.on('launchBrowser', async (event, params) => { 
    try {
      twitterWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
          preload: path.join(__dirname, './instaPreload.js'), //include instaPreload.js
          contextIsolation: true,
          enableRemoteModule: true,
          worldSafeExecuteJavaScript: true,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        },
      });   

      twitterWindow.on('close', async()=>{
        function clearCookies() {
          const session = twitterWindow.webContents.session
          const options = {
            storages: ['cookies', 'caches'], // Clear cookies and caches
            quotas: ['temporary', 'persistent', 'syncable'] // Clear all types of cookies
          };
          session.clearStorageData(options, (error) => {
            if (error) {
              console.error('Error clearing cookies:', error);
            } else {
              console.log('Cookies cleared successfully');
            }
          });
        }
        // Call the function to clear cookies
        clearCookies();

        twitterWindow.destroy();
        console.log("twitter window destroyed")
      })
   
      const twitterSession = twitterWindow.webContents.session;
      twitterSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
       });
       twitterSession.webRequest.onBeforeSendHeaders((details, callback) => {
         const modifiedHeaders = Object.assign({}, details.requestHeaders);
         modifiedHeaders['sec-ch-ua'] = '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"';
         callback({ cancel: false, requestHeaders: modifiedHeaders });
       });
       twitterWindow.webContents.clearHistory();
       twitterWindow.webContents.executeJavaScript(`localStorage.clear();`);
       
       twitterWindow.webContents.openDevTools();
       function clearCookies() {
         const session = twitterWindow.webContents.session
         const options = {
           storages: ['cookies', 'caches'], // Clear cookies and caches
           quotas: ['temporary', 'persistent', 'syncable'] // Clear all types of cookies
         };
         session.clearStorageData(options, (error) => {
           if (error) {
             console.error('Error clearing cookies:', error);
           } else {
             console.log('Cookies cleared successfully');
           }
         });
       }
       // Call the function to clear cookies
       clearCookies();

      const url = 'https://twitter.com/i/flow/login';
        twitterWindow.loadURL(url);
        //login process
        let signedIn = false;
        twitterWindow.webContents.on('did-navigate', async () => { 
          console.log('DID-NAVIGATE (NOT IN PAGE)')
          if(twitterWindow.webContents.getURL() == 'https://twitter.com/i/flow/login'){
           // await new Promise(r => setTimeout(r, 5000));
            console.log("signing in!")
            signedIn = true;
            twitterWindow.webContents.executeJavaScript(`
            try{
              console.clear();
              const signIn = async () =>{
                await new Promise(r => setTimeout(r, 5000));
                console.log("starting sign in")
                let username = '${params.username}';
                let pass = '${params.pass}';
                // const button = document.querySelector('[data-testid="loginButton"]');
                // button.click();
                // await new Promise(r => setTimeout(r, 4000));
                const loginBox = document.querySelector('.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu');
                console.log(loginBox)
                await new Promise(r => setTimeout(r, 3000));
                loginBox.focus();
                await new Promise(r => setTimeout(r, 3000));
                electronAPI.insertText(username);
                await new Promise(r => setTimeout(r, 3000));
                document.querySelector(".css-18t94o4.css-1dbjc4n.r-sdzlij.r-1phboty.r-rs99b7.r-ywje51.r-usiww2.r-2yi16.r-1qi8awa.r-1ny4l3l.r-ymttw5.r-o7ynqc.r-6416eg.r-lrvibr.r-13qz1uu").click();
                await new Promise(r => setTimeout(r, 3000));
                document.querySelector('input[name="password"]').focus();
                electronAPI.insertText(pass);
                await new Promise(r => setTimeout(r, 3000));
                document.querySelector('[data-testid="LoginForm_Login_Button"]').click();
              }
            signIn();

            }catch(err){
              console.log(err);
            }
            
            `)
           // go to most recent posts 
          } 

          else if (twitterWindow.webContents.getURL() == 'https://twitter.com/home'){

            console.log("at homepage " + twitterWindow.webContents.getURL());
          // twitterWindow.webContents.on('did-finish-load', async () => {

          
            console.log("going to most recent post")
           twitterWindow.webContents.executeJavaScript(` 
            try{
              const goToRecent = async () => {
                await new Promise(r => setTimeout(r, 5000));
               document.querySelectorAll(".css-4rbku5.css-18t94o4.css-1dbjc4n.r-1awozwy.r-1loqt21.r-6koalj.r-eqz5dr.r-16y2uox.r-1h3ijdo.r-1777fci.r-s8bhmr.r-1ny4l3l.r-1qhn6m8.r-i023vh.r-o7ynqc.r-6416eg")[1].click();
               await new Promise(r => setTimeout(r, 5000));
              let firstPost = document.querySelector('[data-testid="tweet"]');
              firstPost.click();
              }
              goToRecent();
              }catch(err){
                console.log(err);
              }
              `)
           // });
          }
        }); // ending did-navigate curly brace


        twitterWindow.webContents.on('did-navigate-in-page', async () =>{
        console.log("navigated in page!");
        if (twitterWindow.webContents.getURL() == "https://twitter.com/i/keyboard_shortcuts"){
            twitterWindow.webContents.executeJavaScript(`location.href = "https://twitter.com/"`);
            return;
          };

        if (twitterWindow.webContents.getURL() !== 'https://twitter.com/home'  && twitterWindow.webContents.getURL() !== 'https://twitter.com/i/flow/login' && twitterWindow.webContents.getURL() !== 'https://twitter.com/login' && twitterWindow.webContents.getURL() !== 'https://twitter.com/' && twitterWindow.webContents.getURL() !== 'https://twitter.com/compose/tweet' ) {
          console.log("down here!")
          console.log(twitterWindow.webContents.getURL());
          await new Promise(r => setTimeout(r, 8000));
          twitterWindow.webContents.executeJavaScript(`
          try{
            const checkComment = async ()=> {
              await new Promise(r => setTimeout(r, 4000));
              if(document.querySelectorAll('[aria-live="polite"]')[1]){
                await new Promise(r => setTimeout(r, 4000));
                window.location.href = 'https://twitter.com/home';
                return;
              }
              const searchString = '${params.username}';
              const regex = new RegExp(searchString);
              let commentsToSearch = document.querySelector('[aria-label="Timeline: Conversation"]').innerText;
              const shouldComment = regex.test(commentsToSearch) ? 'dontComment' : 'doComment';
              electronAPI.sendMessageToMain(shouldComment);
            }
            checkComment();
          }catch(err){
            console.log(err);
          } `)
          ipcMain.removeAllListeners('messageFromRenderer');
          let shouldComment = '';
          ipcMain.on('messageFromRenderer', async (event, message) => {
            console.log('Received message from renderer:', message);
            let shouldComment = message;
            if(shouldComment == 'doComment'){
              twitterWindow.webContents.executeJavaScript(`
              document.querySelector('[aria-label="Reply"]').click(); `);
            } else {

 let commentIteration = Number(params.iterator);
          const calculateCommentInterval = (commentIteration) => {    
            return 60 * 60 * 1000 / commentIteration;
          }
          await new Promise(r => setTimeout(r, calculateCommentInterval(commentIteration)));

            twitterWindow.webContents.executeJavaScript(`
            window.location.href = "https://twitter.com/home";`)
            }
          });

        } else if (twitterWindow.webContents.getURL() == 'https://twitter.com/compose/tweet'){
            let commentArr = params.comment;
        
          const randomComment = () => {
            for (var i = 0; i < commentArr.length ; i++) {
              let randomValue = commentArr[Math.floor(Math.random() * commentArr.length)];
              return randomValue;
            }
          };

          let commentToLeave = `${randomComment()}`;
          console.log(commentToLeave);
          await new Promise(r => setTimeout(r, 4000));
          twitterWindow.webContents.executeJavaScript(`
          try{
            const dropComment = async () => {

          let leaveComment = '${commentToLeave}';
          electronAPI.insertText(leaveComment); 
          await new Promise(r => setTimeout(r, 2000));
          document.querySelector('[data-testid="tweetButton"]').click();
            }
            dropComment();
          }catch(err){
            console.log(err)
          }`);
          
        }
          }) //end did-navigate-in-page
          
        } catch (error) {
          console.log(error);
          dialog.showMessageBox({
            type: 'info',
               message: 'Error In Process! Close Twitter Window And Retry!',
               buttons: ['OK']
             }); 
    }
  }) // ending launchBrowser curly bracket




  ipcMain.on('launchBrowserKeyword', async (event, params) => {
  
    console.log(params)
    try {
      twitterWindowK = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
          preload: path.join(__dirname, './instaPreload.js'), //include instaPreload.js
          contextIsolation: true,
          enableRemoteModule: true,
          worldSafeExecuteJavaScript: true,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        },
      });  
      twitterWindowK.on('close', async()=>{
        function clearCookies() {
          const session = twitterWindowK.webContents.session
          const options = {
            storages: ['cookies', 'caches'], // Clear cookies and caches
            quotas: ['temporary', 'persistent', 'syncable'] // Clear all types of cookies
          };
          session.clearStorageData(options, (error) => {
            if (error) {
              console.error('Error clearing cookies:', error);
            } else {
              console.log('Cookies cleared successfully');
            }
          });
        }
        // Call the function to clear cookies
        clearCookies();

        twitterWindowK.destroy();
        console.log("twitter window destroyed")
      })
   
      const twitterSessionK = twitterWindowK.webContents.session;
      twitterSessionK.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
       });
       twitterSessionK.webRequest.onBeforeSendHeaders((details, callback) => {
         const modifiedHeaders = Object.assign({}, details.requestHeaders);
         modifiedHeaders['sec-ch-ua'] = '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"';
         callback({ cancel: false, requestHeaders: modifiedHeaders });
       });
       twitterWindowK.webContents.clearHistory();
       twitterWindowK.webContents.executeJavaScript(`localStorage.clear();`);
       
       twitterWindowK.webContents.openDevTools();
       function clearCookies() {
         const session = twitterWindowK.webContents.session
         const options = {
           storages: ['cookies', 'caches'], // Clear cookies and caches
           quotas: ['temporary', 'persistent', 'syncable'] // Clear all types of cookies
         };
         session.clearStorageData(options, (error) => {
           if (error) {
             console.error('Error clearing cookies:', error);
           } else {
             console.log('Cookies cleared successfully');
           }
         });
       }
       // Call the function to clear cookies
       clearCookies();

       const url = 'https://twitter.com/i/flow/login?redirect_after_login=%2F'
       twitterWindowK.loadURL(url);
       let signedIn = false;
       twitterWindowK.webContents.on('did-navigate', async () => { 
         console.log('DID-NAVIGATE (NOT IN PAGE)');
         if(twitterWindowK.webContents.getURL() == 'https://twitter.com/i/flow/login?redirect_after_login=%2F'){
          await new Promise(r => setTimeout(r, 4000));
// twitterWindowK.webContents.executeJavaScript(`
// if (document.querySelector(".css-1dbjc4n.r-kemksi.r-1h8ys4a") !== null){
// window.location.href = "https://twitter.com/";
// }
// `);
           signedIn = true;
          // await new Promise(r => setTimeout(r, 5000));
           console.log("signing in!")
           console.log(params.username)
           twitterWindowK.webContents.executeJavaScript(`
           try{
             console.clear();
             const signIn = async () =>{
               await new Promise(r => setTimeout(r, 6000));
               console.log("starting sign in")
               let username = '${params.username}';
               let pass = '${params.pass}';
              //  const button = document.querySelector('[data-testid="loginButton"]');
              //  button.click();  
     
               await new Promise(r => setTimeout(r, 8000));
               const loginBox = document.querySelector('.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu');
               console.log(loginBox)
               await new Promise(r => setTimeout(r, 2000));
               loginBox.focus();
               await new Promise(r => setTimeout(r, 3000));
               electronAPI.insertTextK(username);
               await new Promise(r => setTimeout(r, 3000));
               document.querySelector(".css-18t94o4.css-1dbjc4n.r-sdzlij.r-1phboty.r-rs99b7.r-ywje51.r-usiww2.r-2yi16.r-1qi8awa.r-1ny4l3l.r-ymttw5.r-o7ynqc.r-6416eg.r-lrvibr.r-13qz1uu").click(); 
             
               await new Promise(r => setTimeout(r, 3000));
               document.querySelector('input[name="password"]').focus();
               electronAPI.insertTextK(pass);
               await new Promise(r => setTimeout(r, 3000));
               document.querySelector('[data-testid="LoginForm_Login_Button"]').click();
        
             }
           signIn();
           }catch(err){
             console.log(err);
           }
           
           `)
          // go to most recent posts 
         }  else if (twitterWindowK.webContents.getURL() == 'https://twitter.com/home'){
          console.log("at homepage " + twitterWindowK.webContents.getURL());
        // twitterWindow.webContents.on('did-finish-load', async () => {
          console.log("going to explore page!")
         twitterWindowK.webContents.executeJavaScript(` 
          try{
            const goToSearch = async () => {
              await new Promise(r => setTimeout(r, 6000));
              let url = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}'
              window.location = url;
            }
           goToSearch();
            }catch(err){
              console.log(err);
            }
            `)
          }
        }); //ending did-navigate curly
  
     
        let count = 0;
        let counter = -1;
        let reg = /status/;
        let reg1 = /search/;
        let scrollHeight = 300;
        let sum = 0;

        twitterWindowK.webContents.on('did-navigate-in-page', async () =>{
          if (twitterWindowK.webContents.getURL() == "https://twitter.com/i/keyboard_shortcuts"){
            twitterWindowK.webContents.executeJavaScript(`location.href = "https://twitter.com/"`);
            return;
          };


          console.log(`navigated in page! ${count++}`);
          console.log(twitterWindowK.webContents.getURL())
          await new Promise(r => setTimeout(r, 6000));
          if (reg1.test(twitterWindowK.webContents.getURL())){
            console.log("in search!!")
            
            
            await new Promise(r => setTimeout(r, 5000));
            
           if(counter >= 3){ counter = 0}

       twitterWindowK.webContents.executeJavaScript(`
        try{
            const checkTweets = async () => {
              await new Promise(r => setTimeout(r, 4000));
              if(document.querySelector('[data-testid="tweet"]') == null){
                alert("No Tweets Here! Choose Another Keyword");
                return;
              };
              await new Promise(r => setTimeout(r, 3000));
              window.scrollBy(0, ${(scrollHeight)});
              await new Promise(r => setTimeout(r, 3000));
         //let tweet = document.querySelectorAll('[data-testid="tweet"]')[${counter++}];
         let array = [];

         for(let i = 0; i <= ${counter}; i++){
          array.push(document.querySelectorAll('[data-testid="tweet"]')[i].offsetHeight);
         }
         var sum = ${sum};

          for (var i = 0; i < array.length; i++) {
          sum += array[i];
                  }
         await new Promise(r => setTimeout(r, 5000));
         electronAPI.sendMessageToMainK(sum);
                }
                checkTweets();
              }catch(err){
                console.log(err);
                location.reload();
              }
         `);

          ipcMain.once('messageFromRendererK', async (event, message) => {
            console.log('Received message from renderer:', message);


            console.log(`Event names ${ipcMain.eventNames()}`);
              console.log(`Event names lengths ${ipcMain.eventNames().length}`);

            ipcMain.removeAllListeners('messageFromRendererK');


            console.log(`Event names after remove ${ipcMain.eventNames()}`);
            console.log(`Event names lengths after remove ${ipcMain.eventNames().length}`);


            sum = message;
           
           twitterWindowK.webContents.executeJavaScript(`
            try{
              let theSum = ${sum};
              const selectTweet = async () => {
            await new Promise(r => setTimeout(r, 3000));
     
            if(theSum > 10000){
              let smaller = ${sum} / 2;
              console.log("SMALLER!!!" + smaller)
              await new Promise(r => setTimeout(r, 3000));
              console.log("scrolling twice!")
              window.scrollBy(0, smaller);
              await new Promise(r => setTimeout(r, 5000));
              window.scrollBy(0, smaller);
              await new Promise(r => setTimeout(r, 5000));
              let whenToStop1 = document.body.scrollHeight * 1.6;
              if(${sum} > whenToStop1){
                alert("No More Tweets");
                return;
              }
              let currTweet = document.querySelectorAll('[data-testid="tweet"]')[${counter}];
            currTweet.click();
              return;
            };
            window.scrollBy(0, ${sum});
            await new Promise(r => setTimeout(r, 7000));
            let whenToStop = document.body.scrollHeight * 1.6;
            if(${sum} > whenToStop){
              alert("No More Tweets To Search!");
              return;
            }
            let currentTweet = document.querySelectorAll('[data-testid="tweet"]')[${counter}];
            currentTweet.click();
              }
              selectTweet();
            }catch(err){
              console.log(err);
            }
   
   
          `);


          });

          console.log(`Counter ${counter}`)
          console.log(`Sum! ${sum}`)


          } else if( reg.test(twitterWindowK.webContents.getURL()) ) {
            console.log("IN STATUS!");
            console.log(twitterWindowK.webContents.getURL());
            await new Promise(r => setTimeout(r, 5000));

            function createRegexFromSentence(sentence) {
              if (sentence.includes(' ')) {
                sentence = sentence.replace(/\s/g, '|'); // Remove spaces
                var words = sentence.split(' '); // Split into individual words
                var regexPattern = words.join('|'); // Construct regex pattern
                return regexPattern;
              } 
              return sentence; // No spaces found, return null or handle it accordingly
            }
            
            let regToSearch = createRegexFromSentence(params.keywordInput)
           twitterWindowK.webContents.executeJavaScript(`
            try{
              const checkComment = async () => {
                await new Promise(r => setTimeout(r, 4000));
                if(document.querySelectorAll('[aria-live="polite"]')[1]){
                  await new Promise(r => setTimeout(r, 4000));
                  window.location.href = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}';
                  return;
                }

                window.scrollBy(0, 500);
                await new Promise(r => setTimeout(r, 3000));
            const searchString = '${params.username}';
              const regex = new RegExp(searchString);
              let commentsToSearch = document.querySelector('[aria-label="Timeline: Conversation"]').innerText;
              const shouldComment = regex.test(commentsToSearch) ? 'dontComment' : 'doComment';
              const postMain = document.querySelector('[data-testid="tweetText"]').innerText;
              let termToSearch = /${regToSearch}/i;
              const match = termToSearch.test(postMain) ? 'isMatch' : 'notMatch';
              const willComment = match + shouldComment;
              electronAPI.sendMessageToMainK(willComment);
            
              }
              checkComment();
            }catch(err){
              let url = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}'
              window.location.href = url;
            }
           `)
            let shouldComment = '';
            let doesMatch = '';
            
            ipcMain.on('messageFromRendererK', async (event, message) => {
              console.log('Received message from renderer:', message);
              let shouldComment = message;


              console.log(`Event names ${ipcMain.eventNames()}`);
              console.log(`Event names lengths ${ipcMain.eventNames().length}`);
              ipcMain.removeAllListeners('messageFromRendererK');


              console.log(`Event names after remove ${ipcMain.eventNames()}`);
              console.log(`Event names lengths after remove ${ipcMain.eventNames().length}`);


              if(shouldComment == 'isMatchdoComment'){
                twitterWindowK.webContents.executeJavaScript(`
                document.querySelector('[aria-label="Reply"]').click();
                `)

              } else if (shouldComment == 'notMatchdoComment') {
                twitterWindowK.webContents.executeJavaScript(`
                window.location.href = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}';
                `)
              }  else if(shouldComment == 'notMatchdontComment') {
                twitterWindowK.webContents.executeJavaScript(`
                window.location.href = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}';
                `)

              } else {

// add logic for timer
let commentIterationK = Number(params.iterator);
            const calculateCommentIntervalK = (commentIterationK) => {    
              return 60 * 60 * 1000 / commentIterationK;
            }

            console.log(`at timer counting down ${calculateCommentIntervalK(commentIterationK)}`);

            await new Promise(r => setTimeout(r, calculateCommentIntervalK(commentIterationK)));


                twitterWindowK.webContents.executeJavaScript(`
                window.location.href = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}';
                `)
              }
              })
          } else if (twitterWindowK.webContents.getURL() == 'https://twitter.com/compose/tweet'){
            console.log("now commenting!!")
            console.log(twitterWindowK.webContents.getURL());
            await new Promise(r => setTimeout(r, 5000));
            let commentArr = params.comment;
            const randomComment = () => {
              for (var i = 0; i < commentArr.length ; i++) {
                let randomValue = commentArr[Math.floor(Math.random() * commentArr.length)];
                return randomValue;
              }
            }
            let commentToLeave = `${randomComment()}`;

          twitterWindowK.webContents.executeJavaScript(`
            try{ 
              const dropCommentOnPost = async () => {
              let commentToLeave = '${commentToLeave}';
          electronAPI.insertTextK(commentToLeave);
          await new Promise(r => setTimeout(r, 3000));
          document.querySelector('[data-testid="tweetButton"]').click();
          await new Promise(r => setTimeout(r, 5000));
          let reg = /Whoops! You already said that/;
          if(reg.test(document.querySelector('[aria-labelledby="modal-header"]').innerText)){
            let url = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}'
            window.location = url;
          }
              }
              dropCommentOnPost();
            }catch(err){
              let url = 'https://twitter.com/search?q=${params.keywordInput}&src=typed_query&f=${params.page}'
              window.location = url;
            }
          
          
          `)
          }
        }); // end of did-navigate-in-page


    }catch(err){
      console.log(err);
      dialog.showMessageBox({
        type: 'info',
           message: 'Error In Process! Close Twitter Window And Retry!',
           buttons: ['OK']
         }); 
    }
 
  }) //ending launchBrowserKeyword


}; // ending creatWindow main function


ipcMain.on('stopBot', (event) => {
  try {
    if (twitterWindow) {
      console.log(`ipcMain Listener Count: ${ipcMain.listenerCount('launchBrowser')}`)
      twitterWindow.destroy();
      twitterWindow = null;
    }
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('stopBotKeyWord', (event) => {
  try {
    if (twitterWindowK) {
      console.log(`ipcMain Listener Count: ${ipcMain.listenerCount('launchBrowserKeyword')}`)
      twitterWindowK.destroy();
      twitterWindowK = null;
    }
  } catch (err) {
    console.log(err);
  }
});

app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
