import Structure from "../../components/Structure/Structure";
import "./Profile.css";

const Profile = () => {
  const leftComponent = (
    <div className="profile">
      <div className="profile-info">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="profile-pic"
        />
        <h2 className="username">Username</h2>
        <p className="role">Role-(exp)</p>
      </div>
      <div className="profile-details">
        <h3 className="languages">Languages</h3>
        <p>English</p>
        <p>Spanish</p>
        <p>French</p>
      </div>
    </div>
  );

  const rightComponent = (
    <div className="profile-right">
      <div className="profile-right-top">
        <span className="logo-badge">Upcoming Classes</span>
        <div className="upcoming-classes">
          <div>
            <h3>English Class</h3>
            <p>12/12/2021</p>
            <p>10:00 AM - 11:00 AM</p>
            <button>Join</button>
          </div>
          <div>
            <h3>English Class</h3>
            <p>12/12/2021</p>
            <p>10:00 AM - 11:00 AM</p>
            <button>Join</button>
          </div>
          <div>
            <h3>English Class</h3>
            <p>12/12/2021</p>
            <p>10:00 AM - 11:00 AM</p>
            <button>Join</button>
          </div>
        </div>
      </div>
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

export default Profile;
