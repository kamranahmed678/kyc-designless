import React,{ Fragment } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import {Button,Container} from "react-bootstrap"

import UserContext from './store/user-context'
import SuperAdmin from "./pages/SuperAdmin";
import CompanyAdmin from "./pages/CompanyAdmin";
import Header from "./components/Header"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AddCompany from "./pages/AddCompany";



function Router(){
    const { userState: { isAuth,superAdmin,companyAdmin,companyId }, setUserState } = useContext(UserContext)
    const [isLoaded, setIsLoaded] = useState(false)
    const navigate = useNavigate();

    const logOutBtnHandler = (showToast = false) => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setUserState({ isAuth: false, token: null,email: null, userId: null, superAdmin: false, companyAdmin: false, companyId: null })
        navigate('/')
    }
    useEffect(() => {
        setIsLoaded(false)
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        const superadmin = localStorage.getItem('superAdmin')
        const companyadmin = localStorage.getItem('superAdmin')
        const companyid = localStorage.getItem('companyId')
        console.log(token)
        console.log(userId)
        if (!token || !userId) {
            logOutBtnHandler()
            setIsLoaded(true)
            return
        }
        setUserState({ isAuth: true, token: token, userId: userId , superAdmin: superadmin, companyAdmin: companyadmin, companyId: companyid, updateUser:false})
        
        setIsLoaded(true)
    }, [setUserState])

    console.log(isAuth)
    return(
      <Fragment> 
            {isLoaded?
                <Routes>
                    {
                        isAuth?
                            localStorage.getItem('superAdmin')=="true"?
                                <Route path='/' element={<Header logOutBtnHandler={logOutBtnHandler}/>} >
                                    <Route path='/' element={<SuperAdmin  />}/>
                                    <Route path='/dashboard' element={<SuperAdmin  />}/>
                                    <Route path='/addcompany' element={<AddCompany  />}/>
                                </Route>
                            :
                                <Route path='/' element={<Header logOutBtnHandler={logOutBtnHandler}/>} >
                                    <Route path='/' element={<CompanyAdmin  />}/>
                                    <Route path='/dashboard' element={<CompanyAdmin  />}/>
                                </Route>
                        :
                            <Route>
                                <Route path='/' element={<Login  />}/>
                                <Route path='/login' element={<Login  />}/>
                                <Route path='/signup' element={<Signup />}/>
                            </Route>
                        

                    }
                    <Route
                        path='*'
                        element={
                            <div className='heading'>
                                <Container className='d-flex flex-column '>
                                    <h1>There's nothing here. You've taken a wrong turn!</h1>
                                    <Button className='w-25' style={{ fontSize: '1.5rem' }} onClick={() => navigate(-1)}>Go Back</Button>
                                </Container>
                            </div>
                        }
                    />

                </Routes>
                :
                <>
                </>
            }
        </Fragment>
    )
}

export default Router