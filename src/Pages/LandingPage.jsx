
import { useSelector } from "react-redux";
import Cards1 from "../Components/cards/Cards1";
import Cards2 from "../Components/cards/Cards2";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import "./LandingPage.css";
import homeImg from "../assets/images/photos/homeImg.png";
import aboutImg from "../assets/images/photos/aboutImg.png";
import { selectCardBuilder, selectCardWorker } from "./Redux/CardSlice";

function LandingPage() {
  const cardBuilder = useSelector(selectCardBuilder);
  const cardWorker = useSelector(selectCardWorker);

  const handleSeeMore = () => {
    const aboutSection = document.querySelector("#about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Header />
      <section className="container mb-5" style={{ marginTop: "100px" }} id="home-section">
        <div className="row d-flex align-items-center">
          <div className="col-md-6 col-12">
            <h1 style={{ color: "#f58800" }} className="text-center text-md-start mt-3 mt-md-0">Builders and workers Collaboration</h1>
            <p className="mt-5 fs-5 text-center text-md-start">
              Welcome to our Builder-Worker Management Platform, where construction meets efficiency, our platform is here to help you succeed.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start">
            <button
              onClick={handleSeeMore}
              className="btn btn-light mt-3"
              id="see-more-btn"
            >
              see more
            </button>
            </div>
          </div>
          <div className="col-md-6 col-12 text-center mt-4 mt-md-0">
            <img
              src={homeImg}
              width="446"
              height="343"
              alt="ConstructHub"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>

      <div className="container-fluid" id="services-section">
        <h1 className="text-center my-7">Services</h1>
        <div className="page2" style={{ paddingBottom: "64px" }}>
          <div className="text-center row ">
            <p className="fs-5 pt-5">
              We provide customized solutions for Builders and Workers to boost productivity, streamline tasks, <br /> and enhance efficiency, helping them focus on what they do best.
            </p>
            <div>
              <h2 className="mt-5 mb-4">Builder Services</h2>
              <div className="row g-3 px-2 justify-content-between mb-4">
                {cardBuilder.map((card, index) => (
                  <Cards1
                    key={index}
                    imgSrc={card.imgSrc}
                    title={card.title}
                    text={card.text}
                    buttonText={card.buttonText}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="mb-4 mt-5">Worker Services</h2>
            <div className="row g-3 px-2 justify-content-center">
              {cardWorker.map((card, index) => (
                <Cards2
                  key={index}
                  imgSrc={card.imgSrc}
                  title={card.title}
                  text={card.text}
                  buttonText={card.buttonText}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5 mt-5" id="about-section">
        <div className="row align-items-center">
          <div className="col-md-5 col-12 text-center mb-4 mb-md-0">
            <img
              src={aboutImg}
              width="446"
              height="343"
              alt="ConstructHub"
              className="img-fluid "
            />
          </div>
          <div className="col-md-7 col-12">
            <h1 className="text-center">About us</h1>
            <p className="align-items-end mt-5 fs-5 text-center">
              At the heart of every successful construction project lies effective collaboration between builders and workers. Our platform bridges the gap, empowering builders to manage projects seamlessly and workers to showcase their skills efficiently. By providing cutting-edge tools for job management, workforce coordination, material tracking, and real-time profit analysis, we aim to revolutionize the construction industry. Together, we build not just structures, but trust, efficiency, and progress, one project at a time.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
