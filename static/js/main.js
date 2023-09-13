let FILES={};
let FILECOUNT=0;
let TRASH=document.getElementById("message").lastElementChild;
let MESSAGE=document.getElementById("message").firstElementChild;

function displayMessage(){
    if(FILECOUNT===0){
        TRASH.style.visibility="hidden";
        return `You have not picked any files`;
    }
    else{
        TRASH.style.visibility="visible";
        return `${FILECOUNT} file${FILECOUNT>1?'s':''} staged for upload`;
    }
}

function removeFilesFromStage(event){
    let stageContents=document.getElementById("stage-contents");
    let stagedFiles=Array.from(stageContents.children);
    stagedFiles.forEach(stagedFile=>removeFileFromStage(stagedFile));
}

function removeFileFromStage(){
    let event=arguments[0];
    let stagedFile=event instanceof PointerEvent? event.target.parentElement : event;
    let fileName=stagedFile.firstElementChild.innerText;
    
    stagedFile.style.left="100%";
    setTimeout(()=>{
        stagedFile.remove();
        MESSAGE.innerText=displayMessage();
    },1000);
    delete FILES[fileName];
    FILECOUNT--;
}

function addFilesToStage(event){
    let files=Array.from(event.target.files);
    event.target.value="";
    if(files.length>0) stageFiles(files);
}

function stageFiles(files){
    // <div class="staged-file">
    //     <span class="file-name">file-name.svg</span>
    //     <span class="remove-file" onclick=removeFile(event)>X</span>
    // </div>

    let stageContents=document.getElementById("stage-contents");
    files.forEach(file=>{
        if(!(file["name"] in FILES)){
            let fileName=document.createElement("span");
            fileName.innerText=file["name"];
            fileName.classList.add("file-name");
    
            let removeFile=document.createElement("span");
            removeFile.innerText="X";
            removeFile.classList.add("remove-file");
            removeFile.addEventListener("click",removeFileFromStage);
    
            let stagedFile=document.createElement("div");
            stagedFile.appendChild(fileName);
            stagedFile.appendChild(removeFile);
            stagedFile.classList.add("staged-file");
    
            stageContents.appendChild(stagedFile);
            FILES[file["name"]]=file;
            FILECOUNT++;
            MESSAGE.innerText=displayMessage();
        }
    });
}