
import './App.css';
import * as React from "react";

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress'

import ButtonAppBar from './components/AppBar';
import Slots from './components/Slots';
import Graphs from './components/Graphs';

import myGif from './assets/pokemon-slapping.gif';
import logo from './assets/DEOS-Logo-CMYK.png';

import axios from 'axios';

function App() {
  const[showSlots, setShowSlots] = React.useState(true);
  const[slotsName, setSlotsName] = React.useState();
  const[slotsNameGot, setSlotsNameGot] = React.useState(false);

  const appBarButtonHandler = (selectedPage) => {
    (selectedPage === 'slots') ? setShowSlots(true) : setShowSlots(false);
  }

  React.useEffect(() => {
    axios.get(`http://localhost:${process.env.REACT_APP_PORT}`)
        .then(response => {
          setSlotsName(response.data)
          setSlotsNameGot(true);
        })
        .catch(error => {
            console.error('Error retrieving slots!', error);
        });
  }, []);

  return (

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{ height: '60%', width: '75%', background: 'white' }}>

        <ButtonAppBar onPageSelected={appBarButtonHandler}/>

        {showSlots ?
          ( slotsNameGot ?
            (<Slots slotsName={slotsName} />) : (<CircularProgress />)
          )
          : (<Graphs slotsName={slotsName} />)}

        </div>
      </header>

    </div>
  );
}

export default App;
