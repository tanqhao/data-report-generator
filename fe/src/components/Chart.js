

import * as React from 'react';
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'


  let option = {
      responsive: true,
      plugins: {
       decimation: {enabled: true}
       //legend: {
       //       position: 'top',
       //     },
     }
  }



const ChartData = (props) => {
  return (
    <div>
    <Line options={option} data={props.data}/>
    </div>
  );
}

export default ChartData;
