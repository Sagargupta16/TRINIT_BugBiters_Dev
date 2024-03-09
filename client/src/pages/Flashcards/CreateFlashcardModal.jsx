import React from "react";
import ReactDOM from "react-dom";
import classes from "./FlashcardModal.module.css";
import { createFlashcardRoute } from "../../api/flashcardApi";
const { jwtDecode } = require("jwt-decode");

const CreateFlashcardModal = ({ isOpen, onClose }) => {
  const decodedToken = jwtDecode(localStorage.getItem("token"));
  const userId = decodedToken.id;

  const flashcardSubmitHandler = async (e) => {
    e.preventDefault();
    const response = await createFlashcardRoute(userId, {
      language: e.target[0].value,
      question: e.target[1].value,
      answer: e.target[2].value,
    });

    if (response.status === 200) {
      onClose();
    } else {
      console.log("Error creating flashcard");
    }
  };

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <h2>Flashcard Create Modal</h2>
        <p>Create Modal Content</p>

        <form onSubmit={flashcardSubmitHandler}>
          <input type="text" placeholder="Language" required />
          <input type="text" placeholder="Question" required />
          <input type="text" placeholder="Answer" required />
          <button>Create</button>
        </form>

        <button className={classes["modal_close_btn"]} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default CreateFlashcardModal;
