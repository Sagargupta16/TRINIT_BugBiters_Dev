import ReactDOM from "react-dom";
import { createClass } from "../../api/classApi";
import { addClass } from "../../api/studentApi";
import { addClass as addClassTutor, deleteSlot } from "../../api/tutorApi";
import Stripe from "./Stripe";
import "./TutorModal.css";

const TutorModal = ({ isOpen, onClose, tutor, user }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);

    return `${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes().toString().padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
  };

  const onhandleBook = async (bookIn, book) => {
    if (bookIn === "slot") {
      const response = await createClass({
        language: book.language,
        tutor: tutor._id,
        startTime: book.startTime,
        duration: book.duration,
        price: book.price,
        level: "beginner",
        videoId: Math.random().toString(36).substring(7),
      });
      await addClass(user._id, response.data);
      await addClassTutor(tutor._id, response.data);
      await deleteSlot(tutor._id, book._id);
    }
    Stripe({ price: book.price, description: book.language });
  };

  return ReactDOM.createPortal(
    <>
      {isOpen ? (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <div className="tutor__image__name">
                <img src="https://via.placeholder.com/100?text=Tutor" alt="" />
                <h3 className="tutor__name">{tutor.name}</h3>
              </div>
              <div className="tutor__details">
                <div className="modal__tutor__languages">
                  {tutor.languages.map((language, index) => {
                    return <span key={index}>{language}</span>;
                  })}
                </div>
                <div className="tutor__experience">
                  <p>Experience: {tutor.yearsOfExperience} years</p>
                </div>
              </div>
            </div>

            <div className="modal__body">
              <div className="upcoming_classes">
                <span className="logo-badge">Upcoming Classes</span>
                <div className="upcoming_classes__list">
                  <div className="upcoming_class">
                    {tutor.classes.map((cls, index) => {
                      return (
                        <div className="upcoming__card" key={index}>
                          <div className="upcoming__details">
                            <div className="upcoming__info">
                              <h3 className="upcoming__name">{cls.language}</h3>

                              <p>Class Date: {formatDate(cls.startTime)}</p>
                              <p>Class Time: {formatTime(cls.startTime)}</p>
                              <p>Duration: {cls.duration} minutes</p>
                            </div>
                            <div className="upcoming__actions">
                              <button
                                className="btn"
                                onClick={() => onhandleBook("class", cls)}>
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="available-slots">
                <span className="logo-badge">Available Slots</span>
                <div className="slots__list">
                  <div className="slot">
                    {tutor.slotsAvailability.map((slot, index) => {
                      return (
                        <div className="slot__card" key={index}>
                          <div className="slot__details">
                            <div className="slot__info">
                              <h3 className="slot__name">
                                {formatDate(slot.date)}
                              </h3>
                              <p>Start Time: {formatTime(slot.startTime)}</p>
                              <p>Duration: {slot.duration} minutes</p>
                              <p>Price: ₹{slot.price}</p>
                              <p>Language: {slot.language}</p>
                            </div>
                            <div className="slot__actions">
                              <button
                                className="btn"
                                onClick={() => onhandleBook("slot", slot)}>
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal__close" onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.getElementById("modal-root")
  );
};

export default TutorModal;
