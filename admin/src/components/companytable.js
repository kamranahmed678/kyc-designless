
import React, { useState } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Wtable from './table/table';
import Companyactionbtn from './compnay-actionbtn';

const Companytable = ({ data, submitDelete,getCompanyData, submitEdit,loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(5);

  const theadData = ["Company Name", "Company Admin", "Email", "Status", "Actions"];

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

  const green=<span></span>
  const red=<span className='span1'></span>
  
  const tbodyData = currentCompanies.map((d, index) => ({
    id: index,
    items: [
      d.companyName,
      d.firstname + " " + d.lastname,
      d.email,
      d.isapproved ? <span><span className="dot active"></span>Active</span> : <span><span className="dot inactive"></span>Inactive</span>,
      <Companyactionbtn data={d} submitDelete={submitDelete} getCompanyData={getCompanyData} submitEdit={submitEdit} />
    ],
  }));

  return (
    <>
      {!loading?<div className="cg-custom-table">
        <Wtable theadData={theadData} tbodyData={tbodyData} />
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

export default Companytable;