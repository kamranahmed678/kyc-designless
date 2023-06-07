
import React from "react";

const TableRow = ({ id,data,setKycToShow }) => {
    return (
        <tr className="tbl-row" onClick={()=>{setKycToShow(id)}}>
            {data.map((item) => {
                return <td>{item}</td>;
            })}
        </tr>
    );
};

export default TableRow;