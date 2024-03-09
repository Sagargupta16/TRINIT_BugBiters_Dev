import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { getStudent } from "../../api/studentApi";
import { getTutor, getTutors } from "../../api/tutorApi";
import Filter from "../../components/Filter/Filter";
import Structure from "../../components/Structure/Structure";
import "./Tutor.css";

import TutorModal from "./TutorModal";

const Tutor = () => {
  // Random names and languages
  // const randomNames = [
  // 	'Alice',
  // 	'Bob',
  // 	'Charlie',
  // 	'David',
  // 	'Emma',
  // 	'Frank',
  // 	'Grace',
  // 	'Henry',
  // 	'Ivy',
  // 	'Jack',
  // 	'Katie',
  // 	'Liam',
  // 	'Mia',
  // 	'Noah',
  // 	'Olivia',
  // 	'Peter',
  // 	'Quinn',
  // 	'Rachel',
  // 	'Sam',
  // 	'Taylor',
  // 	'Uma',
  // 	'Victor',
  // 	'Wendy',
  // 	'Xander',
  // 	'Yasmine',
  // 	'Zack'
  // ];
  // const randomLanguages = [
  // 	'English',
  // 	'Spanish',
  // 	'French',
  // 	'German',
  // 	'Italian',
  // 	'Chinese',
  // 	'Japanese',
  // 	'Russian',
  // 	'Arabic',
  // 	'Portuguese',
  // 	'Korean',
  // 	'Dutch'
  // ];

  // // Generate random name
  // function generateRandomName() {
  // 	return randomNames[Math.floor(Math.random() * randomNames.length)];
  // }

  // // Generate random list of languages
  // function generateRandomLanguages() {
  // 	const numLanguages = Math.floor(Math.random() * (randomLanguages.length - 1)) + 1; // Random number of languages between 1 and the length of randomLanguages
  // 	const shuffledLanguages = randomLanguages.sort(() => Math.random() - 0.5); // Shuffle the languages array
  // 	return shuffledLanguages.slice(0, numLanguages); // Return a slice of shuffled languages array
  // }

  const [tutors, setTutors] = useState([]);
  const [currentTutor, setCurrentTutor] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;
      const role = decodedToken.role;
      const response =
        role === "student" ? await getStudent(id) : await getTutor(id);
      setUser(response.data);
    };
    fetchUser();
  }, []);

  // for (let i = 1; i <= 100; i++) {
  // 	tutors.push({
  // 		image: `https://via.placeholder.com/100?text=Tutor${i}`,
  // 		name: generateRandomName(),
  // 		languages: generateRandomLanguages(),
  // 		experience: Math.floor(Math.random() * 10) + 1, // Random experience between 1 and 10
  // 		rating: Math.floor(Math.random() * 5) + 1 // Random rating between 1 and 5
  // 	});
  // }

  useEffect(() => {
    getTutors().then(async (tutors) => {
      const x = tutors.data;
      x.image = "https://via.placeholder.com/100?text=Tutor";
      x.rating = Math.floor(Math.random() * 5) + 1;
      setTutors(x);
    });
  }, []);

  const Allptions = {
    Languages: [
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
    ],
    Experience: [
      "1-3 years",
      "3-5 years",
      "5-7 years",
      "7-10 years",
      "10+ years",
    ],
    Rating: ["1", "2", "3", "4", "5"],
  };

  const optionClickHandler = (head, value) => {
    console.log(head, value);
  };

  const leftComponent = (
    <Filter Allptions={Allptions} optionClickHandler={optionClickHandler} />
  );

  const rightComponent = (
    <div className="tutor-container">
      <input type="text" placeholder="Search Tutor" className="search-tutor" />
      <div className="tutor-list">
        {tutors.map((tutor, index) => {
          return (
            <div className="tutor-card" key={index}>
              <div className="tutor__details">
                <div className="tutor__image">
                  <img
                    src="https://via.placeholder.com/100?text=Tutor"
                    alt=""
                  />
                </div>
                <div className="tutor__info">
                  <h3 className="tutor__name">{tutor.name}</h3>
                  <div className="tutor__languages">
                    {tutor.languages.map((language, index) => {
                      return <span key={index}>{language}</span>;
                    })}
                  </div>
                  <div className="tutor__experience">
                    <p>Experience: {tutor.yearsOfExperience} years</p>
                  </div>
                </div>
              </div>
              <div className="tutor__actions">
                <div className="tutor__rating">
                  {[...Array(tutor.rating)].map((star, index) => {
                    return <AiFillStar key={index} style={{ color: "gold" }} />;
                  })}
                  {[...Array(5 - tutor.rating)].map((star, index) => {
                    return (
                      <AiFillStar key={index} style={{ color: "black" }} />
                    );
                  })}
                </div>
                <button className="btn" onClick={() => setCurrentTutor(tutor)}>
                  {" "}
                  View Profile{" "}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <TutorModal
        isOpen={currentTutor}
        onClose={() => setCurrentTutor(null)}
        tutor={currentTutor}
        user={user}
      />
    </div>
  );

  return (
    <div className="container">
      <Structure
        LeftCompnonet={leftComponent}
        RightComponent={rightComponent}
        ContainerComponent={null}
      />
    </div>
  );
};

export default Tutor;
