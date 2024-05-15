let container = document.querySelector(".container")
let video = document.querySelector("video")
let playPauseBTN = document.querySelector(".playPauseBTN")
let miniPlayerBTN = document.querySelector(".miniPlayerBTN")
let theaterBTN = document.querySelector(".theaterBTN")
let fullScreenBTN = document.querySelector(".fullScreenBTN")
let volumeBTN = document.querySelector(".volumeBTN")
let volumeRange = document.querySelector(".volumeRange")
let currentTime = document.querySelector(".currentTime")
let allTime = document.querySelector(".allTime")
let speedBTN = document.querySelector(".speedBTN")
let previewImg = document.querySelector(".preview_img")
let thumbnailImg = document.querySelector(".thumbnail_img")
let timelineContainer = document.querySelector(".timeline_container")

/*---------------------*/
document.addEventListener("keydown",function (e) {
   let tagName = document.activeElement.tagName.toLocaleLowerCase()
   if ( tagName === "input" ) {
      return;
   }
   switch (e.key.toLocaleLowerCase()) {
      case " ":
         if ( tagName === "button" ) {
            return;
         }
      case "k":
         toggleVideo()
         break;
      case "f":
         toggleFullScreen()
         break;
      case "t":
         toggleTheater()
         break;
      case "i":
         toggleMiniPlayer()
         break;
      case "m":
         toggleMuted()
         break;
      case "j":
      case "arrowleft":
         video.currentTime -= 5;
         break;
      case "l":
      case "arrowright":
         video.currentTime += 5;
         break;
      default:
         break;
   }
})
/*---------------------*/
playPauseBTN.addEventListener("click" , toggleVideo)
video.addEventListener("click" , toggleVideo)
video.addEventListener("play",function () {
   container.classList.remove("paused")
})
video.addEventListener("pause",function () {
   container.classList.add("paused")
})
function toggleVideo() {
   video.paused ? video.play() : video.pause() ;
}
/*---------------------*/
miniPlayerBTN.addEventListener("click" , toggleMiniPlayer)
theaterBTN.addEventListener("click" , toggleTheater)
fullScreenBTN.addEventListener("click" , toggleFullScreen)

function toggleFullScreen() {
   if ( document.fullscreenElement == null ) {
      container.requestFullscreen()
   }else {
      document.exitFullscreen()
   }
}
document.addEventListener("fullscreenchange" , function () {
   container.classList.toggle("full_screen",document.fullscreenElement)
})
function toggleTheater() {
   container.classList.toggle("theater")
}
function toggleMiniPlayer() {
   if ( container.classList.contains("miniPlayer") ) {
      document.exitPictureInPicture()
      container.classList.remove("miniPlayer")
   }else {
      video.requestPictureInPicture()
      container.classList.add("miniPlayer")
   }
}
/*---------------------*/
volumeBTN.addEventListener("click" , toggleMuted)
volumeRange.addEventListener("input" , (e)=>{
   video.volume = e.target.value ;
   video.muted = e.target.value === 0
})
function toggleMuted() {
   video.muted = !video.muted
}
video.addEventListener("volumechange",()=>{
   volumeRange.value = video.volume ; 
   let volumeLevel
   if ( video.volume === 0 || video.muted ) {
      volumeLevel = "muted"
   }else if ( video.volume <=0.5 ) {
      volumeLevel = "low"
   }else {
      volumeLevel = "high"
   }
   // container.getAttribute("data-volume-level",volumeLevel)
   container.dataset.volumeLevel = volumeLevel ;
})
/*---------------------*/
video.addEventListener("loadeddata",()=>{
   allTime.textContent = formatTime(video.duration)
})
video.addEventListener("timeupdate",()=>{
   currentTime.textContent = formatTime(video.currentTime)
})
function formatTime(time) {
   let hours = Math.floor(time / 3600)
   let minutes = Math.floor(time / 60) % 60
   let seconds = Math.floor(time % 60)
   minutes = minutes<10? `0${minutes}`:minutes ;
   seconds = seconds<10? `0${seconds}`:seconds ;
   if ( hours == 0 ) {
      return `${minutes}:${seconds}`
   }else {
      return `${hours}:${minutes}:${seconds}`
   }
}
/*---------------------*/
speedBTN.addEventListener("click",()=>{
   let newSpeed = video.playbackRate + 0.25
   if ( newSpeed > 2 ) {
      newSpeed = 0.25
   }
   video.playbackRate = newSpeed
   speedBTN.textContent = `${newSpeed}x`
})
/*---------------------*/
timelineContainer.addEventListener("mousemove",handleTimeLLineUpdate)

function handleTimeLLineUpdate(e) {
   let rect = timelineContainer.getBoundingClientRect();
   let percent = Math.min(Math.max(0,e.x - rect.x),rect.width)/rect.width ;
   let previewImgNumber = Math.max(1,Math.floor(percent*video.duration)/10)
   let previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
   previewImg.src = previewImgSrc ;
   timelineContainer.style.setProperty("--preview-progress",percent)
   console.log(video.duration);
}


/*---------------------*/
