import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {

  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')

  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)
    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()
    // console.log(content)


    if (content === '') {
      toast.error('Campo de Nota Vazio')
    }
    else {
      onNoteCreated(content)
      setContent('')
      setShouldShowOnboarding(true)
      toast.success('Nota criada com sucesso!')
    }
  }


  function handleStartRecording() {

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação')
      toast.error('Função não suportada pelo seu navegador')
      return
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }


  return (
    // <Dialog.Root>
    <Dialog.Root onOpenChange={(open) => !open && setShouldShowOnboarding(true)}>
      {/* Agradecimentos a @lesada da comunidade do discord por esse script para resetar setShouldShowOnboarding quando fecha o modal */}
      <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col text-left gap-3 outline-none hover:ring-2 hover:ring-slate-600 
      focus-visible:ring-2 focus-visible: ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.</p>
      </Dialog.Trigger>



      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/40' />
        <Dialog.Content
          className='
          inset-0 md:inset-auto
          fixed md:left-1/2 md:top-1/2 
          md:-translate-x-1/2 md:-translate-y-1/2 
          md:max-w-[640px] w-full bg-slate-700
          md:rounded-md flex flex-col outline-none
          md:h-[60vh] overflow-hidden
          '>

          <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' />
          </Dialog.Close>

          <form className='flex flex-1 flex-col'>

            <div className='flex flex-1 flex-col gap-3 p-5'>

              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>


              {shouldShowOnboarding ? (<p className='text-sm leading-6 text-slate-400'>

                Começe <button onClick={handleStartRecording} type='button' className='text-lime-400 font-medium hover:underline'>gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} className='text-lime-400 font-medium hover:underline'>utilize apenas texto</button>.

              </p>
              ) : (
                <div className='flex-1'>
                  {/* <div className='h-px bg-slate-400' /> */}
                  <textarea autoFocus className='rounded p-3 text-sm leading-6 text-slate-200 h-full w-full bg-slate-600 resize-none flex flex-1 outline-none' onChange={handleContentChange} value={content} />
                </div>
              )}


            </div>

            {isRecording ? (
              <button
                type='button'
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
                onClick={handleStopRecording}
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                Gravando (Clique para interromper)
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSaveNote}
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
              >
                Salvar nota
              </button>
            )}


          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}