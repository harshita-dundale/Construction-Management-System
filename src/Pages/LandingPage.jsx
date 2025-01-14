import Cards1 from "../Components/cards/Cards1";
import Cards2 from "../Components/cards/Cards2";
import Footer from "../Components/Footer"
import "./LandingPage.css"
import Header from "../Components/Header";

import homeImg from "../assets/images/photos/homeImg.png"
import aboutImg from "../assets/images/photos/aboutImg.png"
import icon1 from "../assets/images/icons/icon1.gif"
import icon2 from "../assets/images/icons/icon2.gif"
import icon3 from "../assets/images/icons/icon3.gif"
import icon4 from "../assets/images/icons/icon4.gif"
import worker1 from "../assets/images/icons/worker1.gif"
import worker2 from "../assets/images/icons/worker2.gif"

function LandingPage() {

  const handleSeeMore = () => {
    const aboutSection = document.querySelector("#about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cardBuilder = [
    {
      imgSrc: icon1,
      title: "Job Management",
      text: " Simplify job posting and manage all your project listings in one place, connecting with skilled workers.",
      buttonText: "Get start",
    },
    {
      imgSrc: icon2,
      title: "Worker Management",
      text: " Easily hire, organize, and manage your workforce for optimal productivity on every project.",
      buttonText: "Get start",
    },
    {
      imgSrc: icon3,
      title: "Material Management",
      text: " Track and manage construction materials efficiently to minimize wastage and reduce costs.",
      buttonText: "Get start",
    },
    {
      imgSrc: icon4,
      title: "Profit / Cost Analysis",
      text: " Monitor project budgets and analyze profit/loss in real time to keep your business on track.",
      buttonText: "Get start",
    }
  ];

  const cardWorker = [
    {
      imgSrc: worker1,
      title: "Browse and Apply for job",
      text: "Explore available projects and apply to the ones that match your skills and expertise",
      buttonText: "Get start",
    }, {
      imgSrc: worker2,
      title: "Payment Management",
      text: " Keep track of payments received, pending amounts, and financial summaries.",
      buttonText: "Get start",
    }
  ]
  return (
    <>
      <Header />
      <section className="container mb-5" id="home-section" style={{ marginTop: "100px" }}>
        <div className="row align-items-center">
          <div className="col-md-6 col-12">
            <h1 style={{ color: "#f58800" }}>Builders and workers Collaboration</h1>
            <p className="align-items-end mt-5 fs-5">
              Welcome to our Builder-Worker Management Platform, where construction meets efficiency, our platform is here to help you succeed.</p>
            <button onClick={handleSeeMore} className="btn btn-light rounded-pill mt-3" id="see-more-btn">see more</button>
          </div>
          <div className="col-md-6 col-12 text-center mt-4 mt-md-0">
            <img src={homeImg} width="446" height="343" alt="ConstructHub" className="img-fluid rounded" />
          </div>
        </div>
      </section>

      <div className="container-fluid" id="services-section">
        <h1 className="text-center my-7">Services</h1>
        <div className="page2" style={{paddingBottom:"64px"}} >
          <div className="text-center my-5 row ">
            <p className="fs-5 pt-5" >
              We provide customized solutions for Builders and Workers to boost productivity, streamline tasks, <br /> and enhance efficiency, helping them focus on what they do best.
            </p>
            <section className="" style={{paddingTop:"10px"}}>
              <h2 className="mb-4">Builder Services</h2>
              <div className="row g-3 px-2 justify-content-between mb-4">
                {cardBuilder.map((card, index) => (
                  <Cards1
                    key={index}
                    imgSrc={card.imgSrc}
                    title={card.title}
                    text={card.text}
                    buttonText={card.buttonText} />
                ))}
              </div>
            </section>
          </div>

          <section className="my-5 text-center mb-4">
            <h2 className="mb-4">Worker Services</h2>
            <div className="row g-3 px-2 justify-content-center">

              {cardWorker.map((card1, index) => (
                <Cards2
                  key={index}
                  imgSrc={card1.imgSrc}
                  title={card1.title}
                  text={card1.text}
                  buttonText={card1.buttonText} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="container my-5 mt-5" id="about-section">
        <div className="row align-items-center">
          <div className="col-md-5 col-12 text-center mb-4 mb-md-0">
            <img src={aboutImg} width="446" height="343" alt="ConstructHub" className="img-fluid " />
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
  )
}

export default LandingPage;

// Page1 img -> "//www.zohowebstatic.com/sites/zweb/images/projects/construction/construction-illustration.png"