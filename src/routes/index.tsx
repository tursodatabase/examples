import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  type DocumentHead,
} from "@builder.io/qwik-city";
import { invoke } from "@tauri-apps/api"
import { isServer } from "@builder.io/qwik/build";

interface NoteItem {
  text: string;
  id: string;
  title: string;
}

export default component$(() => {
  const notes = useSignal<NoteItem[]>();
  const text = useSignal('');
  const placeholder = useSignal('');
  const currentNote = useSignal<NoteItem | undefined>();
  const initialCall = useSignal(true);

  // gets all notes
  const getAllNotes = $(async () => {
    if (isServer) {
      return;
    }
    notes.value = [
      { text: "The first note's details", id: "ijn2i3nh5b3", title: "The first note" },
      { text: "The second note's details", id: "n3jnuh3bouh", title: "The second note" },
    ];

    console.log("Invoking get_all_notes")
    const allNotes = await invoke("get_all_notes");
    console.log("Got all notes: ", JSON.stringify({ allNotes }));
  })

  // adds new note
  const newNote = $(async () => {
    if (isServer) {
      return;
    }
    await invoke("new_note");
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

  const setCurrentNote = $((note: NoteItem | undefined) => {
    currentNote.value = note
  })

  // update current note information after notes have been re-fetched
  useVisibleTask$(({ track }) => {
    track(() => notes.value);

    if (notes.value !== undefined && currentNote.value !== undefined) {
      const noteIndex = notes.value.findIndex((note: NoteItem) => note.id === currentNote.value.id);
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
    <div class="flex py-4 pr-4 h-[100vh] bg-teal-900">
      <ul class="w-[320px] flex-grow-0">
        <li class="p-2 refresh cursor-pointer" onClick$={getAllNotes}>Refresh</li>
        {
          notes.value === undefined
            ? <li>Add some notes</li>
            : notes.value.map((note: NoteItem) => <li key={note.id} onClick$={() => setCurrentNote(note)} class="w-full py-2 px-2 border-t border-teal-700 text-white cursor-pointer">{note.title}</li>)
        }
        <li class="w-full py-2 px-2 border-t border-teal-700 text-white">
          <button class="p-2 text-white rounded-md" onClick$={newNote}>New Note +</button>
        </li>
      </ul>
      <div class="shrink flex-grow w-full flex flex-col">
        <div class="flex-grow">
          <textarea id="editor" class="w-full h-full text-black p-2 rounded-br-md resize-none" onInput$={(e) => text.value = (e.target as HTMLInputElement).value} placeholder={placeholder.value} value={text.value}></textarea>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Turso Notes",
};
