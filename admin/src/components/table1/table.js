import React from "react";
import TableRow from "./tableRow";
import TableHeadItem from "./tableHead";
import Table from "react-bootstrap/Table"

const Wtable = ({ theadData, tbodyData, customClass,setKycToShow }) => {
    return (
        <Table className={customClass} responsive>
            <thead>
                <tr>
                    {theadData.map((h,i) => {
                        return <TableHeadItem key={i} item={h} />;
                    })}
                </tr>
            </thead>
            <tbody>
                {tbodyData.map((item) => {
                    return <TableRow id= {item.id} data={item.items} setKycToShow={setKycToShow}/>;
                })}
            </tbody>
        </Table>
    );
};

export default Wtable;