
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useRef, useEffect,useContext } from 'react'

import readmessage from "../images/icons/read.svg";
import Pending from "../images/icons/pending.svg";
import Send_message from "../images/icons/send.svg";
import Expired from "../images/icons/expired.svg";
import Calendar from "../images/company/calendar.svg";

import Broadcastcard from "../components/broadcast-card" ;
import Companytable from "../components/companytable";
import { getAllUsers,reverseDeleteUser ,deleteUser ,editApproval,getKycCounts} from "../services/superadmin";


import "../css/companylisting.css";
import { getKycCount } from "../services/companyadmin";
import { useNavigate } from "react-router-dom";

const SuperAdmin = () => {

    const [ctshow, setCtShow] = useState(false);
    const [cvsshow, setCvsShow] = useState(false);
    const [cvsshow1, setCvsShow1] = useState(false);
    const [expiredhow, setExpiredShow] = useState(false);
    const [updateUi,setUpdateUi]=useState(false)
    const [allUsers,setAllUsers]=useState([])
    const [loading,setLoading]=useState(false)
    const [date,setDate]=useState(null)
    const [kycCounts,setKycCounts]=useState({all:0,complete:0,success:0,failed:0})
    const [active, setActive] = useState(0);
    const [companyToShow,setCompanyToShow]=useState(null)
    

    const navigate=useNavigate()
    const handleClick = (index) => {
        setActive(index);
    }

    const [companiesInfo,setCompaniesInfo]=useState({
        active: 0,
        pending: 0,
        expired: 0
    })

    const items = ["Day","Weekly","Monthly","Yearly"];


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await getAllUsers()
                setLoading(true)
                if (resp.success) {
                    setAllUsers(resp.users)
                    console.log(loading)
                }
                else
                    throw new Error(resp.error)
                setLoading(false)
            } catch (error) {
                console.log(error.message)
                console.log('Failed to fetch Users!')
            }
        }

        fetchData()
    }, [updateUi])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const resp = await getKycCounts()
                setLoading(true)
                if (resp.success) {
                    setKycCounts(resp.kycCounts)
                    console.log(resp)
                }
                else
                    throw new Error(resp.error)
                setLoading(false)
            } catch (error) {
                console.log(error.message)
                console.log('Failed to fetch Messages!')
            }
        }

        fetchData()
    },[])

    useEffect(()=>{
        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
        const year = today.getFullYear().toString();
        const formattedDate = `${day}/${month}/${year}`;
        console.log(formattedDate); // outputs "03/02/2023"
        setDate(formattedDate)
    },[])

    useEffect(() => {
        let activeCount = 0;
        let pendingCount = 0;
        let expiredCount = 0;
      
        allUsers.forEach((company) => {
          if (company.isdeleted){
            expiredCount++;
          }
          else{ 
            if (company.isapproved) {
                activeCount++;
            } else {
                pendingCount++;
            } 
        }
        });
      
        setCompaniesInfo({
          active: activeCount,
          pending: pendingCount,
          expired: expiredCount,
        });
      }, [allUsers]);

    function handleUnDelete(event) {
        setLoading(true)
        const userID = event.target.closest('tr').dataset.userId;
        // Retrieve user using userID and update isdeleted flag
        console.log(userID)
        reverseDeleteUser(userID)
        .then(response => {
            
            console.log(response);
            setUpdateUi((prevData)=>{
                return !prevData
            })
            setLoading(false)
        })
        .catch(error => {
            console.error(error);
        });
    }

    const submitDelete=(_id)=>{
        deleteUser(_id)
        .then(response => {
            setLoading(true)
            console.log(response);
            setUpdateUi((prevData)=>{
                return !prevData
            })
            setLoading(false)
        })
        .catch(error => {
            console.error(error);
        });
    
    return
    }

    const getCompanyData=async (_id)=>{
        try {
            const configId=""
            console.log(_id)
            const resp = await getKycCount(_id,configId)
            if (resp.success) {
                console.log(resp)
                return resp.kycCounts
            }
            else
                throw new Error(resp.error)
        } catch (error) {
            console.log(error.message)
            console.log('Failed to fetch Messages!')
        }
    }

    const submitEdit=(_id)=>{
        editApproval(_id)
            .then(response => {
                setLoading(true)
                console.log(response);
                setUpdateUi((prevData)=>{
                    return !prevData
                })
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });
        return
    }

    console.log(allUsers)

    return (
        <div style={{marginTop:'60px'}}>
        <section className = "main inner-main broadcast-sec">

            <section className = "contact-group-top">
                <Container fluid>

                    <Row>
                        <Col sm = {12} className = "mb-3">
                            <div className = "overview-heading">
                                Overview
                            </div>
                        </Col>

                        <Col sm = {12} className = "mb-3 d-md-none">
                            <div className = "overview-header bg-white rounded-pill">
                                <Row className = "align-items-center">
                                    <Col xs = {12}>
                                        {<ul className = "nav">
                                            {items.map((item,index)=> (
                                                <li key = {index} className = {active === index ? "active": "nav-item rounded-pill"} 
                                                onClick={() => handleClick(index)}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>}
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        <Col sm = {12} className = "mb-4 mb-lg-5">
                            <div className = "overview-header rounded-pill">
                                <Row className = "align-items-center">
                                    <Col md = "4">
                                        <div className = "date-side">
                                            <img src = {Calendar} alt = "calendar-icon"/> {date}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>

                    <Row className = "pb-3">
                        <Col md = "4" lg = {3} xl = {3}>
                            <div className = "message-send company-card" onClick={()=> setCvsShow(true)}>
                                <Broadcastcard title = {'Active Companies'} imageicon = {readmessage} number = {companiesInfo.active} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "4" lg = {3} xl = {3}>
                            <div className = "delivered-message company-card" onClick={()=> setCtShow(true)}>
                                <Broadcastcard title = {'KYC Count'} imageicon = {Send_message} number = {kycCounts.all} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "4" lg = {3} xl = {3} onClick={()=> setCvsShow1(true)}>
                            <div className = "pending company-card">
                                <Broadcastcard title = {'Pending Companies'} imageicon = {Pending} number = {companiesInfo.pending} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "4" lg = {3} xl = {3}>
                            <div className = "failed company-card" onClick={()=> setExpiredShow(true)}>
                                <Broadcastcard title = {'Deleted Companies'} imageicon = {Expired} number = {companiesInfo.expired} loading={loading}/>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </section>
            <section className = "contact-group-table">
                <Container fluid>
                    <Row className = "py-3">
                        <Col xs = {6} xl={12} style={{display:'flex',justifyContent:'space-between'}}>
                            <div className = "overview-heading">
                                Companies Listing
                            </div>
                            <Button onClick={()=>{navigate('/addcompany')}} variant="dark">Add company</Button>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs = {12}>
                            <Companytable data={allUsers} submitDelete={submitDelete} getCompanyData={getCompanyData} submitEdit={submitEdit} loading={loading}/>
                        </Col>
                    </Row>
                </Container>
            </section>

        </section>


            <Modal show={cvsshow} onHide={() => setCvsShow(false)} className = "whatsapp-modal modal-csv" centered>
                <Modal.Header className = "p-0" closeButton>
                    <Modal.Title>
                        Active Companies ({companiesInfo.active})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "pt-0">
                    <Row>
                        <Col sm = {12}>
                            <div className = "modal-table">
                                <div className = "table-responsive">
                                    <table className ="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.filter(users=>users.isapproved).map(users=>{
                                                return(
                                                    <tr>
                                                        <td>
                                                            {users.companyName}
                                                        </td>
                                                        <td>
                                                            {users.email}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <Modal show={cvsshow1} onHide={() => setCvsShow1(false)} className = "whatsapp-modal modal-csv" centered>
                <Modal.Header className = "p-0" closeButton>
                    <Modal.Title>
                        Pending Companies ({companiesInfo.pending})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "pt-0">
                    <Row>
                        <Col sm = {12}>
                            <div className = "modal-table">
                                <div className = "table-responsive">
                                    <table className ="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.filter(users=>!users.isapproved && !users.isdeleted).map(users=>{
                                                return(
                                                    <tr>
                                                        <td>
                                                            {users.companyName}
                                                        </td>
                                                        <td>
                                                            {users.email}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            
            <Modal show={expiredhow} onHide={() => setExpiredShow(false)} className = "whatsapp-modal modal-csv" centered>
                <Modal.Header className = "p-0" closeButton>
                    <Modal.Title>
                        Deleted Companies ({companiesInfo.expired})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "pt-0">
                    <Row>
                        <Col sm = {12}>
                            <div className = "modal-table company-listing-table">
                                <div className = "table-responsive">
                                    <table className ="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.filter(users=>users.isdeleted).map(users=>{
                                                return(
                                                    <tr key={users._id} data-user-id={users._id}>
                                                        <td>
                                                            {users.companyName}
                                                        </td>
                                                        <td>
                                                            {users.email}
                                                        </td>
                                                        <td>
                                                            <Form.Check
                                                                type="switch"
                                                                id={`custom-switch-${users._id}`}
                                                                onChange={handleUnDelete}
                                                                checked={!users.isdeleted}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <Modal show={ctshow} onHide={() => setCtShow(false)} className = "whatsapp-modal modal-csv" centered>
                <Modal.Header className = "p-0" closeButton>
                    <Modal.Title>
                        KYC Count ({kycCounts.all})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "pt-0">
                    <Row>
                        
                        <Col md = "6" lg = {6} xl = {6}>
                            <div className = "message-send company-card">
                                <Broadcastcard title = {'Total'} imageicon = {readmessage} number = {kycCounts.all} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "6" lg = {6} xl = {6}>
                        <div className = "delivered-message company-card">
                                <Broadcastcard title = {'Completed'} imageicon = {Send_message} number = {kycCounts.complete} loading={loading}/>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md = "6" lg = {6} xl = {6}>
                            <div className = "pending company-card">
                                <Broadcastcard title = {'Successful'} imageicon = {Pending} number = {kycCounts.success} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "6" lg = {6} xl = {6}>
                        <div className = "failed company-card">
                                <Broadcastcard title = {'Failed'} imageicon = {Expired} number = {kycCounts.failed} loading={loading}/>
                            </div>
                        </Col>
                        </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SuperAdmin;