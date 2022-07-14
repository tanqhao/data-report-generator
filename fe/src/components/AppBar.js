
import './AppBar.css';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';




const ButtonAppBar = (props) => {

  const pageSelected = (page) => {
  console.log('page',page);
  props.onPageSelected(page);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar  position="relative">
        <Toolbar className='appBar'>
{/*
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
           <MenuIcon />
          </IconButton>
*/}
          <Button style={{fontSize: '20px'}} color="inherit" onClick={ () => pageSelected('slots')}>Slots Data</Button>
          <Button style={{fontSize: '20px'}} color="inherit" onClick={ () => pageSelected('graphs')}>Graphs</Button>
          <Button style={{fontSize: '20px'}} color="inherit" onClick={ () => pageSelected('downloads')}>Downloads Progress</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
