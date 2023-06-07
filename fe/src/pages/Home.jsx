import React, { useContext, useEffect, useState } from 'react';
import  UserContext  from '../store/AuthContext';
import { Navigate, useNavigate,useLocation  } from 'react-router-dom';
import { loginUser } from '../services/user';


const Home = () => {
  const [message,setMessage]=useState()

  const { userState, setUserState } = useContext(UserContext)
  const navigate=useNavigate()

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const accessKey=queryParams.get('accesskey');
  const referrer=document.referrer
  console.log(email)
  console.log(document.referrer)

  const handleLogin = async (e) => {
    try {
      const resp = await loginUser({email:email,accessKey:accessKey,referrer:referrer})
      console.log(resp)
      if(resp.token){
        localStorage.setItem('token', resp.token)
        localStorage.setItem('email', email)
        localStorage.setItem('tokenExpiry',resp.tokenExpiry)
        setUserState({ isAuth: true, token: resp.token,tokenExpiry:resp.tokenExpiry,email:email })
        navigate('/')
      }
      else{
        setMessage(resp.message)
      }
    }
    catch(e){
      console.log(e)
    }
    
  };

  function isValidEmail(email) {
    // Regular expression pattern for email validation
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    
    return emailPattern.test(email);
  }

  useEffect(()=>{
    if(email){
      if(isValidEmail(email)){
        if(accessKey){
          setMessage('Valid Email')
          setTimeout(() => {
            handleLogin()
          }, 2000);
        }
        else{
          setMessage('No Access Key found')
        }
      }
      else{
        setMessage('Invalid Email')
      }
    }
    else{
      setMessage('No Email Found')
    }
  },[])

  return (
    <>
      <h1>{message}</h1>
    </>
  );
};

export default Home;