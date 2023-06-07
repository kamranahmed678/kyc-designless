
import React, { useState } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Wtable from './table1/table';


const UserTable = ({ data, loading,setKycToShow }) => {
  console.log(data)
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(5);

  const theadData = ["#","Email", "Created Date", "Status"];

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = data.filter(d => !d.isdeleted).slice(indexOfFirstCompany, indexOfLastCompany);

  const totalPages = Math.ceil(data.filter(d => !d.isdeleted).length / companiesPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () =>
    pageNumbers.map((number) => (
      <li className="nav-item" key={number}>
        <Button
          className={`table-btn ${currentPage === number ? 'active' : ''}`}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Button>
      </li>
    ));

    const convertDate=(dateStr)=>{
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      return formattedDate
  }
  
  const tbodyData = currentCompanies.map((d, index) => ({
    id: d._id,
    items: [
      index+1,
      d.userId.email,
      convertDate(d.createdAt),
      d.kycCompleted? d.kycStatus? "Successful":"Failed":"Incomplete",
    ],
  }));

  return (
    <>
      {!loading?<div className="cg-custom-table">
        <Wtable theadData={theadData} tbodyData={tbodyData} setKycToShow={setKycToShow}/>
      </div>:
      <></>
      }

      {data.length>0 && <Row className="py-3 py-md-4">
        <Col sm={12}>
          <ul className="nav justify-content-center align-items-center">
            <li className="nav-item">
              <Button
                className="table-btn"
                onClick={() =>
                  setCurrentPage(
                    (prevPage) => (prevPage === 1 ? prevPage : prevPage - 1)
                  )
                }
              >
                <i className="bi bi-chevron-left"></i>
              </Button>
            </li>
            {renderPageNumbers()}
            <li className="nav-item">
              <Button
                className="table-btn"
                onClick={() =>
                  setCurrentPage(
                    (prevPage) =>
                      prevPage === totalPages
                        ? prevPage
                        : prevPage + 1
                  )
                }
              >
                <i className="bi bi-chevron-right"></i>
              </Button>
            </li>
          </ul>
        </Col>
      </Row>}
    </>
  )
}

export default UserTable;