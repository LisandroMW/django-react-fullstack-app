import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                setErrorMessage("");
            })
            .catch((err) => {
                setErrorMessage("Error al cargar las notas.");
                console.error(err);
            });
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    alert("Note deleted!");
                } else {
                    alert("Failed to delete note.");
                }
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) {
                    alert("Note created!");
                    setTitle("");
                    setContent("");
                } else {
                    alert("Failed to make note.");
                }
                getNotes();
            })
            .catch((err) => alert(err));
    };

    return (
        <div className="home-container">
            <div className="form-container">
                <h2>Create a Note</h2>
                <form onSubmit={createNote}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-input"
                    />
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-input"
                    ></textarea>
                    <input type="submit" value="Submit" className="form-button" />
                </form>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            <div className="notes-container">
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>
        </div>
    );
}

export default Home;