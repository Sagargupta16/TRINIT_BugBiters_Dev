import React from "react";
// import Flashcard from "./Flashcard";
import classes from "./Flashcards.module.css";
import LanguageCard from "./LanguageCard";
import { useNavigate } from "react-router-dom";
import CreateFlashcardModal from "./CreateFlashcardModal";
import { useState } from "react";

const Flashcards = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleClickCreate = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className={classes["main-container"]}>
      <div className={classes["flashcards-container"]}>
        <LanguageCard
          language="Spanish"
          onClick={() => navigate(`/flashcards/${"Spanish"}`)}
        />
        <LanguageCard language="Russian" />
        <LanguageCard language="French" />
      </div>
      <button onClick={handleClickCreate}>Create Flashcard</button>
      <CreateFlashcardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Flashcards;
