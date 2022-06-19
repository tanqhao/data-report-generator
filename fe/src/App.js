import logo from './logo.svg';
import './App.css';
import * as React from "react";
import Button from '@mui/material/Button';

import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';



const columns = [
  { field: 'id', headerName: 'Slot' },
  { field: 'name', headerName: 'Description', width: 400 },
  { field: 'timeline', headerName: 'Time Period', width: 400},

];

// const rows = [
//   { id: 1, description: 'RA Temp' },
//   { id: 2, description: 'RA Humid'},
//   { id: 3, description: 'RA CO2' },
//   { id: 4, description: 'Temperature'},
//   { id: 5, description: 'Humidity'},
//   { id: 6, description: 'PM 2.5'},
//   { id: 7, description: 'VOC'},
//   { id: 8, description: 'CO2'},
//   { id: 9, description: 'Test'},
// ];



const buttonHandler = (event) => {
console.log(selectedIDs);

console.log(`http://localhost:8080/downloadSlots`);
   axios.post(`http://localhost:8080/downloadSlots`, selectedIDs)
       .then(response => console.log(response))
       .catch(error => {
           console.error('There was an error!', error);
       });
}

let selectedIDs;

function App() {
   const [selectionModel, setSelectionModel] = React.useState([]);
   const [rows, setRows] = React.useState([]);

   // on first load
   React.useEffect(() => {
     axios.get('http://localhost:8080')
         .then(response => {
           setRows(response.data)
         })
         .catch(error => {
             console.error('There was an error!', error);
         });
   }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div style={{ height: 580, width: '40%', background: 'white' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            pageSize={9}
            rowsPerPageOptions={[9]}
            hideFooterPagination
            onSelectionModelChange={(selected) => {
              console.log(selected);
               setSelectionModel(selected);
               selectedIDs = selected;
             }
           }

          />
        </div>

        <div>
          <Button variant="contained" onClick={() => buttonHandler(selectionModel)}>
          Download Slots
          </Button>
        </div>

      </header>
    </div>
  );
}

export default App;
