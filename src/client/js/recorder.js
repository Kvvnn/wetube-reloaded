import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumbnail: "thumbnail.jpg"
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

const handleDownload = async() => {
    actionBtn.removeEventListener('click',handleDownload);
    actionBtn.innerText = "Transcoding..."
    actionBtn.disabled = "true"
    
    const ffmpeg = createFFmpeg({log:true});
    await ffmpeg.load();

    ffmpeg.FS("writeFile",files.input, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumbnail);
    
    const mp4file = ffmpeg.FS("readFile",files.output);
    const thumbfile = ffmpeg.FS("readFile",files.thumbnail);

    const mp4Blob = new Blob([mp4file.buffer], {type: "video/mp4"});
    const thumbBlob = new Blob([thumbfile.buffer], {type: "image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url,"Myrecording.mp4")
    downloadFile(thumbUrl,"MyThumbnail.jpg")

    ffmpeg.FS("unlink",files.input)
    ffmpeg.FS("unlink",files.output);
    ffmpeg.FS("unlink",files.thumbnail);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    const tracks = stream.getTracks();
    tracks.forEach((track)=>{
        track.stop();
    });
    stream.null;

    actionBtn.disabled = false;
    actionBtn.innerText = "Back to Record"
    actionBtn.addEventListener("click", init)
}

const handleStop = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);
    recorder.stop();

}
const handleStart = () => {
    actionBtn.innerText = "Stop Recording"
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);
    //
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    recorder.start();
}

const init = async (event) => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio:false,
        video:{
            width:300,height:500
        }
    });
    video.srcObject = stream;
    video.play();

    actionBtn.removeEventListener("click", init);
    actionBtn.addEventListener("click",handleStart);
    actionBtn.innerText = "Start Recording";
}

init();

actionBtn.addEventListener("click", handleStart);