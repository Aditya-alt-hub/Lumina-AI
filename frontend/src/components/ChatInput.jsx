import { Camera, Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap } from 'lucide-react'
import React, { useState } from 'react'
import  { useRef } from 'react'
import sendMessage from '../features/sendMessages.js'
import { useDispatch, useSelector } from 'react-redux';
import {addMessage, setArtifacts, setIsLoading, setMessages} from '../redux/messageSlice.js';
import {createConversation} from '../features/createConversation.js'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice.js';
import { updateConversation } from '../features/updateConversation.js';
import { useEffect } from 'react';


function ChatInput() {
  const [value,setValue]=useState("")
  const [selectedAgent,setSelectedAgent]=useState("auto")
  const {selectedConversation}=useSelector(state=>state.conversation);
  const {messages,isLoding}=useSelector(state=>state.message);
  const [selectedFile,setSelectedFile]=useState(null);
  const [listening,setListening]=useState(false);

   const [cameraOpen, setCameraOpen] = useState(false);


  const recognitionRef=useRef(null);
  const fileRef=useRef(null);

   const videoRef = useRef(null);
  const streamRef = useRef(null);

  const dispatch=useDispatch()

  useEffect(()=>
  {
    const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
    console.log("Speech Recognition is not supported");
    return;
    }
       const recognition = new SpeechRecognition();

       recognition.continuous = true;
       recognition.interimResults = true;
       recognition.lang = "en-US";

       recognition.onresult=(event)=>
       {
          let transcript=""
          for(let index=event.resultIndex;index<event.results.length;index++)
          {
            transcript+=event.results[index][0].transcript
          }
          console.log(transcript);
          setValue(transcript)
       }
        recognition.onend = () => {
        setListening(false);
        };
       recognitionRef.current=recognition

  },[])

  const toggleMic=()=>{
    if(!recognitionRef.current){
      alert("speech recognition not supported")
    }
    if(listening)
    {
      recognitionRef.current.stop()
      setListening(false)
    }
    else{
      recognitionRef.current.start()
      setListening(true)
    }
  }

  //handle normal file upload

   const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  //camera functioning

   const openCamera = async () => {
    try {
      // Check browser support
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Camera is not supported by this browser."
        );
        return;
      }

      // Ask browser for camera access
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

      // Save stream
      streamRef.current = stream;

      // Open camera UI
      setCameraOpen(true);

      // Wait for video element to render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current
            .play()
            .catch((error) => {
              console.error(
                "Video play error:",
                error
              );
            });
        }
      }, 100);

    } catch (error) {
      console.error(
        "Camera access error:",
        error
      );

      if (error.name === "NotAllowedError") {
        alert(
          "Camera permission was denied. Please allow camera access in your browser settings."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        alert(
          "No camera was found on this device."
        );
      } else if (
        error.name === "NotReadableError"
      ) {
        alert(
          "Camera is already being used by another application."
        );
      } else {
        alert(
          "Unable to access the camera."
        );
      }
    }
  };

   
  // CAPTURE IMAGE
  

  const captureImage = () => {
    const video = videoRef.current;

    if (!video) {
      console.log("Video element not found");
      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      alert(
        "Camera is not ready yet. Please wait a moment."
      );
      return;
    }

    // Create canvas
    const canvas =
      document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      console.error(
        "Could not create canvas context"
      );
      return;
    }

    // Draw camera frame onto canvas
    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas to image
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error(
            "Could not create image blob"
          );
          return;
        }

        // Convert blob to File
        const file = new File(
          [blob],
          `camera-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        console.log(
          "Captured image:",
          file
        );

        // Store image as selected file
        setSelectedFile(file);

        // Close camera
        closeCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  
  // CLOSE CAMERA
  

  const closeCamera = () => {
    // Stop camera tracks
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    // Remove video stream
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Close camera UI
    setCameraOpen(false);
  };

  
  // CLEAN CAMERA WHEN COMPONENT
  // UNMOUNTS
 

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  
  // REMOVE SELECTED FILE
  

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };



  const handleSendMessage=async ()=>
  {
    dispatch(setIsLoading(true))
    let conversation=selectedConversation
    if(!conversation)
    {
      const conv=await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation=conv
    }

    if(conversation.title=="New Chat")
    {
      await updateConversation({id:conversation?._id,title:value.trim()})
      dispatch(setConvTitle({conversationId:conversation?._id,title:value.trim()}))
      // conversation=conv
    //   conversation = {
    // ...conversation,
    // title: value.trim()
// }
    }


    // const payload={
    //   prompt:value.trim(),conversationId:conversation?._id,agent:selectedAgent.toLowerCase()
    // }

    const formData=new FormData();
    formData.append("prompt",value.trim())
    formData.append("conversationId",conversation?._id)
    formData.append("agent",selectedAgent.toLowerCase())
    if(selectedFile)
    {
      formData.append("file",selectedFile)
    }
    console.log(selectedFile);

    dispatch(addMessage({role:"user",content:value.trim()}))
    setValue("")
    const data=await sendMessage(formData);
    dispatch(setIsLoading(false))
    setSelectedFile(null);
    dispatch(setArtifacts(data.artifacts || []))
    // const code = data.artifacts?.[0]?.content;
      dispatch(addMessage({role:"assistant",content:data?.answer,images:data?.images,artifacts:data?.artifacts}))

//       dispatch(addMessage({
//     role: "assistant",
//     content: code || data.answer,
//     images: data.images || [],
//     artifacts: data.artifacts || []
// }));
    console.log(data);
//     try {
//   const data = await sendMessage(payload);

//   dispatch(
//     addMessage({
//       role: "assistant",
//       content: data.answer,
//       images: data.images
//     })
//   );

//   console.log(data);

// } catch (error) {
//   console.error(
//     "CHAT ERROR:",
//     error.response?.data || error.message
//   );
// }
  }



  const agents=[
    {
      id:"auto",
      icon:Zap,
      label:"Auto"
    },
    {
      id:"chat",
      icon:MessageSquare,
      label:"Chat"
    },
    {
      id:"coding",
      icon:Code2,
      label:"Coding"
    },
    {
      id:"pdf",
      icon:FileText,
      label:"PDF"
    },
    {
      id:"ppt",
      icon:Presentation,
      label:"PPT"
    },
    {
      id:"imagegen",
      icon:ImageIcon,
      label:"Image"
    },
    {
      id:"search",
      icon:Globe,
      label:"Search"
    }
  ]

  return (
      <>
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-[#0d0f14] border border-white/[0.08] shadow-2xl p-4">

            {/* CAMERA HEADER */}

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-slate-300" />

                <h2 className="text-white font-medium">
                  Take a photo
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCamera}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* CAMERA PREVIEW */}

            <div className="relative overflow-hidden rounded-xl bg-black">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-[70vh] object-contain"
              />

            </div>

            {/* CAMERA BUTTONS */}

            <div className="flex items-center justify-center gap-3 mt-4">

              <button
                type="button"
                onClick={closeCamera}
                className="px-5 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:bg-white/[0.1] hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={captureImage}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-200 transition"
              >
                <Camera className="w-4 h-4" />

                Capture
              </button>

            </div>

          </div>

        </div>
      )}
      

    <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]'>

      <div className='flex flex-col gap-2 bg-white[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>
        <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>

          {agents.map((agent)=>{
              const isActive=selectedAgent===agent.id
              const Icon=agent.icon
              return (
                <div 
                onClick={()=>{setSelectedAgent(agent.id)}}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
    isActive
      ? "bg-gradient-to-br from-slate-600 to-slate-800 text-white border-slate-500/40 shadow-sm"
      : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-200 hover:border-white/[0.10]"
  }`}>

     <Icon className="w-3.5 h-3.5" />
        <span>{agent.label}</span>

                </div>
              )
          })}

        </div>

    {
      selectedFile && <div className='my-3'>
        <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2'>
          {
            selectedFile?.type==="application/pdf"?<FileText size={16} className="text-blue-500"/>:selectedFile?.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className='h-10 w-10 rounded-xl object-cover mt-3'/>
          }
           <div>
          <p className='text-xs text-white'>
            {selectedFile?.name}
          </p>
          <p className='text-xs text-slate-500'>
            {Math.ceil(selectedFile.size)}KB
          </p>
        </div>
        <button className='ml-2' onClick={()=>{setSelectedFile(null);fileRef.current.value=""}}>
          <X size={14} className='text-slate-500 hover:text-white'/>
        </button>
        </div>
       
      </div>
    }

       <textarea 
       placeholder='Ask LuminaAI'
       onChange={(e)=>setValue(e.target.value)}
       value={value}
       className="w-full bg-transparent border-none outline-none resize-none text-sm font-normal text-slate-100 placeholder:text-slate-500 leading-6 max-h-40 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
       rows={3}/>
       <div className='flex items-center justify-between'>
         <div className='flex items-center gap-1'>

          <input type='file' accept='.pdf,image/*' hidden ref={fileRef} onChange={(e)=>{
            const file=e.target.files[0]
            if(file)
            {
              setSelectedFile(file)
            }
            
          }}/>

          <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors duration-150 cursor-pointer' onClick={()=>fileRef.current.click()}>
            <Paperclip className='w-4 h-4'/>
          </button>
          <button 
             type="button"
                disabled={isLoding}
                onClick={openCamera}
          className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors duration-150 cursor-pointer'>
            <Camera className='w-4 h-4'/>
          </button>
          <button
          onClick={toggleMic} 
          className={`ml-auto flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-100 hover:bg-white/[0.08] transition-colors duration-150 cursor-pointer ${listening ? "bg-red-500 text-white":"text-slate-600 hover:bg-white/[0.05]"}`}>
           {listening?<Mic className='w-4 h-4'/>: <MicOff className='w-4 h-4'/>} 
          </button>
         </div>
         <button 
         disabled={!value && isLoding}
         onClick={handleSendMessage}
         className={`flex items-center justify-center w-8 h-8 rounded-lg ${value.trim()?"bg-linear-to-br from-slate-200 to-slate-400 text-slate-900 hover:from-slate-100 hover:to-slate-300 transition-all duration-150 cursor-pointer":"bg-white/[0.05] text-slate-600 cursor-not-allowed"}`}>
          <Send className='w-4 h-4'/>
         </button>

        </div>

      </div>
      
    </div>
    </>
  )
}

export default ChatInput

