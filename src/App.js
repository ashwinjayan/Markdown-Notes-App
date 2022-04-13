import Editor from './components/Editor';
import Split from "react-split"
import { nanoid } from 'nanoid';
import Sidebar from './components/Sidebar';
import React from 'react';

function App() {
  const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || [])
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  )

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown content here",
      updatedTime: new Date()
    }
    setCurrentNoteId(newNote.id)
    setNotes(prevNotes => [newNote, ...prevNotes])
  }

  function updateNote(text) {
    setNotes(oldNotes => oldNotes.map(oldNote => {
      return oldNote.id === currentNoteId ?
        { ...oldNote, body: text, updatedTime: new Date() } :
        oldNote
    }).sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)))
  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }

  return (
    <main>
      {
        notes.length > 0 ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={findCurrentNote()}
              newNote={createNewNote}
              setCurrentNoteId={setCurrentNoteId}
              deleteNote={deleteNote}
            />
            {
              currentNoteId && notes.length > 0 &&
              <Editor
                currentNote={findCurrentNote()}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>
      }
    </main>
  );
}

export default App;
