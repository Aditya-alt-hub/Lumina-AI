import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBox from './MessageBox';
import Loading from './Loading';

function MessageList() {

  const {selectedConversation}=useSelector(state=>state.conversation);
  const {messages,isLoading}=useSelector(state=>state.message);
  const bottemRef=useRef(null);

  useEffect(()=>{
    requestAnimationFrame(()=>{
      bottemRef?.current.scrollIntoView({
        behavior:"smooth",
        block:"end"
      })
    })
  },[messages?.length,isLoading])

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      {messages.length==0 || !selectedConversation ?(
        <div className='h-full flex flex-col items-center justify-center gap-4 text-center'>

          <div className='flex flex-col gap-1.5'>
            <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight'>LuminaAI</h1>
            <p className='text-[15px] font-semibold text-slate-400 tracking-tight'>How can I help you?</p>
          </div>

        </div>
      ):
      <div className='space-y-5'>
        {messages?.map((msg,i)=>(
          <div>
            <MessageBox role={msg?.role} content={msg?.content} images={msg.images || []}/>
          </div>
        ))}
        {isLoading && <Loading/>}
      </div>
      }
      <div ref={bottemRef}/>
    </div>
  )
}

export default MessageList
