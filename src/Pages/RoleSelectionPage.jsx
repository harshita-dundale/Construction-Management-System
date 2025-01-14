import { useNavigate } from "react-router-dom"
import role1 from "../assets/images/photos/role1.svg"
import role2 from "../assets/images/photos/role2.svg"
import SelectRole from "../Components/SelectRole"

function RoleSelectionPage() {
  const navigate = useNavigate()

  const roles = [
    {
      imgSrc : role1,
       h1Text : "Builder",
       pText:"Choose the Builder role to streamline construction, assign tasks, and ensure project success—your key to to find skilled workers!",
       buttonText: "submit",
       onClick : ()=> navigate("/builder-page")
    },
    {
      imgSrc : role2,
       h1Text : "Worker",
       pText:" Opt for the Worker role to contribute to construction projects, track tasks, report progress, and collaborate seamlessly!",
       buttonText: "submit",
        onClick : ()=> navigate("/browse-Job")
    }
  ]
  return (
    <div className="container my-3">
      <div className="row">

      <div className="col-lg-12 text-center">
          <h1 style={{color:"#f58800"}}>Select Your Role ! </h1>
          </div>
      
       { roles.map((role, index) => (
          <SelectRole 
                 key = {index}
                 imgSrc = {role.imgSrc}
                 h1Text = {role.h1Text}
                 pText = {role.pText} 
                 buttonText = {role.buttonText}
                 onClick = {role.onClick}
          />
        ))
       }
      </div>
    </div>
  )
}

export default RoleSelectionPage