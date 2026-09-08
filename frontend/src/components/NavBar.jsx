import { MessageSquare } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

function NavBar() {

    const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages}=useSelector(state=>state.message)
  return (
    // <div className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-[#0d0f14]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-sm">
    //   <div>
    //     <MessageSquare/>
    //   </div>
    //   <div>
    //     {selectedConversation?.title || "New Chat"}
    //   </div>
    //   <div>
        
    //   </div>
    // </div>
    <>
    {selectedConversation && <div className="sticky top-0 z-40 h-16 bg-[#0d0f14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center h-full px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 transition-all duration-200">
            <MessageSquare size={13}className="text-indigo-400" />
          </div>

          <h1 className="text-[13px] font-semibold text-white truncate">
            {selectedConversation?.title || "New Chat"}
          </h1>
        </div>
        <div className="ml-5 text-sm  text-[10px] font-medium text-slate-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
         {messages?.length} Messages
        </div>
      </div>
    </div> }

    </>
     
  )
}

export default NavBar
