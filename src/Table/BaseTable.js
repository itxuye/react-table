import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import BaseRow from "./BaseRow";
import { getChainObject } from "../utils";

class BaseTable extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    rowKey: PropTypes.string,
    top: PropTypes.number
  };
  static defaultProps = {
    style: {},
    dataSource: [],
    columns: []
  };
  get theadStyle() {
    const { top } = this.props;
    if (top) {
      return {
        transform: `translate3d(0px, ${top}px, 1px)`
      };
    }
    return {};
  }

  renderThead() {
    const { columns, top } = this.props;
    return (
      <thead className={top ? "fixed" : ""} style={this.theadStyle}>
        <tr>
          {columns.map((each, idx) => (
            <th className={each.className} key={idx}>
              {each.title}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderTbody() {
    const { columns, dataSource, rowKey, onRow } = this.props;
    return (
      <tbody>
        {dataSource.map((record, idx) => {
          let key = "";
          if (rowKey.includes(".")) {
            key = getChainObject(record, rowKey);
          } else {
            key = record[rowKey] + "";
          }
          return (
            <BaseRow
              key={key}
              record={record}
              rowIndex={idx}
              onRow={onRow}
              columns={columns}
            />
          );
        })}
      </tbody>
    );
  }

  render() {
    const { className, multiLine, style, getRef } = this.props;
    return (
      <table
        ref={getRef}
        className={classnames("fixed-table", className, {
          "table-multiLine": multiLine
        })}
        style={style}
      >
        {this.renderThead()}
        {this.renderTbody()}
      </table>
    );
  }
}

export default BaseTable;
