import "./home.css";
import UserAvatar from "../atoms/userAvatar";

const Home = () => {
  return (
    <div className="ContentContainer">
      <UserAvatar />
      <div className="subContentContainer">
        <h2>Features are locked!</h2>
        <p>
          To unlock the app to it's full extend add your significant other!{" "}
        </p>
        <button>Add</button>
      </div>
    </div>
  );
};

export default Home;
