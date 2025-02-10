import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cards1 from "../Components/cards/Cards1";
import Header from "../Components/Header";

function Builder_dashboard() {
  const navigate = useNavigate();
  const cardData1 = useSelector((state) => state.builder.cards);  // ✅ Redux se data fetch

  return (
    <>
      <Header />
      <div className="container-fluid"  style={{ marginTop: "8rem" }}>
        <h1 className="text-center my-3">Builder Dashboard</h1>
        <p className="text-center fs-5">
          Welcome to the Builder Dashboard! Manage your construction projects effectively.
        </p>
        <div className="row g-3 px-2 my-4 justify-content-center text-center">
          {cardData1.map((card, index) => (
            <Cards1
              key={index}
              imgSrc={card.imgSrc}
              title={card.title}
              text={card.text}
              buttonText={card.buttonText}
              onClick={() => navigate(card.route)}  // ✅ Navigate Redux route ke according
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Builder_dashboard;
