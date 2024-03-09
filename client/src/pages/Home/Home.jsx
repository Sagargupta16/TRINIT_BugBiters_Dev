import "./Home.css";
import WorkFlow from "./assets/workflow.png";

const Home = () => {
  return (
    <div className="home-container">
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Learn Any Language Online</h1>
            <p>Connect with expert tutors and start learning today.</p>
            <div className="search-bar">
              <input type="text" placeholder="What do you want to learn?" />
              <button className="btn btn-primary">Find Tutor</button>
            </div>
          </div>
        </section>
        <div className="features">
          <img src={WorkFlow} alt="Learn Anywhere" />
        </div>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Lingua Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
