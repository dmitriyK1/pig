import React, { Component } from "react";
import pigData from "./wild-pig-data.json";
import { Chart } from './components/Chart';

// TODO move to dataMapper
const dataKey = 'PIG POPULATIONS';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Chart data={pigData[dataKey]}/>
        {/*<table>*/}
        {/*  <tbody>*/}
        {/*    <tr>*/}
        {/*      <th>Year</th>*/}
        {/*      <th>Island</th>*/}
        {/*      <th>Population</th>*/}
        {/*    </tr>*/}
        {/*{pigData["PIG POPULATIONS"].map((datum, index) => (*/}
        {/*  <tr key={index}>*/}
        {/*    <td>{datum.year}</td>*/}
        {/*    <td>{datum.island}</td>*/}
        {/*    <td>{datum.pigPopulation}</td>*/}
        {/*  </tr>*/}
        {/*))}*/}
        {/*</tbody>*/}
        {/*</table>*/}
      </div>
    );
  }
}

export default App;
