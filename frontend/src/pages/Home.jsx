import {signInWithPopup} from 'firebase/auth'
// import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import React from 'react'
import {auth, googleProvider} from "../../utils/firebase.js"
import api from "../../utils/axios.js"
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice.js';
import SideBar from '../components/SideBar.jsx';
import ChatBox from '../components/ChatBox.jsx';
import Artifact from '../components/Artifact.jsx';
import { useEffect } from "react";

function Home() {

  const {userData}=useSelector(state=>state.user)
  
  const dispatch=useDispatch()

    const handleLogin=async (token)=>
  {
    try
    {
      const {data}=await api.post("/api/auth/login",{token});
      dispatch(setUserdata(data))
    }
    catch(error)
    {
      console.log(error);
    }
  }

  const googleLogin=async ()=>
  {
    const data=await signInWithPopup(auth,googleProvider)
    // await signInWithRedirect(auth, googleProvider);
    const token=await data.user.getIdToken();
    console.log(token);
     await handleLogin(token);
    console.log(data);
  }

//   useEffect(() => {

//     const checkGoogleLogin = async () => {

//         try {

//             const result = await getRedirectResult(auth);

//             if (!result) {
//                 return;
//             }

//             console.log("Firebase user:", result.user);

//             const token = await result.user.getIdToken();

//             console.log("Firebase token received");

//             await handleLogin(token);

//             console.log("Login completed");

//         }
//         catch (error) {

//             console.log("GOOGLE REDIRECT LOGIN ERROR");
//             console.log("code:", error.code);
//             console.log("message:", error.message);
//             console.log("full error:", error);

//         }
//     };

//     checkGoogleLogin();

// }, []);

//   const googleLogin = async () => {
//     try {
//         await signInWithRedirect(auth, googleProvider);
//     }
//     catch (error) {
//         console.log("GOOGLE LOGIN ERROR");
//         console.log("code:", error.code);
//         console.log("message:", error.message);
//     }
// };


  return (
    <div className='h-screen min-w-0 flex  bg-[#0d0f14] text-white overflow-hidden'>


      <SideBar/>
      <ChatBox/>
      <Artifact/>


      {!userData && <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
              <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>WELCOME TO  LuminaAI</h2>
              <p className='text-[13px] text-slate-500'>Login to continue using the app</p>
            </div>

            <button className="w-full h-11 flex items-center justify-center gap-3 rounded-xl
             bg-[#1b1e27] border border-white/10
             text-slate-200 font-medium
             transition-all duration-200 ease-in-out
             hover:bg-[#252936] hover:border-white/20 hover:shadow-lg hover:shadow-black/30
             active:bg-[#31384b] active:scale-[0.97] active:border-indigo-500/40
             focus:outline-none focus:ring-2 focus:ring-indigo-500/40
             cursor-pointer" onClick={googleLogin}>
              <FcGoogle size={15} className='text-white' />
              Continue with Google
            </button>

          </div>
      </div>}

    </div>
  )
}

export default Home
