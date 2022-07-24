import * as React from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'Slot' },
  { field: 'name', headerName: 'Description', width: 400 },
  { field: 'timeline', headerName: 'Time Period', width: 600},

];

let selectedIDs;

const buttonHandler = (event) => {
  console.log('selectedID', selectedIDs);
   axios.post(`http://localhost:${process.env.REACT_APP_PORT}/downloadSlots`, selectedIDs)
       .then(response => console.log(response))
       .catch(error => {
           console.error('Error downloading slots csv data!', error);
       });
}

const Slots = (props) => {
  const [selectionModel, setSelectionModel] = React.useState([]);

  // on first load
  // React.useEffect(() => {
  //   axios.get('http://localhost:8080')
  //       .then(response => {
  //         setRows(response.data)
  //         setDataReady(true);
  //       })
  //       .catch(error => {
  //           console.error('Error retrieving slots!', error);
  //       });
  // }, []);



  return (
    <div  style={{ height: '650px'}}>
      <DataGrid
          rows={props.slotsName}
          columns={columns}
          checkboxSelection
          pageSize={9}
          rowsPerPageOptions={[9]}
          hideFooterPagination
          onSelectionModelChange={(selected) => {
             setSelectionModel(selected);
             selectedIDs = selected;
           }
         }
        />
        <div style={{padding: '10px'}}>
          <Button variant="contained" onClick={() => buttonHandler(selectionModel)}>
          Download Slots Data
          </Button>
        </div>
    </div>
  );
}

export default Slots;
