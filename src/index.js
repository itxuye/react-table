import React from "react";
import ReactDOM from "react-dom";
import { Table } from "./Table";
import { mock } from "mockjs";
import "./styles.css";

function App() {
  return (
    <div className="App">
      {(() => {
        const fieldKey = [];
        const fieldCount = 10;
        let i = 0;
        for (; i < fieldCount; i++) {
          fieldKey.push("field" + i);
        }
        const columns = fieldKey.map((each, idx) => ({
          title: each,
          dataIndex: each,
          fixed: idx === 0 ? "left" : idx === fieldCount - 1 ? "right" : false
        }));
        const mockJson = fieldKey.reduce((json, each) => {
          json[each] = "@sentence(2,3)";
          return json;
        }, {});

        const mockData = mock({
          "list|50": [mockJson]
        });
        const dataSource = mock(mockData).list;
        console.log(columns, dataSource);
        return (
          <Table columns={columns} dataSource={dataSource} rowKey="field1" />
        );
      })()}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
