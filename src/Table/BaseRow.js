import React from "react";
import { getChainObject } from "../utils";
import classnames from "classnames";

export default class TableRow extends React.PureComponent {
  render() {
    const { record, onRow, columns, rowIndex } = this.props;
    const height = this.context[rowIndex];
    const trProp = {
      style: {}
    };
    if (onRow) {
      const onRowProp = onRow(record) || {};
      Object.assign(trProp, onRowProp);
    }
    trProp.style = {
      height,
      ...trProp.style
    };
    return (
      <tr {...trProp}>
        {columns.map((column, columnIdx) => {
          let value = null;
          const { dataIndex, render, key } = column;
          if (dataIndex) {
            if (dataIndex.includes(".")) {
              value = getChainObject(record, dataIndex);
            } else {
              value = record[dataIndex];
            }
          }
          if (render) {
            value = render(value, record, rowIndex);
          }
          return (
            <td
              style={{ textAlign: column.align }}
              className={classnames(column.className, { fixed: column.fixed })}
              key={key || dataIndex || columnIdx.toString()}
            >
              {value}
            </td>
          );
        })}
      </tr>
    );
  }
}
