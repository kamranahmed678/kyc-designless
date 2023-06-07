import React,{useContext,useEffect, Fragment, useState } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom'
import UserContext  from "./store/AuthContext";
import { Button, Container } from 'react-bootstrap'
import { Navigate } from "react-router-dom";


import Home from "./pages/Home";
import SelectDoc from "./pages/SelectDoc";
import UploadDoc from "./pages/UploadDoc";
import Header from "./components/Header";
import TakeSelfie from "./pages/TakeSelfie";
import DoKyc from "./pages/DoKyc";

function Router(){
    const { userState: { isAuth,email }, setUserState } = useContext(UserContext)
    const navigate=useNavigate()
    const [loading,setLoading]=useState(true)

    const logOutBtnHandler = (route='/') => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('tokenExpiry')
        setUserState({ isAuth: false, token: null,tokenExpiry:null,email:'' })
        if (route=='/')
            navigate(route)
        else
            window.location.href = route;
    }

    useEffect(() => {
        const render = async ()=>{
            setLoading(true)
            const token = localStorage.getItem('token')
            const email = localStorage.getItem('email')
            const tokenExpiry = localStorage.getItem('tokenExpiry')
            if (!token || !email) {
                logOutBtnHandler()
                return
            }
            setUserState({ isAuth: true, token: token,tokenExpiry:tokenExpiry,email:email })
            setLoading(false)
            console.log(token,email,tokenExpiry)
        }

        render()
    }, [])

    console.log(loading)
    return(
        
            <Fragment>
                <Routes> 
                            {!isAuth ?
                                <Route path='/' element={<Home />} />
                                :
                                <Route path='/' element={<Header logOutBtnHandler={logOutBtnHandler}/>} >
                                    <Route path='/' element={<SelectDoc logOutBtnHandler={logOutBtnHandler} />} />
                                    <Route path='/selectdoc' element={<SelectDoc />} />
                                    <Route path='/uploaddoc' element={<UploadDoc />} />
                                    <Route path='/takeselfie' element={<TakeSelfie />} />
                                    <Route path='/dokyc' element={<DoKyc logOutBtnHandler={logOutBtnHandler} />} />         
                                </Route>}
                                {!loading && <Route
                                    path='*'
                                    element={
                                        <div className='heading'>
                                            <Container className='d-flex flex-column '>
                                                <h1>There's nothing here. You've taken a wrong turn!</h1>
                                                <Button className='w-25' style={{ fontSize: '1.5rem' }} onClick={() => navigate(-1)}>Go Back</Button>
                                            </Container>
                                        </div>
                                        }
                                />}
                    
                </Routes>
            </Fragment>
            
    )
}

export default Router