import React, { useState } from 'react';
import Btn from '../../components/DKG_Btn';
import MyLogo from "../../assets/iia-logo.png";
import FormBody from '../../components/DKG_FormBody';
import FormInputItem from '../../components/DKG_FormInputItem';
import { useDispatch } from 'react-redux';
//import { login } from '../../store/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../../components/DKG_FormContainer';
import { fetchMasters } from '../../store/slice/masterSlice';
import { login } from '../../store/slice/authSlice';
import { setVendor } from '../../store/slice/authSlice';
import axios from 'axios';




const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleFormValueChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
    setMessage('');
  };
/*
  const handleFormSubmit = async () => {
    const { userId, password } = formData;

    try {
      const response = await axios.get(`/api/vendor-quotation/VendorStatus/${userId}`);
      if (response.ok) {
       // const data = await response.json();
        const data = response.data;
        const status = data.responseData.status;
        const Password = data.responseData.password;

        if (Password !== password) {
          setMessage("Incorrect password.");
          return;
        }

        if (status === "APPROVED") {
          try {
           // await dispatch(login({ vendorId: userId, password })).unwrap();
            // await dispatch(login(formData)).unwrap();
            // dispatch(fetchMasters());
            dispatch(setVendor(data.responseData));
            navigate(`/vendor/${userId}`);
          } catch (error) {
            setMessage("Invalid credentials");
          }
        } else if (status === "REJECTED") {
          const comments = data.responseData.comments || "Your request was rejected with no comments provided.";
         // setMessage('Sorry, your request has been rejected. Reason:');
          setMessage(`Sorry, your request has been rejected. Reason: ${comments}`);

        } else if (status === "AWAITING_APPROVAL") {
          setMessage("Your registration is in review stage. Please wait for sometime...");
        } else if (status === "NOT_FOUND") {
          setMessage("Vendor ID not found");
        } else {
          setMessage("Unknown status");
        }
      } else {
        setMessage("Error fetching vendor status");
      }
    } catch (error) {
      setMessage("Error fetching vendor status");
    }
  };*/
  const handleFormSubmit = async () => {
  const { userId, password } = formData;

  try {
    const response = await axios.get(`/api/vendor-quotation/VendorStatus/${userId}`);
    const data = response.data;
    const status = data.responseData.status;
    const Password = data.responseData.password;

    if (Password !== password) {
      setMessage("Incorrect password.");
      return;
    }

    if (status === "APPROVED") {
      try {
        dispatch(setVendor(data.responseData));
        navigate(`/vendor/${userId}`);
      } catch (error) {
        setMessage("Invalid credentials");
      }
    } else if (status === "REJECTED") {
      const comments = data.responseData.comments || "Your request was rejected with no comments provided.";
      setMessage(`Sorry, your request has been rejected. Reason: ${comments}`);
    } else if (status === "AWAITING_APPROVAL") {
      setMessage("Your registration is in review stage. Please wait for sometime...");
    } else if (status === "NOT_FOUND") {
      setMessage("Vendor ID not found");
    } else {
      setMessage("Unknown status");
    }
  } catch (error) {
    setMessage("Error fetching vendor status");
  }
};


  const handleRegisterRedirect = () => {
    navigate('/app');
  };

  return (
    <>
      <header className='bg-darkBlue text-offWhite p-4 fixed top-0 w-full z-30'>
        <h1>Log In</h1>
      </header>
      <FormContainer className='mt-20 main-content border-none !shadow-none'>
        <main className='w-full p-4 flex flex-col h-fit justify-center items-center gap-8 bg-white relative z-20 rounded-md'>
          <img src={MyLogo} width={200} height={150} alt="Logo" />
          <FormBody onFinish={handleFormSubmit} initialValues={formData}>
            <FormInputItem 
              label="Vendor ID" 
              placeholder="123456" 
              name='userId' 
              onChange={handleFormValueChange} 
              required 
            />
            <FormInputItem 
              type='password' 
              label="Password" 
              placeholder="*****" 
              name='password' 
              onChange={handleFormValueChange} 
              required 
            />
            {message && <p className="text-red-500">{message}</p>}
            <div className='custom-btn'>
              <Btn htmlType="submit" text="Sign In"/>
            </div>
          </FormBody>
          <h2 className='text-gray-500 text-center'>
            Account credentials unavailable?<br />
            Request Admin for your credentials.
          </h2>
          <p className='text-gray-500 text-center'>
            New to us? <span className="text-sm text-blue-600 cursor-pointer hover:underline" onClick={handleRegisterRedirect}>Register here</span>
          </p>
        </main>
      </FormContainer>
    </>
  );
};

export default Login;