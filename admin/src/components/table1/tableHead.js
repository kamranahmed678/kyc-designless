
import React from "react";

const TableHeadItem = ({ item }) => {
    return (
        <th title={item}>
            {item}
        </th>
    );
};

export default TableHeadItem;