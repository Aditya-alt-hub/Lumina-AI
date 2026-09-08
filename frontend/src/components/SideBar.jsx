import React from 'react';
import { useState } from 'react';
import {Coins, LogOut, Menu, MessageSquare, PanelLeftIcon, PanelRight, PenBoxIcon, PenSquare, Plus, User, X} from "lucide-react";
import { useEffect } from 'react';
import { getConversation } from '../features/getConversation.js';
import { useDispatch, useSelector } from 'react-redux';
import { addConversation, setConversation, setSelectedConversation } from '../redux/conversationSlice';
import { createConversation } from '../features/createConversation';
import logOut from '../features/logOut.js';
import { setUserdata } from '../redux/userSlice.js';
import { setMessages } from '../redux/messageSlice.js';
import BillingDrawer from './BillingDrawer.jsx';


function SideBar() {
    const[collapsed,setCollapsed]=useState(false);
    const dispatch=useDispatch()
    const [imageError, setImageError]=useState(false)
    const {conversations,selectedConversation}=useSelector(state=>state.conversation)
    const {userData}=useSelector(state=>state.user)
    const [showBilling,setShowBilling]=useState(false);
    const [mobileOpen,setMobileOpen]=useState(false);
    useEffect(()=>
    {
        const getConv=async ()=>
        {
            const data=await getConversation()
               dispatch(setConversation(data))
        }
        getConv()
    },[userData?._id])

    const handleCreateConversation=async()=>
    {
        // const data=await createConversation()
        // dispatch(addConversation(data))
        dispatch(setSelectedConversation(null))
        dispatch(setMessages([]))
    }


    if(collapsed)
  {
    return (
        <div className='hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0'>
            <button className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"onClick={()=>setCollapsed(false)}>
                <PanelRight/>
            </button>
            <button
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
            onClick={()=>dispatch(setSelectedConversation(null))}
            >
                <Plus size={17}/>
            </button>
            <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5'>

                {conversations?.map((conv,i)=>{
                    const isActive=selectedConversation?._id==conv?._id

                    return (
                        <div 
                        onClick={()=>dispatch(setSelectedConversation(conv))}
                        className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 hover:bg-white/[0.05]${
                        isActive
                        ? "bg-slate-700/30 border-slate-600"
                        : "bg-transparent border-transparent"
                         }`}>
                            <div className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150 ${
                             isActive
                             ? "bg-slate-700 text-slate-100"
                             : "bg-white/[0.05] text-slate-500"
                             }`}>
                             <MessageSquare size={13}/>
                            </div>
                            
                        </div>
                    )
                })}

            </div>
             <div className='relative shrink-0'>
                        {
                            userData?.avatar && !imageError 
                            ?
                            (
                           <img 
                           className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
                           src={userData?.avatar} 
                           alt={"image"} 
                           onError={()=>setImageError(true)}/>
                           )
                           :
                           (
                           <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>
                             <User size={15} className='text-slate-400'/>
                           </div>
                           )
                        }
                    </div>
        </div>
        
    )
  }


  return (
    <>
    <button className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer' onClick={()=>setMobileOpen(true)}>
        <Menu size={14}/>
        </button>

    {mobileOpen && <div className='lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm' onClick={()=>setMobileOpen(false)}/>}

    <div className={`fixed lg:static insert-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] transition-transform duration-250 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        
        <div className='flex flex-col h-full'>
            <div className='flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]'>
                <div className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"onClick={()=>setCollapsed(true)}>
                    <PanelLeftIcon />
                </div>

                <button onClick={()=>setMobileOpen(false)} className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer">
                    <X/>
                </button>
                <span className='text-[16px] font-semibold text-slate-100 tracking-tight flex-1'>
                    LuminaAI
                </span>
                <span className='text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide'>{userData?.plan || "free"}</span>
                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-150 border border-white/[0.06] cursor-pointer"onClick={handleCreateConversation}>
                
                    <PenSquare className="w-4 h-4"/>
                </button>
            </div>
            <div className='px-4 pt-4 pb-1'>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-br from-slate-700 to-slate-900 text-white hover:from-slate-600 hover:to-slate-800 transition-all duration-200 cursor-pointer shadow-md"onClick={handleCreateConversation}>
                    <Plus className="w-4 h-4 text-slate-400"/>
                    <span className="text-sm font-medium">New Chat</span>
                </button>

            </div>
            {conversations.length==0 ? 
            <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
                No Recent Conversations
            </div>
            :
            (
                <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
                    Recents
                </div>
            )
            }

            <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>

                {conversations.map((conv,i)=>{
                    const isActive=selectedConversation?._id==conv?._id

                    return (
                        <div 
                        onClick={()=>dispatch(setSelectedConversation(conv))}
                        className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 hover:bg-white/[0.05] ${
                        isActive
                        ? "bg-slate-700/30 border-slate-600"
                        : "bg-transparent border-transparent"
                         }`}>
                            <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${
                             isActive
                             ? "bg-slate-700 text-slate-100"
                             : "bg-white/[0.05] text-slate-500"
                             }`}>
                             <MessageSquare size={13}/>
                            </div>
                            <span className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}>{conv?.title || "New Chat"}</span>
                        </div>
                    )
                })}

            </div>

            <div className='mx-2.5 h-px bg-white/[0.06]'/>
            <div className='px-3.5 py-3.5'>

                {userData ? (
                <div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150'>
                    <div className='relative shrink-0'>
                        {
                            userData?.avatar && !imageError 
                            ?
                            (
                           <img 
                           className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
                           src={userData?.avatar} 
                           alt={"image"} 
                           onError={()=>setImageError(true)}/>
                           )
                           :
                           (
                           <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>
                             <User size={15} className='text-slate-400'/>
                           </div>
                           )
                        }
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-[13.5px] font-semibold text-slate-100 truncate'>{userData?.name || "user"}</p>
                        <p className='text-[11px] text-slate-600 mt-px'>{`${userData?.plan}` || "free plan"}</p>
                    </div>
                    <div className='flex gap-1'>
                        <button 
                        onClick={()=>setShowBilling(true)}
                        className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 hover:from-yellow-400/30 hover:to-amber-500/30 hover:text-yellow-300 hover:border-yellow-400/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-yellow-500/20">
                            <Coins className="w-4 h-4" />
                        </button>
                        <button className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-200 cursor-pointer"onClick={()=>
                            {
                                logOut();
                                dispatch(setUserdata(null))
                            }
                        }>
                            <LogOut className="w-4 h-4"/>
                        </button>
                    </div>
                </div>)
                :
                <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150'>
                    Login
                </button>}

            </div>

            
        </div>

        

    </div>
      <BillingDrawer
        open={showBilling}
        onClose={()=>setShowBilling(false)}
        />
    </>
  )

}

export default SideBar
