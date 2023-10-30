import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  type DocumentHead,
} from "@builder.io/qwik-city";
import { invoke } from "@tauri-apps/api";
import { confirm } from "@tauri-apps/api/dialog";
import { isServer } from "@builder.io/qwik/build";
import { DeleteIcon, NewNoteIcon, RefreshIcon, TursoLogo } from '~/components/icons';

interface NoteItem {
  text: string;
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

function dateFromUnixepoch(val: number) {
  const newDate = new Date(val * 1000);

  return newDate.toLocaleDateString('US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}


export default component$(() => {
  const notes = useSignal<NoteItem[]>();
  const text = useSignal('');
  const placeholder = useSignal('');
  const currentNote = useSignal<NoteItem | undefined>();
  const initialCall = useSignal(true);
  const loading = useSignal<boolean>(false);

  // gets all notes
  const getAllNotes = $(async () => {
    if (isServer) {
      return;
    }

    loading.value = true;
    const allNotes = await invoke("get_all_notes");
    loading.value = false;
    notes.value = allNotes as unknown as NoteItem[];
  })

  // adds new note
  const newNote = $(async () => {
    if (isServer) {
      return;
    }
    await invoke("new_note");
    getAllNotes();
  })

  // updates passed note's text, returning the updated array of all notes
  const updateNote = $(async () => {
    if (isServer) {
      return;
    }

    // update note
    placeholder.value = await invoke("update_note", { id: currentNote.value?.id, newText: text.value })
    getAllNotes()
  })

  // updates passed note's text, returning the updated array of all notes
  const deleteNote = $(async (note: NoteItem) => {
    if (isServer) {
      return;
    }

    placeholder.value = await invoke("delete_note", { id: note.id })
    getAllNotes()
  })

  const setCurrentNote = $((note: NoteItem | undefined) => {
    currentNote.value = note
  })

  const verifyDelete = $(async (note: NoteItem) => {
    const deleteItem = await confirm("Do you want to delete this note?", {
      type: "warning",
    });

    if (deleteItem) {
      deleteNote(note)
    }
  })

  // update current note information after notes have been re-fetched
  useVisibleTask$(({ track }) => {
    track(() => notes.value);

    if (notes.value !== undefined && currentNote.value !== undefined) {
      const noteIndex = notes.value.findIndex((note: NoteItem) => note.id === currentNote.value!.id);
      if (noteIndex !== -1) {
        currentNote.value.text = notes.value![noteIndex].text
      }
    }

  })

  // update text information after current note has been updated
  useVisibleTask$(({ track }) => {
    track(() => currentNote.value);
    if (currentNote.value !== undefined) {
      text.value = currentNote.value.text
    }

  })

  // get all notes initially & subsequently
  useVisibleTask$(() => {
    getAllNotes();

    if (initialCall.value) {
      setCurrentNote(notes.value === undefined ? undefined : notes.value[notes.value.length - 1])
      initialCall.value = false;
    }

    document.querySelector('#editor')?.addEventListener('keypress', async function (e: any) {
      if (e.key === 'Enter') {
        updateNote()
      }
    });
  });

  return (
    <div class="flex h-[100vh] bg-primary">
      <ul class="w-[320px] flex-grow-0 pr-2">
        <li class="p-2 refresh cursor-pointer flex items-center gap-2" onClick$={getAllNotes}>
          <span>
            <RefreshIcon styles={`w-4 h-4 fill-plight ${loading.value ? 'animate-spin' : ''}`} />
          </span>
          <span class="text-plight">Sync notes</span>
        </li>
        {
          notes.value === undefined
            ? <></>
            : notes.value.map((note: NoteItem) => <li key={note.id} onClick$={() => setCurrentNote(note)} class={`w-full py-2 px-2 border-t border-[#143633] text-white cursor-pointer flex flex-col ${note.id === currentNote.value?.id ? 'bg-paccent rounded-md' : ''}`}>
              <span class="text-plight text-xs flex justify-between">
                {dateFromUnixepoch(note.created_at)}
                <span class="shrink items-center">
                  <button onClick$={() => verifyDelete(note)}>
                    <DeleteIcon styles='w-4 h-4 fill-[#CA815E] hover:bg-[#CA815E] hover:fill-[#75310F] hover:rounded-full cursor-pointer' />
                  </button>
                </span>
              </span>
              <span>{note.title}</span>
            </li>)
        }
        <li class="w-full py-2 px-2 border-t border-[#143633] text-white">
          <button class="p-2 text-white flex justify-center gap-2 items-center w-full hover:bg-primary" onClick$={newNote}>
            <span>
              <NewNoteIcon styles='fill-white h-4 w-4' />
            </span>
            <span>
              New Note
            </span>
          </button>
        </li>
      </ul>
      <div class="shrink flex-grow w-full flex flex-col">
        <div class="flex-grow">
          {currentNote.value !== undefined
            ? <textarea id="editor" class="w-full h-full text-black p-2 rounded-br-md resize-none" onInput$={(e) => text.value = (e.target as HTMLInputElement).value} placeholder={placeholder.value} value={text.value} onBlur$={updateNote}></textarea>
            : <div class="w-full h-full flex flex-col gap-4 items-center justify-center bg-primary text-paccent text-2xl border-l border-paccent">
              <TursoLogo styles='h-52 w-52 fill-paccent' />
              <span>Pick/create a note to edit</span>
            </div>}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Turso Notes",
};
