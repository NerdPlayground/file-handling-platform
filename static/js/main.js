let FILES={};
let FILECOUNT=0;
let FILESLOCKED=false;
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

function remove(stagedFile){
    let fileName=stagedFile.firstElementChild.innerText;
    stagedFile.style.left="100%";
    setTimeout(()=>{
        stagedFile.remove();
        MESSAGE.innerText=displayMessage();
    },1000);
    delete FILES[fileName]; FILECOUNT--;
}

function removeFilesFromStage(){
    if(FILESLOCKED) return;
    FILESLOCKED=true;

    let stageContents=document.getElementById("stage-contents");
    let stagedFiles=Array.from(stageContents.children);
    stagedFiles.forEach(stagedFile=>remove(stagedFile));
    setTimeout(()=>FILESLOCKED=false,1000);
}

function removeFileFromStage(){
    if(FILESLOCKED) return;
    FILESLOCKED=true;
    
    remove(arguments[0].target.parentElement);
    setTimeout(()=>FILESLOCKED=false,1000);
}

function addFilesToStage(event){
    if(FILESLOCKED) return;
    FILESLOCKED=true;

    let files=Array.from(event.target.files);
    event.target.value="";
    if(files.length>0) stageFiles(files);
    setTimeout(()=>FILESLOCKED=false,1000);
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