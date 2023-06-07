
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Pagination } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useState, useEffect,useContext } from 'react'

import readmessage from "../images/icons/read.svg";
import Pending from "../images/icons/pending.svg";
import Send_message from "../images/icons/send.svg";
import Expired from "../images/icons/expired.svg";
import Calendar from "../images/company/calendar.svg";

import Broadcastcard from "../components/broadcast-card" ;
import UserTable from "../components/usertable";

import UserContext from '../store/user-context'

import { getAccessKey,generateAccessKey, getAllCompanyKycs,getKycCount,getKycDetails, getWebsiteUrl, setWebsUrl,getRedirectUrl,setRdirectUrl,setWebhook,getWebhook,getConfig,createConfig } from "../services/companyadmin";


import "../css/companylisting.css";
import { toast } from "react-toastify";

const CompanyAdmin = () => {

    const [ctshow, setCtShow] = useState(false);
    const [cvshow, setCvShow] = useState(false);
    const [updateUi,setUpdateUi]=useState(false)
    const [allKyc,setAllKyc]=useState([])
    const [loading,setLoading]=useState(false)
    const [date,setDate]=useState(null)
    const [kycCounts,setKycCounts]=useState({all:0,complete:0,success:0,failed:0})
    const [kycId,setKycId]=useState(null)
    const [showKyc,setShowKyc]=useState(false)
    const [kycDetails,setKycDetails]=useState(null)
    const [accessKey, setAccessKey] = useState('');
    const [websiteUrl,setWebsiteUrl]=useState('')
    const [redirectUrl,setRedirectUrl]=useState('')
    const [webhookUrl,setWebhookUrl]=useState('')
    const [configurations,setConfigurations]=useState([])
    const [selectedConfig,setSelectedConfig]=useState('')
    const [selectedPage, setSelectedPage] = useState(0);
    const [filteredConfig,setFilteredConfig]=useState('')
    const [selectedIndex,setSelectedIndex]=useState(0)

    const { userState: { companyId }, setUserState } = useContext(UserContext)
    

    useEffect(()=>{
        if(!cvshow){
            if(configurations.length>0){
                setSelectedConfig(configurations[0])
            }
            setSelectedPage(0)
        }
    },[cvshow])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await getAllCompanyKycs(companyId,filteredConfig)
                setLoading(true)
                if (resp.success) {
                    setAllKyc(resp.allKyc)
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
    }, [filteredConfig])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const resp = await getConfig(companyId)
                console.log(resp)
                if(resp.success){
                    setConfigurations(resp.configurations)
                    setSelectedConfig(resp.configurations[0])
                }
            } catch (error) {
                console.log(error.message)
                console.log('Failed to fetch configurations!')
            }
        }

        
        fetchData()
    },[cvshow])

    console.log("configs",configurations)

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const resp = await getAccessKey(selectedConfig)
                console.log(resp)
                if(resp.success){
                    setAccessKey(resp.accessKey)
                }
            } catch (error) {
                console.log(error.message)
                console.log('Failed to fetch Key!')
            }
        }

        if(selectedConfig.length>0)
            fetchData()
    },[selectedConfig])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const resp = await getWebsiteUrl(selectedConfig)
                console.log(resp)
                if(resp.success){
                    setWebsiteUrl(resp.websiteUrl)
                }
                else{
                    setWebsiteUrl('')
                }
            } catch (error) {
                console.log(error.message)
                console.log('Failed to fetch Url!')
            }
        }

        if(selectedConfig.length>0)
            fetchData()
    },[selectedConfig])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const resp = await getRedirectUrl(selectedConfig)
                console.log(resp)
                if(resp.success){
                    setRedirectUrl(resp.redirectUrl)
                }
                else{
                    setRedirectUrl('')
                }
            } catch (error) {
                console.log(error.message)
                console.log('Failed to fetch Url!')
            }
        }

        if(selectedConfig.length>0)
            fetchData()
    },[selectedConfig])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const resp = await getWebhook(selectedConfig)
                console.log(resp)
                if(resp.success){
                    setWebhookUrl(resp.webhookUrl)
                }
                else{
                    setWebhookUrl('')
                }
            } catch (error) {
                console.log(error.message)
                console.log('Failed to fetch Url!')
            }
        }

        if(selectedConfig.length>0)
            fetchData()
    },[selectedConfig])


    const genKey =async ()=>{
        try{
            const resp=await generateAccessKey({_id:selectedConfig})
            if (resp.success){
                setAccessKey(resp.accessKey)
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const setUrl =async ()=>{
        try{
            if(websiteUrl.length>0){
                const resp=await setWebsUrl({_id:selectedConfig,websiteUrl:websiteUrl})
                if (resp.success)
                    toast.success("Website Url set")
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const setReUrl =async ()=>{
        try{
            if(redirectUrl.length>0){
                const resp=await setRdirectUrl({_id:selectedConfig,redirectUrl:redirectUrl})
                if (resp.success)
                    toast.success("Redirect Url set")
            }
        }
        catch(e){
            console.log(e)
        }
    }
    const setWebUrl =async ()=>{
        try{
            if(webhookUrl.length>0){
                const resp=await setWebhook({_id:selectedConfig,webhookUrl:webhookUrl})
                if (resp.success)
                    toast.success("webhook Url set")
            }
        }
        catch(e){
            console.log(e)
        }
    }


    useEffect(()=>{
        const fetchData = async () => {
            try {
                const resp = await getKycCount(companyId,filteredConfig)
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
    },[filteredConfig])

    const setKycToShow=async (id)=>{
        setKycId(id)
        setShowKyc(true)
        try{
            const resp=await getKycDetails(id)
            console.log(resp)
            setKycDetails(resp)
        }
        catch(e)
        {
            console.log(e)
        }
    }

    console.log(allKyc)
    console.log(kycId)


    useEffect(()=>{
        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
        const year = today.getFullYear().toString();
        const formattedDate = `${day}/${month}/${year}`;
        setDate(formattedDate)
    },[])

    const handlePageClick = (page) => {
        setSelectedPage(page - 1);
        setSelectedConfig(configurations[page-1])
      };
    
      const handlePrevClick = () => {
        setSelectedPage((prevPage) => Math.max(prevPage - 1, 0));
        setSelectedConfig(configurations[selectedPage-1])
      };
    
      const handleNextClick = async () => {
        if (selectedPage < configurations.length - 1) {
          setSelectedPage((prevPage) => prevPage + 1);
          setSelectedConfig(configurations[selectedPage+1])
        }
        else{
            try{
                const resp=await createConfig({_id:companyId})
                if(resp.success){
                    setConfigurations(resp.configurations)
                    setSelectedPage((prevPage) => prevPage + 1);
                    setSelectedConfig(resp.configurations[selectedPage+1])
                }
                else{
                    toast.error(resp.message)
                }
            }
            catch(e){
                toast.error(e)
            }
        }
      };

      console.log(selectedIndex)

    return (
        <div style={{marginTop:'60px'}}>
            
        <section className = "main inner-main broadcast-sec">

            <section className = "contact-group-top">
                <Container fluid>

                    <Row>
                        <Col sm = {12} lg={2} className = "mb-4 mb-lg-5">
                            <DropdownButton id="dropdown-basic-button" variant='secondary' title={`Filter Results: ${selectedIndex>0? "Configuration "+selectedIndex:"All"}`}>
                                <Dropdown.Item onClick={()=>{setFilteredConfig('')
                            setSelectedIndex(0)}}>All</Dropdown.Item>
                                {configurations.map((config,index)=>{
                                    return(
                                        <Dropdown.Item onClick={()=>{setFilteredConfig(config)
                                        setSelectedIndex(index+1)}}>Configuration {index+1}</Dropdown.Item>
                                    )
                                })}
                            </DropdownButton>
                        </Col>
                    </Row>

                    <Row className = "pb-3">
                        <Col md = "4" lg = {4} xl = {4}>
                            <div className = "message-send company-card">
                                <Broadcastcard title = {`KYC Limit ${selectedIndex>0 ? "(All)": ""}`} imageicon = {readmessage} number = {kycCounts.total} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "4" lg = {4} xl = {4}>
                            <div className = "delivered-message company-card" onClick={()=> setCtShow(true)}>
                                <Broadcastcard title = {'KYC Attempted'} imageicon = {Send_message} number = {kycCounts.attempted} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "4" lg = {4} xl = {4}>
                            <div className = "pending company-card">
                                <Broadcastcard title = {`KYC Left ${selectedIndex>0 ? "(All)": ""}`} imageicon = {Pending} number = {kycCounts.left} loading={loading}/>
                            </div>
                        </Col>
                        
                    </Row>

                </Container>
            </section>
            <section className = "contact-group-table">
                <Container fluid>
                    <Row className = "py-3 align-items-left">
                        <Col xs = {12} xl={12}>
                            <div className = "overview-heading" style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                Kyc List
                                <Button onClick={()=>{setCvShow(true)}} variant="dark">Configure KYC</Button>

                            </div>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs = {12}>
                            <UserTable data={allKyc} loading={loading} setKycToShow={setKycToShow}/>
                        </Col>
                    </Row>
                </Container>
            </section>

        </section>


            <Modal show={showKyc} onHide={() => setShowKyc(false)} className = "whatsapp-modal viewkyc" centered>
                <Modal.Header className = "p-0" closeButton>
                    <Modal.Title >
                        KYC Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "pt-0">
                    {kycDetails && <Row>
                        <Col sm = {12}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between',marginBottom:'20px' }}>
                                {kycDetails.documentId ? (
                                    <img style={{ width: '50%', marginRight: '10px', marginBottom: '10px' }} src={kycDetails.documentId.fileData} alt="Document" />
                                ) : (
                                    <span>No document photo of user</span>
                                )}
                                {kycDetails.selfieId ? (
                                    <img style={{ width: '50%', marginLeft: '10px', marginBottom: '10px' }} src={kycDetails.selfieId.fileData} alt="Selfie" />
                                ) : (
                                    <span>No selfie of user</span>
                                )}
                            </div>
                            <div>
                                <h5>Kyc Info:</h5>
                                <p style={{marginLeft:'10px'}}><span style={{fontWeight:'bold',marginRight:'5px'}}>Email:</span>{kycDetails.userId.email}</p>
                                {kycDetails.country && <p style={{marginLeft:'10px'}}><span style={{fontWeight:'bold',marginRight:'5px'}}>Country:</span>{kycDetails.country}</p>}
                                {kycDetails.documentType && <p style={{marginLeft:'10px'}}><span style={{fontWeight:'bold',marginRight:'5px'}}>Document Type:</span>{kycDetails.documentType}</p>}
                                {kycDetails.createdAt && <p style={{marginLeft:'10px'}}><span style={{fontWeight:'bold',marginRight:'5px'}}>KYC Date:</span>{kycDetails.createdAt.slice(0,10)}</p>}
                                {<p style={{marginLeft:'10px'}}><span style={{fontWeight:'bold',marginRight:'5px'}}>KYC Status:</span>{kycDetails.kycCompleted? kycDetails.kycStatus? "Successful":"Failed":"Incomplete"}</p>}
                                {kycDetails.kycMessage && <p style={{marginLeft:'10px'}}><span style={{fontWeight:'bold',marginRight:'5px'}}>KYC Comments:</span>{kycDetails.kycMessage}</p>}

                                
                            </div>
                        </Col>
                    </Row>}
                </Modal.Body>
            </Modal>


            <Modal show={ctshow} onHide={() => setCtShow(false)} className = "whatsapp-modal modal-csv" centered>
                <Modal.Header className = "p-0" closeButton>
                    <Modal.Title>
                        Attempted KYC ({kycCounts.attempted})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "pt-0">
                    <Row>
                        <Col md = "6" lg = {6} xl = {6}>
                        <div className = "delivered-message company-card">
                                <Broadcastcard title = {'Completed'} imageicon = {Send_message} number = {kycCounts.complete} loading={loading}/>
                            </div>
                        </Col>
                        <Col md = "6" lg = {6} xl = {6}>
                        <div className = "pending company-card">
                                <Broadcastcard title = {'Incomplete'} imageicon = {Pending} number = {kycCounts.attempted-kycCounts.complete} loading={loading}/>
                            </div>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md = "6" lg = {6} xl = {6}>
                            <div className = "message-send company-card">
                                <Broadcastcard title = {'Successful'} imageicon = {readmessage} number = {kycCounts.success} loading={loading}/>
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

            <Modal show={cvshow} onHide={() => setCvShow(false)} className = "whatsapp-modal modal-csv" centered>
                <Modal.Header className = "p-0" closeButton>
                    <Modal.Title>
                        Configure KYC
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "pt-0">
                    <h4 style={{marginTop:'10px'}}>Configuration {selectedPage+1}</h4>
                    <Row style={{marginTop:'20px'}}>
                        <Col sm = {12}>
                        <h6>Access Key</h6>
                        <Form className="d-flex">
                            <Form.Control
                            type="text"
                            value={accessKey}
                            disabled
                            style={{ backgroundColor: '#E8EFEF', color: '#495057', cursor: 'not-allowed', width: '50%', textAlign: 'center'}}
                            />
                            <Button variant="dark" style={{ marginLeft: '10px', height: '40px', display: 'flex', alignItems: 'center' }} onClick={genKey} >{accessKey.length>0?"Regenerate key":"Generate Key"}</Button>
                        </Form>
                        </Col>
                    </Row>
                    <Row style={{marginTop:'20px'}}>
                        <Col sm = {12}>
                        <h6>Add Website URL</h6>
                        <Form className="d-flex">
                            <Form.Control
                            type="text"
                            value={websiteUrl}
                            onChange={(e)=>{setWebsiteUrl(e.target.value)}}
                            placeholder="https://www.google.com/"
                            style={{ backgroundColor: '#E8EFEF', color: '#495057', width: '50%', textAlign: 'center'}}
                            />
                            <Button variant="dark" style={{ marginLeft: '10px', height: '40px', display: 'flex', alignItems: 'center' }} onClick={setUrl}>Set URL</Button>
                        </Form>
                        </Col>
                    </Row>
                    <Row style={{marginTop:'20px'}}>
                        <Col sm = {12}>
                        <h6>Add Redirect URL</h6>
                        <Form className="d-flex">
                            <Form.Control
                            type="text"
                            value={redirectUrl}
                            onChange={(e)=>{setRedirectUrl(e.target.value)}}
                            placeholder="https://www.google.com/"
                            style={{ backgroundColor: '#E8EFEF', color: '#495057', width: '50%', textAlign: 'center'}}
                            />
                            <Button variant="dark" style={{ marginLeft: '10px', height: '40px', display: 'flex', alignItems: 'center' }} onClick={setReUrl}>Set URL</Button>
                        </Form>
                        </Col>
                    </Row>
                    <Row style={{marginTop:'20px'}}>
                        <Col sm = {12}>
                        <h6>Add Webhook URL</h6>
                        <Form className="d-flex">
                            <Form.Control
                            type="text"
                            value={webhookUrl}
                            onChange={(e)=>{setWebhookUrl(e.target.value)}}
                            placeholder="https://www.google.com/"
                            style={{ backgroundColor: '#E8EFEF', color: '#495057', width: '50%', textAlign: 'center'}}
                            />
                            <Button variant="dark" style={{ marginLeft: '10px', height: '40px', display: 'flex', alignItems: 'center' }} onClick={setWebUrl}>Set URL</Button>
                        </Form>
                        </Col>
                    </Row>
                    <Row style={{marginTop:'40px'}}>
                        <Col className="d-flex justify-content-center">
                            <Pagination>
                                <Pagination.Prev onClick={handlePrevClick} disabled={selectedPage === 0} />
                                {configurations.map((_, index) => (
                                    <Pagination.Item
                                    key={index}
                                    active={index === selectedPage}
                                    onClick={() => handlePageClick(index + 1)}
                                    >
                                    {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={handleNextClick} />
                            </Pagination>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CompanyAdmin;