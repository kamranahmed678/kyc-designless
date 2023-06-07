import React, { useState,useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/admin';
import UserContext from '../store/user-context';

const Login=()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate=useNavigate()
    const { userState, setUserState } = useContext(UserContext)
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleLogin = async () => {
      try{
        const resp = await loginUser({email,password})
        console.log(resp)
        if(resp.success){
          toast.success("Login successful")
          setEmail('')
          setPassword('')
          localStorage.setItem('token', resp.token)
          localStorage.setItem('userId', resp.userId)
          localStorage.setItem('superAdmin', resp.superadmin)
          localStorage.setItem('companyAdmin', resp.companyadmin)
          if(resp.companyid)
            localStorage.setItem('companyId', resp.companyid)
          console.log("setting up local storage ",resp.userId," ",resp.superadmin, resp.companyadmin, resp.companyid)
          const remainingMilliseconds = 60 * 60 * 1000;
          const expiryDate = new Date(
              new Date().getTime() + remainingMilliseconds
          );
          localStorage.setItem('expiryDate', expiryDate.toISOString());
          setUserState({ isAuth: true, token: resp.token, userId: resp.userId, superAdmin: resp.superadmin, companyAdmin: resp.companyadmin, companyId: resp.companyid })
          // console.log("response: ",resp.isadmin)
          navigate('/')
        }
        else{
          toast.error(resp.message)
        }
      }
      catch(e){
        toast.error(e)
      }
    };
  
    return (
      <Container style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
        <h1>Login Page</h1>
        <Form style={{width:'30%'}}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" value={email} onChange={handleEmailChange} />
          </Form.Group>
  
          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" value={password} onChange={handlePasswordChange} />
          </Form.Group>          
        </Form>
            <div style={{marginTop:'20px'}}>
                <Button variant="primary" onClick={handleLogin}>Login</Button>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
      </Container>
    );
}

export default Login;