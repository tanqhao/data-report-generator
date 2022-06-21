import logo from './logo.svg';
import './App.css';
import * as React from "react";

import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

import myGif from './assets/pokemon-slapping.gif';

const columns = [
  { field: 'id', headerName: 'Slot' },
  { field: 'name', headerName: 'Description', width: 400 },
  { field: 'timeline', headerName: 'Time Period', width: 450},

];

const buttonHandler = (event) => {
console.log(selectedIDs);
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
