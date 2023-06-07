import { Navbar,Nav,Container, Button } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import UserContext from "../store/AuthContext";
import { useContext,useState,useEffect } from "react";

const Header=({logOutBtnHandler})=>{
    const { userState:{email,tokenExpiry} } = useContext(UserContext)

    const [timeRemaining, setTimeRemaining] = useState(null);

    useEffect(() => {
        const calculateTimeRemaining = () => {
          const currentTime = new Date();
          const expiryTime = new Date(tokenExpiry);
          const timeDifference = expiryTime - currentTime;
    
          if (timeDifference > 0) {
            const minutesRemaining = Math.floor(timeDifference / 60000);
            const secondsRemaining = Math.floor((timeDifference % 60000) / 1000);
            setTimeRemaining(`${minutesRemaining.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`);
          } else {
            // Token has expired
            setTimeRemaining('00:00');
            logOutBtnHandler()
          }
        };
    
        calculateTimeRemaining();
        const timer = setInterval(calculateTimeRemaining, 1000);
    
        return () => {
          clearInterval(timer);
        };
      }, [tokenExpiry]);



    return(
        <>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand>KYC</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link>{email}</Nav.Link>
                        {timeRemaining !== null && <Nav.Link>Session time left: {timeRemaining}</Nav.Link>}
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