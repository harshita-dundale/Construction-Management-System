import Cards2 from "../Components/cards/Cards2";
  import { useNavigate } from 'react-router-dom';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import "./BuilderDashboard.css";
  import icon1 from "../assets/images/icons/icon1.gif"
  import icon2 from "../assets/images/icons/icon2.gif"
  import icon3 from "../assets/images/icons/icon3.gif"
  import icon4 from "../assets/images/icons/icon4.gif"
  import Header from "../Components/Header";

 function Builder_dashboard() {
  const navigate = useNavigate();

  const cardData1 = [
    {
      imgSrc: icon1,
      title: "Post and edit job",
      text: "Handle your projects efficiently and track progress.",
      buttonText: "Get Started",
      onClick: () => navigate("/post-job"),
    },
    {
      imgSrc: icon2,
      title: "View Applications",
      text: "Improve productivity with effective collaborative tools.",
      buttonText: "Get Started",
      onClick: () => navigate("/ViewApplications"),
    },
    {
      imgSrc: icon3,
      title: "Hire Worker",
      text: "Monitor construction materials to reduce wastage.",
      buttonText: "Get Started",
    },
    {
      imgSrc: icon4,
      title: "Assign tasks",
      text: "Analyze costs & profits detail for effective budgeting.",
      buttonText: "Get Started",
    },
  ];

   return (
    <> 
     <Header />
     <div className="container-fluid">

           <h1 className="text-center my-5">Builder Dashboard</h1>
           <h5 className="text-center">
               Welcome to the Builder Dashboard! Manage your construction projects effectively.
            </h5>
            <div className="row g-3 px-2 my-4 justify-content-center">
            {cardData1.map((card, index) => (
            <Cards2
              key={index}
               imgSrc={card.imgSrc}
              title={card.title}
              text={card.text}
              buttonText={card.buttonText}
              onClick={card.onClick}
            />
          ))}
            </div>
     </div>
  </> 
  )
 }

 export default Builder_dashboard;
