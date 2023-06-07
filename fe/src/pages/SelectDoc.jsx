// PrivatePage.js
import React, { useContext,useState, useEffect } from 'react';
import  UserContext  from '../store/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import {getCountries} from '../services/global'
import { Button } from 'react-bootstrap';
import { selectDocumentType } from '../services/user';

const SelectDoc = () => {
  const { userState:{email}, setUserState } = useContext(UserContext)
  const navigate=useNavigate()
  const [countries,setCountries]=useState([])
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleChange = (event) => {
    setSelectedRegion(event.target.value);
  }

  const submit=async()=>{
    try{
      if(selectedRegion.length>0 && selectedType.length>0){
        const resp=await selectDocumentType({email:email,selectedType:selectedType,selectedRegion:selectedRegion})
        if(resp.success){
          console.log(resp)
          navigate('/uploaddoc')
        }
        else{
          console.log(resp)
        }
      }
      
    }
    catch(e){
      console.log(e)
    }
  }
  

  useEffect(()=>{
    const getCountry=async()=>{
      const resp=await getCountries()
      if (resp.status==200){
        setCountries(resp.data)
      }
    }
    getCountry()
  },[])

  return (
    <div>
      <h1>Document type selection page</h1>

    <div style={{marginTop:'20px'}}>
      <label htmlFor="regionSelect">Select Region:</label>
      <select id="regionSelect" value={selectedRegion} onChange={handleChange}>
        <option value="">Select an option</option>
        {countries.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p>Selected Region: {selectedRegion}</p>
    </div>

    <div style={{marginTop:'20px',justifyContent:'space-between'}}>
      <Button variant='secondary' onClick={() => setSelectedType('ID')}>ID</Button>
      <Button variant='secondary' onClick={() => setSelectedType('Passport')}>Passport</Button>
      <p>Selected Type: {selectedType}</p>
    </div>
    
    <Button variant='dark' onClick={submit}>Continue</Button>
    
    </div>
  );
};

export default SelectDoc;