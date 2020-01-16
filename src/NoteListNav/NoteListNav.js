import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config'
import NotesContext from '../NotesContext';
import AddFolder from  '../AddFolder/AddFolder';
import PropTypes from 'prop-types';

// This component is rendered in the sidebar for the '/' and 'folder/:folderId' routes
class NoteListNav extends React.Component {
  static contextType = NotesContext;

  state = {
    showNewFolderForm: false,
  }

  showAddFolder = () => {
    this.setState({
      showNewFolderForm: true,
    })
  }

  hideAddFolder = () => {
    this.setState({
      showNewFolderForm: false,
    })
  }

  handleDisable = () => {
    const folderId = this.props.match.params.folderId
    if (!folderId) {
      return true
    }
    const notes = this.context.notes
    return notes.some(note => note.folderId === folderId)
  }

  handleClickDelete = e => {

    // 'e' will be the event object generated by the user interaction
    // - the default behavior for the button:
    e.preventDefault()

    // Get the note id from props
    const folderId = this.props.match.params.folderId

    // make an api request
    fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
       'content-type': 'application/json'
      },
    })
    .then(res => {
      if (!res.ok)
        return res.json().then(e => Promise.reject(e))

        // runs if request fails
        return res.json()
    })
    .then(() => {
      // fire the deleteNote method passed down through context
      this.context.deleteFolder(folderId)
    })
    .catch(error => {
      // If there is an error console.log it
      console.error({ error })
    })
  }

  render() {

    return (
      <div className="Sidebar">
        <h2>Folders</h2>
        <ul>

          {/* Loop through the array of folders passed as a prop */}
          {this.context.folders.map((folder) => {

            /* for each folder in the array, set variable 'classes' as either
            'folder' or 'folder' AND 'selected'. If the selected folderId is
            the same as the id of the current folder in the array, then add 'selected' to classes
            */
            const classes = this.props.match.params.folderId && this.props.match.params.folderId === folder.id
              ? 'folder selected'
              : 'folder'

            // Create list item for each folder in the array
            return(

              <li key={folder.id}>
                <Link className={classes} to={`/folders/${folder.id}`}>{folder.name}</Link>
              </li>
            )
          })}
        </ul>
        <Link to='/'><button disabled={this.handleDisable()} onClick={(e) => {this.handleClickDelete(e)}}>Delete Folder</button></Link>
        <button onClick={this.showAddFolder}>New Folder</button>
        {/* if */}
        {this.state.showNewFolderForm &&
        <AddFolder
          cancel={this.hideAddFolder}
          history={this.props.history}
        />}
      </div>
    );
  }
}

NoteListNav.propTypes = {
  match: PropTypes.object.isRequired
}

NoteListNav.defaultProps = {
  folders: []
}

export default NoteListNav;