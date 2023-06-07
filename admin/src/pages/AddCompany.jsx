import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { registerUser } from '../services/admin';

const AddCompany=()=>{

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        password: '',
        confirmPassword: '',
      });

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };
    
    const clearInputValues = () => {
        setFormData({ 
            firstName: '',
            lastName: '',
            email: '',
            companyName: '',
            password: '',
            confirmPassword: ''})
    }

    const handleSignup = async () => {
        try
        {
            if(formData.password===formData.confirmPassword)
            {
                const resp = await registerUser(formData)
                if(resp.success){
                    clearInputValues()
                    toast.success("successful")
                    toast.success(resp)
                    setTimeout(() => {
                        navigate('/dashboard')
                    }, 1000);
                }
                else{
                    toast.error(resp)
                }
            }
            else{
                toast.error("passwords dont match")
            }
        }
        catch(e){
            toast.error(e)
        }
      };


    return (
        <div style={{marginTop:'80px',display:'flex',alignItems:'center',flexDirection:'column'}}>
            <h2>Add Company</h2>
            <Form style={{width:'30%'}}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
    
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Form.Group>
    
            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
    
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name:</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </Form.Group>
    
            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
    
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </Form.Group>
    
            
          </Form>
          <div style={{marginTop:'20px'}}>
          <Button variant="primary" onClick={handleSignup}>
              Signup
            </Button>
                <p>Already have an account? <Link to="/login">Login up</Link></p>
          </div>
        </div>
    )
}

export default AddCompany;