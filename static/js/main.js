var imageKit= new ImageKit({
    publicKey: "public_e1TZPeVWcR0Pf8s2sWWRc1gqPN4=",
    urlEndpoint: "https://ik.imagekit.io/uxrynlkmb",
});

let FILES={};
let FILECOUNT=0;
let MESSAGE=document.getElementById("message");

function displayMessage(){
    return FILECOUNT===0?
    `You have not picked any files` :
    `${FILECOUNT} file${FILECOUNT>1?'s':''} staged for upload`;
}

function removeFileFromStage(){
    let event=arguments[0];
    let stagedFile=event.target.parentElement;
    let fileName=stagedFile.firstElementChild.innerText;
    
    stagedFile.style.left="100%";
    setTimeout(()=>{stagedFile.remove();},1000);
    delete FILES[fileName];
    FILECOUNT--;
    MESSAGE.innerText=displayMessage();
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