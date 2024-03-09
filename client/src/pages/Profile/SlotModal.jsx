import { useState } from "react";
import ReactDOM from "react-dom";
import { addSlot } from "../../api/tutorApi";
import classes from "./SlotModal.module.css";

const SlotModal = ({ isOpen, onClose, id, languages }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState("");

  const onClickHandler = async () => {
    // Format startTime before sending to backend
    const start = new Date(`${date}T${startTime}`);
    const slot = {
      date: date,
      startTime: start,
      duration: duration,
      price: price,
      language: language,
    };
    const res = await addSlot(id, slot);

    if (res.status === 200) {
      onClose();
    } else {
      console.log("Error adding slot");
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <h2>Add Slot</h2>
        <p>Enter the details of the slot you want to add</p>
        <div className={classes.modal__input}>
          <input
            type="date"
            placeholder="Date"
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            placeholder="Start Time"
            onChange={(e) => setStartTime(e.target.value)}
          />
          <select
            name="duration"
            id="duration"
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="45">45</option>
            <option value="60">60</option>
            <option value="90">90</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <select
            name="language"
            id="language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((language, index) => {
              return (
                <option key={index} value={language}>
                  {language}
                </option>
              );
            })}
          </select>
        </div>
        <div className={classes.modal__buttons}>
          <button
            className={`${classes.btn} ${classes["btn-danger"]}`}
            onClick={onClickHandler}
          >
            Add
          </button>
          <button
            className={`${classes.btn} ${classes["btn-primary"]}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
};

export default SlotModal;
