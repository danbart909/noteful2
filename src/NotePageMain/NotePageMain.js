import React from 'react';
import { Redirect } from 'react-router-dom';
import Note from '../Note/Note';
import NotesContext from '../NotesContext';
import PropTypes from 'prop-types';

class NotePageMain extends React.Component {
  
  static contextType = NotesContext;

  handleDeleteNote = noteId => {
    this.props.history.push(`/`)
  }

  render() {

    if (!this.props.match.params) {
      return <Redirect to="/"></Redirect>
    }

    if (!this.context.notes.length) {
      return <Redirect to="/"></Redirect>
    }

    // Find the note that has the same id from the url (:noteId) using 'match'
    const selectedNote = this.context.notes.find(
      note => note.id === this.props.match.params.noteId
    )

    return (
      <div className="Main">
        <Note modified={selectedNote.modified} key={selectedNote.id} id={selectedNote.id } name={selectedNote.name} folderId={selectedNote.folderId} onDeleteNote={this.handleDeleteNote}/>
        <p>{selectedNote.content}</p>
        {/* <button onClick={() => {console.log(selectedNote)}}>generate</button> */}
      </div>
    );
  }

}

NotePageMain.propTypes = {
  match: PropTypes.object.isRequired
}

export default NotePageMain;
