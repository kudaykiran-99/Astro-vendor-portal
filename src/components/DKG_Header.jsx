import React from "react";
// import { ReactComponent as Logo } from "../assets/images/logo.svg";
import MyLogo from "../assets/iia-logo.png";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import IconBtn from "./DKG_IconBtn"
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice";

const Header = ({toggleCollapse}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handler for logging out
  const handleLogout = () => {
    dispatch(logout());
    // Navigate to the login page after logging out
    navigate("/");
  };

  return (
    <header className="bg-offWhite shadow-md py-4 px-4 flex justify-between items-center sticky top-0 w-full z-20">
      <div className="flex gap-4 items-center">
        <span>
          <IconBtn icon={MenuOutlined} className="shadow-none"  onClick={toggleCollapse}/>
        </span>
        <span onClick={() => navigate('/')}>
          <img src={MyLogo} height={10} width={50} />
        </span>
      </div>
      <IconBtn
        text="Logout"
        icon={LogoutOutlined}
        className="bg-offWhite overflow-hidden"
        onClick={handleLogout}
      />
    </header>
  );
};

export default Header;