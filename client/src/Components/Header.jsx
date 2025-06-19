import "../styles/header.css"
import Button from "./Button"
const Header = () => {
  const home = "Homepage"
  const profile = "Profile"
  const login = "Login"
  const regsiter = "Register"
  return <div className="header-container">
    
    <Button text ={home}/>
    <Button text ={profile}/>
    <Button text ={login}/>
    <Button text ={regsiter}/>
   
    </div>
}

export default Header
