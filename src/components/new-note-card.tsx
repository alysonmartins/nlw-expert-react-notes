import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'


export function NewNoteCard() {

  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')

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
    console.log(content)
    if (content === '') {
      toast.error('Campo de Nota Vazio')
    }
    else {
      toast.success('Nota criada com sucesso!')
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
          fixed left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2 
          max-w-[640px] w-full bg-slate-700
          rounded-md flex flex-col outline-none
          h-[60vh] overflow-hidden
          '>

          <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' />
          </Dialog.Close>

          <form onSubmit={handleSaveNote} className='flex flex-1 flex-col'>

            <div className='flex flex-1 flex-col gap-3 p-5'>

              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>


              {shouldShowOnboarding ? (<p className='text-sm leading-6 text-slate-400'>

                Começe <button type='button' className='text-lime-400 font-medium hover:underline'>gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} className='text-lime-400 font-medium hover:underline'>utilize apenas texto</button>.

              </p>
              ) : (
                <div className='flex-1'>
                  {/* <div className='h-px bg-slate-400' /> */}
                  <textarea autoFocus className='rounded p-3 text-sm leading-6 text-slate-200 h-full w-full bg-slate-600 resize-none flex flex-1 outline-none' onChange={handleContentChange} />
                </div>
              )}


            </div>

            <button
              type='submit'
              className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}