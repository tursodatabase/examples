import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
} from "@builder.io/qwik-city";
import { invoke } from "@tauri-apps/api"
import { isServer } from "@builder.io/qwik/build";

interface NoteItem {
  text: string;
  id: string;
  title: string;
}

export const useNotesLoader = routeLoader$(async () => {
  // get notes from tauri
  const notes = [
    { text: "The first note's details", id: "ijn2i3nh5b3", title: "The first note" },
    { text: "The second note's details", id: "n3jnuh3bouh", title: "The second note" },
  ];

  return notes;
});

export default component$(() => {
  const notes = useNotesLoader();
  const text = useSignal('');
  const placeholder = useSignal('');
  const currentNote = useSignal<NoteItem>();

  // adds new note
  const newNote = $(async () => {
    if (isServer) {
      return;
    }
  })

  // updates passed note's text, returning the updated array of all notes
  const updateNote = $(async () => {
    if (isServer) {
      return;
    }
    placeholder.value = await invoke("update_note", { text: text.value })
  })

  useVisibleTask$(() => {
    document.querySelector('#editor')?.addEventListener('keypress', async function (e: any) {
      if (e.key === 'Enter') {
        updateNote()
      }
    });
  });

  return (
    <div class="flex py-4 pr-4 h-[100vh] bg-teal-900">
      <ul class="w-[320px] flex-grow-0">
        {
          notes.value.length > 0
            ? notes.value.map((note: NoteItem) => <li key={note.id} onClick$={() => currentNote.value = note} class="w-full py-2 px-2 border-t border-teal-700 text-white">{note.title}</li>)
            : <li>Add some notes</li>
        }
        <li class="w-full py-2 px-2 border-t border-teal-700 text-white">
          <button class="p-2 text-white rounded-md" onClick$={newNote}>New Note +</button>
        </li>
      </ul>
      <div class="shrink flex-grow w-full flex flex-col">
        <div class="flex-grow">
          <textarea id="editor" class="w-full h-full text-black p-2 rounded-br-md resize-none" onInput$={(e) => text.value = (e.target as HTMLInputElement).value} placeholder={placeholder.value}></textarea>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Turso Notes",
};
