const { ipcRenderer } = require('electron');

const submitBtn = document.getElementById("submit-button");
const addCommentBtn = document.getElementById("add-comment");
const stopBot = document.getElementById("stop-button");
const comment = document.getElementById("commentGroup");
const userName = document.getElementById("username");
const password = document.getElementById("password");
const iteration = document.getElementById("iteration");
const submitBtnKeyword = document.getElementById("submit-button-keyword");
const addCommentBtnKeyword = document.getElementById("add-comment-keyword");
const stopBotKeyword = document.getElementById("stop-button-keyword");
const commentKeyword = document.getElementById("commentGroupKeyword");
const usernameKeyword = document.getElementById("usernameKeyword");
const passwordKeyword = document.getElementById("passwordKeyword");
const iterationKeyword = document.getElementById("iterationKeyword");
const keywordInput = document.getElementById("keyword")
const topRadio = document.getElementById("TopTweets");
const recentRadio = document.getElementById("RecentTweets");


if( localStorage.getItem("usernameKeyword") && localStorage.getItem("passwordKeyword") && localStorage.getItem("iterationKeyword") && localStorage.getItem("commentsKeyword")){
    let savedUserKeyword = localStorage.getItem("usernameKeyword");
    let savedPassKeyword = localStorage.getItem("passwordKeyword");
    let savedIterationKeyword = Number(localStorage.getItem("iterationKeyword"))
    let commentsKeyword = JSON.parse(localStorage.getItem("commentsKeyword"));
    let keywordInputVal = localStorage.getItem("keyword")
    console.log(`commentsKeyword ${commentsKeyword}`)
    commentKeyword.querySelector("input").value = commentsKeyword[0];
    usernameKeyword.value = savedUserKeyword;
    passwordKeyword.value = savedPassKeyword;
    iterationKeyword.value = savedIterationKeyword;
    keywordInput.value = keywordInputVal;

        for( var i = 1; i < commentsKeyword.length; i++){
        const newCommentElKeyword = commentKeyword.cloneNode(true);
        const deleteEl = `<button class="btn btn-secondary btn-block deleteBtn">Delete Comment</button>`
        newCommentElKeyword.innerHTML += deleteEl;
        document.getElementById("addedCommentsKeyword").appendChild(newCommentElKeyword);
        console.log(commentsKeyword[i])
       newCommentElKeyword.querySelector("input").value = commentsKeyword[i]
        newCommentElKeyword.querySelector(".deleteBtn").addEventListener("click", (event)=>{
            let btn = event.target;
            btn.parentElement.remove();
    })
    };
}

addCommentBtnKeyword.addEventListener("click", ()=>{
    const newCommentElKeyword = commentKeyword.cloneNode(true);
    const deleteEl = `<button class="btn btn-secondary btn-block deleteBtn">Delete Comment</button>`
    newCommentElKeyword.innerHTML += deleteEl;
    document.getElementById("addedCommentsKeyword").appendChild(newCommentElKeyword);
        newCommentElKeyword.querySelector(".deleteBtn").addEventListener("click", (event)=>{
        let btn = event.target;
        btn.parentElement.remove();
})
})


const runBotKeyword = () =>{

    if(usernameKeyword.value == "" || passwordKeyword.value == ""){
        alert("Must Enter USERNAME & PASSWORD");
        return;
    }

    let reg = /\d+/g;
    const iterationValKeyword = Number(iterationKeyword.value);
    if(iterationValKeyword > 60){
        alert("Cannot Exceed Over 60 Comments Per Hour! Your Account Would Be Flagged & Banned By Instagram. Please choose a number 60 or below")
        return;
    }
    if(iterationValKeyword == 60){
        var result = confirm('Woah! Your Account Will Comment Once Every Minute! Are You Sure You Want To Continue?')
        if (result === true){
        }
        else return;}

    if (reg.test(iterationValKeyword) == false || iterationValKeyword == 0 || iterationValKeyword < 0){
      alert('Must Enter A Valid Number For How Many Times You Want To Comment Per Hour')
      return;
    };
    let commentsKeyword = document.querySelectorAll(".commentsKeyword");
    commentsKeyword.forEach((comment) =>{
    if(comment.value == ""){
        alert("Cannot leave empty comment field. Either add comment or delete empty field.");
        throw "Cannot leave empty comment field. Either add comment or delete empty field."
    }
    })

    if(keywordInput.value == ""){
        alert("Must Enter A Keyword To Search For!");
        return;
    }



    let radioSelected = 'top';
    if(recentRadio.checked){
        radioSelected = 'live';

    } 

    const commentArrKeyword = [];
    commentsKeyword.forEach(comment => commentArrKeyword.push(comment.value));
    console.log(commentArrKeyword)

    localStorage.setItem("usernameKeyword", usernameKeyword.value.toLowerCase());
    localStorage.setItem("passwordKeyword", passwordKeyword.value);
    localStorage.setItem("commentsKeyword", JSON.stringify(commentArrKeyword));
    localStorage.setItem("iterationKeyword", JSON.stringify(iterationValKeyword));
    localStorage.setItem("keyword", keywordInput.value);

    let objParamsKeyword = {
        username: `${usernameKeyword.value}`,
        pass: `${passwordKeyword.value}`,
       comment: null,
       iterator: iterationValKeyword,
       keywordInput: keywordInput.value,
       page: radioSelected
    };

objParamsKeyword.comment = commentArrKeyword;
ipcRenderer.send('launchBrowserKeyword', objParamsKeyword);

}
submitBtnKeyword.addEventListener("click", runBotKeyword);



stopBotKeyword.addEventListener("click", async ()=>{
    try{
    ipcRenderer.send('stopBotKeyWord');
    alert("Bot Process Successfully Stopped!");
    }catch(err){
        alert(err);
    }
})








if( localStorage.getItem("username") && localStorage.getItem("password") && localStorage.getItem("iteration")){
    let savedUser = localStorage.getItem("username");
    let savedPass = localStorage.getItem("password");
    let savedIteration = Number(localStorage.getItem("iteration"))
    let comments = JSON.parse(localStorage.getItem("comments"));
    comment.querySelector("input").value = comments[0];
    userName.value = savedUser;
    password.value = savedPass;
    iteration.value = savedIteration;

        for( var i = 1; i < comments.length; i++){
        const newCommentEl = comment.cloneNode(true);
        const deleteEl = `<button class="btn btn-secondary btn-block deleteBtn">Delete Comment</button>`
        newCommentEl.innerHTML += deleteEl;
        document.getElementById("addedComments").appendChild(newCommentEl);
        console.log(comments[i])
       newCommentEl.querySelector("input").value = comments[i]
        newCommentEl.querySelector(".deleteBtn").addEventListener("click", (event)=>{
            let btn = event.target;
            btn.parentElement.remove();
    })
    };
}

addCommentBtn.addEventListener("click", ()=>{
    const newCommentEl = comment.cloneNode(true);
    const deleteEl = `<button class="btn btn-secondary btn-block deleteBtn">Delete Comment</button>`
    newCommentEl.innerHTML += deleteEl;
    document.getElementById("addedComments").appendChild(newCommentEl);
        newCommentEl.querySelector(".deleteBtn").addEventListener("click", (event)=>{
        let btn = event.target;
        btn.parentElement.remove();
})
})

const runBot = () =>{

    if(userName.value == "" || password.value == ""){
        alert("Must Enter USERNAME & PASSWORD");
        return;
    }

    let reg = /\d+/g;
    const iterationVal = Number(iteration.value);
    if(iterationVal > 60){
        alert("Cannot Exceed Over 60 Comments Per Hour! Your Account Would Be Flagged & Banned By Instagram. Please choose a number 60 or below")
        return;
    }
    if(iterationVal == 60){
        var result = confirm('Woah! Your Account Will Comment Once Every Minute! Are You Sure You Want To Continue?')
        if (result === true){
        }
        else return;}

    if (reg.test(iterationVal) == false || iterationVal == 0 || iterationVal < 0){
      alert('Must Enter A Valid Number For How Many Times You Want To Comment Per Hour')
      return;
    };
    let comments = document.querySelectorAll(".comments");
    comments.forEach((comment) =>{
    if(comment.value == ""){
        alert("Cannot leave empty comment field. Either add comment or delete empty field.");
        throw "Cannot leave empty comment field. Either add comment or delete empty field."
    }
    })
    const commentArr = [];
    comments.forEach(comment => commentArr.push(comment.value));
    console.log(commentArr)

    localStorage.setItem("username", userName.value.toLowerCase());
    localStorage.setItem("password", password.value);
    localStorage.setItem("comments", JSON.stringify(commentArr))
    localStorage.setItem("iteration", JSON.stringify(iterationVal));

    let objParams = {
        username: `${userName.value}`,
        pass: `${password.value}`,
       comment: null,
       iterator: iterationVal
    };

objParams.comment = commentArr;
ipcRenderer.send('launchBrowser', objParams);

}

const stopProcess = () =>{
    try{
ipcRenderer.send('stopBot');
alert("Bot Process Successfully Stopped!")
    }catch(err){
        alert(err)
    }

}



submitBtn.addEventListener("click", runBot);


stopBot.addEventListener("click", stopProcess);

