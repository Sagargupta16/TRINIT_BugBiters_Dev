import { useState } from "react";
import ReactDOM from "react-dom";
import { createTest } from "../../api/testApi";
import classes from "./TestModal.module.css";

const TestModal = ({ isOpen, onClose, id }) => {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Chinese",
    "Japanese",
    "Russian",
    "Arabic",
    "Portuguese",
    "Korean",
    "Dutch",
  ];
  const onClickHandler = async () => {
    const response = await createTest({
      language,
      level,
      questions: questions.map((question, index) => {
        return { question, answer: answers[index] };
      }),
    });
    if (response.status === 200) {
      onClose();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <div className={classes.modal_element}>
        <h2>Add Test</h2>
        <p>Enter the details of the test you want to add</p>
        <div className={classes.modal__input}>
          <label htmlFor="language">Language</label>
          <select
            name="language"
            id="language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select a language</option>
            {languages.map((language, index) => {
              return (
                <option key={index} value={language}>
                  {language}
                </option>
              );
            })}
          </select>
        </div>
        <div className={classes.modal__input}>
          <label htmlFor="level">Level</label>
          <select
            name="level"
            id="level"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Select a level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className={classes.modal__input}>
          {Array.from({ length: noOfQuestions }, (_, index) => (
            <>
              <label htmlFor="question">Question {index + 1}</label>
              <input key={index} type="text" placeholder="Enter question" onChange = {(e) => questions[index] = e.target.value}/>
              <input key={index} type="text" placeholder="Enter answer" onChange = {(e) => answers[index] = e.target.value}/>
            </>
          ))}
        </div>
        <button className={classes.modal__add} onClick={() => setNoOfQuestions(noOfQuestions + 1)}>
          Add Question
        </button>

        <div className={classes.modal__buttons}>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={onClickHandler}>
            Add
          </button>
        </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default TestModal;
