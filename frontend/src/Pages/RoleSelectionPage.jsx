import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectRoles } from "./Redux/RoleSlice";
import SelectRole from "../Components/SelectRole";

function RoleSelectionPage() {
  const navigate = useNavigate()
  const roles = useSelector(selectRoles);

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
                 onClick = {() => navigate(role.route)}
          />
        ))
       }
      </div>
    </div>
  )
}

export default RoleSelectionPage