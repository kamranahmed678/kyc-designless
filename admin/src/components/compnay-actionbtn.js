
import React, { useState,useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "../css/companylisting.css";
import Closeic from "../images/icons/close-ic.svg"
import "./table/table.css"

const Companyactionbtn = ({data,submitDelete,getCompanyData,submitEdit}) => {

    const [dtshow, setDtShow] = useState(false);
    const [editshow, setEditShow] = useState(false);
    const [editing,setEditing]=useState(false)
    const [showStats,setShowStats]=useState(false)
    const [details,setDetails]=useState({all:0,complete:0,success:0,failed:0})

    function handleChange(){ 
        submitEdit(data._id);
        setTimeout(() => {
          setEditing(false);
        }, 700);
      }

    const handleDelete = async()=>{
        setDtShow(false)
        if(data.isapproved){
            submitEdit(data._id)
        }
        submitDelete(data._id)
    }

    useEffect(()=>{
        const fetchData = async () => {
           const res=await getCompanyData(data._id)
           setDetails(res)
           console.log(res)
        }

        if(showStats)
        {fetchData()}
    },[showStats])

    useEffect(() => {
        const handleClickOutside = (event) => {
          const formCheck = document.getElementById('custom-switch');
          if (formCheck && !formCheck.contains(event.target)) {
            setEditing(false);
          }
        };
      
        document.addEventListener('mousedown', handleClickOutside);
      
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    return (
       <>
            <div className = "d-flex align-items-center flex-row">
                {!editing && (<>
                <button className = "ded-btn" onClick={() => {setEditing(true)}}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.75 12.25H2.8L9.26875 5.78125L8.21875 4.73125L1.75 11.2V12.25ZM12.475 4.69375L9.2875 1.54375L10.3375 0.49375C10.625 0.20625 10.9783 0.0625 11.3973 0.0625C11.8158 0.0625 12.1687 0.20625 12.4562 0.49375L13.5062 1.54375C13.7937 1.83125 13.9437 2.17825 13.9562 2.58475C13.9688 2.99075 13.8313 3.3375 13.5438 3.625L12.475 4.69375ZM11.3875 5.8L3.4375 13.75H0.25V10.5625L8.2 2.6125L11.3875 5.8ZM8.74375 5.25625L8.21875 4.73125L9.26875 5.78125L8.74375 5.25625Z" fill="black" fillOpacity={'0.6'}/>
                    </svg>
                </button>
                <button className = "ded-btn" onClick={() => setDtShow(true)}>
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.25 13.75C1.8375 13.75 1.4845 13.6033 1.191 13.3097C0.897 13.0157 0.75 12.6625 0.75 12.25V2.5H0V1H3.75V0.25H8.25V1H12V2.5H11.25V12.25C11.25 12.6625 11.1033 13.0157 10.8097 13.3097C10.5157 13.6033 10.1625 13.75 9.75 13.75H2.25ZM9.75 2.5H2.25V12.25H9.75V2.5ZM3.75 10.75H5.25V4H3.75V10.75ZM6.75 10.75H8.25V4H6.75V10.75Z" fill="black" fillOpacity={'0.6'}/>
                    </svg>
                </button>
                <button className="ded-btn" onClick={() => setShowStats(true)}>
                    <svg width="13" height="15" viewBox="4 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z" fill="black" fillOpacity="0.6" />
                    </svg>
                </button>
                </>)}
                {
                    editing && (
                        <>
                            <Form.Check
                                className='switch'
                                type="switch"
                                id='custom-switch'
                                onChange={handleChange}
                                checked={data.isapproved}
                            />
                            <div className = "close-input" style={{marginLeft: '10px'}}>
                                <img src = {Closeic} alt = "close-icon" onClick={() => setEditing(false)} style={{cursor: 'pointer', width:'15px'}}/>
                            </div>
                        </>
                    )
                }
            </div>

            <Modal show={dtshow} onHide={() => setDtShow(false)} className = "whatsapp-modal confirm-modal modal-contact" centered>
                <Modal.Header className = "p-0">
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className = "text-content">
                        You are about to delete <span className = "u-name">"<b>{data.companyName}</b>"</span> from your list of active companies. This process cannot be reversed.
                    </div>
                </Modal.Body>
                <Modal.Footer className = "px-0">
                    <Button variant = "danger-light" onClick={() => handleDelete()}>
                        Yes, Delete it
                    </Button>
                    <Button  variant = "danger" onClick={() => setDtShow(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showStats} onHide={() => setShowStats(false)} className = "whatsapp-modal confirm-modal modal-contact" centered>
                <Modal.Header className = "p-0">
                    <Modal.Title>{data.companyName} details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><span style={{fontWeight:'bold'}}>Total: </span>{details.total}</p>
                    <p><span style={{fontWeight:'bold'}}>Attempted: </span>{details.attempted}</p>
                    <p><span style={{fontWeight:'bold'}}>Left: </span>{details.left}</p>
                    <p><span style={{fontWeight:'bold'}}>Completed: </span>{details.complete}</p>
                    <p><span style={{fontWeight:'bold'}}>Successful: </span>{details.success}</p>
                    <p><span style={{fontWeight:'bold'}}>Failed: </span>{details.failed}</p>
                </Modal.Body>
            </Modal>
            
       </>
    );
};

export default Companyactionbtn;