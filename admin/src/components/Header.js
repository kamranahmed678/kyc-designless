import { Navbar,Nav,Container, Button } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import UserContext from "../store/user-context";
import { useContext,useState,useEffect } from "react";

const Header=({logOutBtnHandler})=>{
    const { userState:{email} } = useContext(UserContext)

    



    return(
        <>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand>KYC</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link>{email}</Nav.Link>
                    </Nav>
                    <Button variant="dark" onClick={logOutBtnHandler}>Logout</Button>
                </Container>
            </Navbar>
      
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default Header;