import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from 'react';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';


function App() {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleStart = async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: 1920,
        height: 1080,
        frameRate: 30,
      },
      audio: false,
    });

    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, { type: 'video' });
    recorderRef.current.startRecording();
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      const curBlob = recorderRef.current.getBlob()
      setBlob(curBlob);
      chunksRef.current.push(curBlob);
      const videoBlob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const videoUrl = window.URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "video.mp4";
      a.click();
    });
  };

  const handleSave = () => {
    // invokeSaveAsDialog(blob);
    // const a = document?.createElement("a");
    // a.href = URL.createObjectURL(blob);
    // a.download = "video.webm";
    // a.click();
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    // refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <motion.div
        className="w-[200px] h-[200px] bg-rose-500"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["0%", "0%", "50%", "50%", "0%"]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
      <div>
        {blob && (
          <video
            src={URL.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: '700px', margin: '1em' }}
          />
        )}
      </div>
      <div>
        <button onClick={handleStart} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">开始</button>
        <button onClick={handleStop} type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">停止</button>
        <button onClick={handleSave} type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">保存</button>
      </div>
    </div>
  )
}

export default App
