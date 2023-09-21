let FILES={}; // holds all staged files
let FILECOUNT=0; // holds number of staged files
let FILESLOCKED=false; // controls access to FILES in user operations

let TRASH=document.getElementById("message").lastElementChild;
let MESSAGE=document.getElementById("message").firstElementChild;

/**
 * informs user of the current stage state
 * enables user to clear the stage
*/
function displayMessage(){
    if(FILECOUNT===0){
        TRASH.style.visibility="hidden";
        return `You have not picked any files`;
    }
    else{
        TRASH.style.visibility="visible";
        return `${FILECOUNT} file${FILECOUNT>1?'s':''} staged for processing`;
    }
}

/**
 * handles removing staged file from the DOM 
 * handles removing file from the FILES object
*/
function remove(stagedFile){
    let fileName=stagedFile.firstElementChild.innerText;
    stagedFile.style.left="100%";
    setTimeout(()=>{
        stagedFile.remove();
        MESSAGE.innerText=displayMessage();
    },1000);
    delete FILES[fileName]; FILECOUNT--;
}

/**
 * removes all files from the stage
 */
function removeFilesFromStage(){
    if(FILESLOCKED) return;
    FILESLOCKED=true;

    let stageContents=document.getElementById("stage-contents");
    let stagedFiles=Array.from(stageContents.children);
    stagedFiles.forEach(stagedFile=>remove(stagedFile));
    setTimeout(()=>FILESLOCKED=false,1000);
}

/**
 * removes user selected file from the stage
 */
function removeFileFromStage(){
    if(FILESLOCKED) return;
    FILESLOCKED=true;
    
    remove(arguments[0].target.parentElement);
    setTimeout(()=>FILESLOCKED=false,1000);
}

/**
 * adds selected file(s) to the stage
 */
function addFilesToStage(event){
    if(FILESLOCKED) return;
    FILESLOCKED=true;

    let files=Array.from(event.target.files);
    event.target.value="";
    if(files.length>0) stageFiles(files);
    setTimeout(()=>FILESLOCKED=false,1000);
}

/**
 * adds staged file to the DOM
 * adds file to the FILES object
 */
function stageFiles(files){
    // Staged file entity structure
    /**
     * <div class="staged-file">
     *     <span class="file-name">file-name.svg</span>
     *     <span class="remove-file" onclick=removeFile(event)>X</span>
     * </div>
    */

    let stageContents=document.getElementById("stage-contents");
    files.forEach(file=>{
        if(!(file["name"] in FILES)){
            // <span class="file-name">file-name.svg</span>
            let fileName=document.createElement("span");
            fileName.innerText=file["name"];
            fileName.classList.add("file-name");
    
            // <span class="remove-file" onclick=removeFile(event)>X</span>
            let removeFile=document.createElement("span");
            removeFile.innerText="X";
            removeFile.classList.add("remove-file");
            removeFile.addEventListener("click",removeFileFromStage);
    
            // <div class="staged-file">
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

let ROOT=document.body;
let THEMELOCKED=false; // controls access to the UI
let INITIALDARKMODE=false; // set if dark theme is stored
let BUTTON=document.getElementById("toggle-theme").firstElementChild;

/**
 * changes the UI depending on the theme selected by the user
*/
function changeUI(add,remove,background){
    ROOT.classList.add(add);
    ROOT.classList.remove(remove);
    BUTTON.style.backgroundImage=background;
    THEMELOCKED=false;
    console.log(ROOT.classList);
}

/**
 * sets user selected theme
 * available themes; dark-mode, light-mode
 */
function toggleTheme(){
    if(THEMELOCKED) return;
    THEMELOCKED=true;

    let themeTime=getComputedStyle(ROOT).getPropertyValue("--theme-time");
    let time=Number.parseFloat(themeTime)*1000;
    let modes=BUTTON.classList;

    if(modes.contains("dark-mode") || INITIALDARKMODE){
        setTimeout(()=>changeUI(
            "light-mode-colors",
            "dark-mode-colors",
            `url('../static/images/sun.png')`
        ),time);
        modes.add("light-mode"); modes.remove("dark-mode");
        /**
         * stores the current theme in the application local storage
         * Inspect > Application tab > Storage > localStorage
        */
        localStorage.setItem("mode","light-mode");
        INITIALDARKMODE=false;
    }
    else if(modes.contains("light-mode") || modes.length===0){
        setTimeout(()=>changeUI(
            "dark-mode-colors",
            "light-mode-colors",
            `url('../static/images/moon.png')`
        ),time);
        modes.add("dark-mode"); modes.remove("light-mode");
        /**
         * stores the current theme in the application local storage
         * Inspect > Application tab > Storage > localStorage
        */
        localStorage.setItem("mode","dark-mode");
    }
}

/**
 * controls persistent UI theme
 * checks the local storge for the stored theme
 * applies the theme to the UI
 */
document.addEventListener("DOMContentLoaded",()=>{
    if(localStorage.getItem("mode")==="dark-mode"){
        INITIALDARKMODE=true;
        BUTTON.style.left="calc(100% - 30px)";
        changeUI(
            "dark-mode-colors",
            "light-mode-colors",
            `url('../static/images/moon.png')`
        );
    }
});