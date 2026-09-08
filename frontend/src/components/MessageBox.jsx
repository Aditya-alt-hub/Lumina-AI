import { Check, Copy, ExternalLink, X } from 'lucide-react'
import React, { children, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// import SyntaxHighlighter from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

function MessageBox({role,content,images}) {

  const isUser=role==="user"

  const [imageBox,setImageBox]=useState(null)

  const [copyCode,setCopyCode]=useState("")
  const [fileError, setFileError] = useState("")

  const copiedCode=async (code)=>{
    await navigator.clipboard.writeText(code)
    setCopyCode(code)
    setTimeout(()=>{
      setCopyCode=("")
    },2000)
  }

  const handleFileDownload = async (url) => {
  try {
    setFileError("")

    const response = await fetch(url)

    if (!response.ok) {
      let message = "File not found or has expired"

      try {
        const data = await response.json()
        message = data.message || message
      } catch {
        // Keep default message
      }

      throw new Error(message)
    }

    const blob = await response.blob()

    const blobUrl = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = blobUrl
    a.download = url.split("/").pop()
    document.body.appendChild(a)
    a.click()
    a.remove()

    window.URL.revokeObjectURL(blobUrl)

  } catch (error) {
    console.error("Download error:", error)
    setFileError(error.message || "File download failed")
  }
}


  return (
    <div className={`flex mb-8 ${isUser ? "justify-end" : "justify-start"}`}>

      <div className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl break-words overflow-hidden leading-relaxed ${
       isUser
       ? "bg-linear-to-br from-slate-600 to-slate-800 text-white rounded-tr-sm"
       : "text-slate-200 rounded-tl-sm"
       }`}>

        {images.length>0 && (
          <div className='flex flex-wrap gap-3 mt-4'>

            {images.map((img,i)=>(
              <img
              key={i}
              src={img}
              onClick={()=>setImageBox(img)}
              loading="lazy"
              onError={(e)=>e.currentTarget.remove()}
              className='w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition'
              // className='w-[550px] max-w-[50vw] h-auto max-h-[450px] rounded-xl object-contain border border-white/10 cursor-zoom-in hover:opacity-90 transition'
              />
            ))}

          </div>
        )}
        {fileError && (
         <div className="mb-3 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
         {fileError}
         </div>
         )}
        <Markdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1:({children})=>(
            <h1 className='text-2xl font-bold mt-5 mb-3'>{children}</h1>
          ),
          h2:({children})=>(
            <h2 className='text-xl font-semibold mt-4 mb-2'>{children}</h2>
          ),
          h3:({children})=>(
            <h3 className='text-lg font-semibold mt-3 mb-2'>{children}</h3>
          ),
          p:({children})=>(
            <p className='mb-3 whitespace-pre-wrap break-words'>{children}</p>
          ),
          ul:({children})=>(
            <ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>
          ),
          ol:({children})=>(
            <ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>
          ),
          table:({children})=>(
            <div className='overflow-x-auto my-4'>
              <table className='min-w-full border border-white/10'>
                {children}
              </table>
            </div>
          ),
          th:({children})=>(
              <th className='border border-white/10 bg-white/5 px-3 py-2 text-left'>
                {children}
              </th>
          ),
          td:({children})=>(
              <td className='border border-white/10 px-3 py-2'>
                {children}
              </td>
          ),
          // a:({href,children})=>(
          //     <a
          //     href={href}
          //     target='_blank'
          //     rel='noreferrer'
          //     className="text-slate-300 hover:text-white underline underline-offset-2 inline-flex items-center gap-1 decoration-slate-500 hover:decoration-slate-300 transition-colors duration-200"
          //     >
          //     {children}
          //     <ExternalLink size={14}/>
          //     </a>
          // ),
          a:({href, children}) => {

  const isTemporaryFile =
    href?.includes("/files/download/")

  if (isTemporaryFile) {
    return (
      <button
        type="button"
        onClick={() => handleFileDownload(href)}
        className="text-slate-300 hover:text-white underline underline-offset-2 inline-flex items-center gap-1 decoration-slate-500 hover:decoration-slate-300 transition-colors duration-200"
      >
        {children}
        <ExternalLink size={14}/>
      </button>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-slate-300 hover:text-white underline underline-offset-2 inline-flex items-center gap-1 decoration-slate-500 hover:decoration-slate-300 transition-colors duration-200"
    >
      {children}
      <ExternalLink size={14}/>
    </a>
  )
},
          code:({className,children})=>{
            const value=String(children).trim();

            if(!className)
            {
              return(
                <code className='px-1.5 py-0.5 rounded bg-white/10 text-pink-400'>
                  {value}
                </code>
              )
            }

            const language=className?.replace("language-","");

            return (
              <div className='my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]'>
                <div className='flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2'>
                  <span className='uppercase text-xs text-slate-400'>
                    {language}
                  </span>
                  <button
                  className='flex items-center gap-1 text-xs'
                  onClick={()=>copiedCode(value)}
                  >
                    {
                      copyCode==value?
                      <>
                      <Check size={14}/>
                      Copied
                      </>:
                      <>
                      <Copy size={14}/>
                      Copy
                      </>
                    }
                    
                  </button>
                </div>
                <SyntaxHighlighter
                 language={language}
                 style={oneDark}
                 wrapLongLines
                 showLineNumbers
                 customStyle={{
                  margin:0,
                  padding:"16px",
                  background:"#0d1117",
                  fontSize:"13px"
                 }}
                >
                  {value}
                </SyntaxHighlighter>
              </div>
            )
          },

          img:({src})=>{
            if(!src)return null;
            return (
              <img 
              // key={i}
              src={src}
              onClick={()=>setImageBox(src)}
              loading="lazy"
              onError={(e)=>e.currentTarget.remove()}
              // className='w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition'
              className='w-[550px] max-w-[50vw] h-auto max-h-[450px] rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition'
              // className="w-[550px] max-w-[50vw] h-auto max-h-[450px] rounded-xl object-contain border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            )
          }




        }}
        >
          {content}
        </Markdown>
      </div>

      {imageBox && 
      <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6'>
        <button
        className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2'
        onClick={()=>setImageBox(null)}>
          <X/>
        </button>
        <img
        src={imageBox}
        className='max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain'
        />
      </div>}
      
    </div>
  )
}

export default MessageBox
