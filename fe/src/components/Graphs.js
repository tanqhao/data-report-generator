
import * as React from 'react';

import axios from 'axios';
import ChartData from './Chart';
import TimeOptions from './TimeOptions';


import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import Fab from '@mui/material/Fab';
import TimeIcon from '@mui/icons-material/Timer';
import DateIcon from '@mui/icons-material/EventNote';


const Graphs = (props) => {
  const[showChart, setShowChart] = React.useState(false);
  const[chartData, setChartData] =  React.useState();
  const[date, setDate] = React.useState(null);
  const[time, setTime] = React.useState(null);
  const[slotID, setSlotID] = React.useState(null);

  const[dateStr, setDateStr] = React.useState(null);
  const[timeStr, setTimeStr] = React.useState(null);

  const[timeInterval, setTimeInterval] = React.useState({interval : 'seconds', value: 5});


  const [state, setState] = React.useState({
    left: false,
    top: false
  });


  const timeOptionHandler = (option) => {
    console.log('timeOptionHandler' , option );

    setState((prevState, props) => ({top: false, ...prevState.left}));
    setTimeInterval({interval:option.interval, value: option.value});
  }


  React.useEffect(() => {

     const getSlotData = () => {
       let parameters = {params: {'id' : slotID.id}};

       if(dateStr !== null)
         parameters.params.date = dateStr;

       if(timeStr !== null) {
          parameters.params.time = timeStr;
          let endTime = time;

          // end time ( to display 200 points on chart based on interval)
          if (timeInterval.interval === 'seconds')
            endTime.setSeconds(200 * timeInterval.value);
          else if (timeInterval.interval === 'minutes')
            endTime.setMinutes(200 * timeInterval.value);
          else if (timeInterval.interval === 'hours')
            endTime.setHours(24 * timeInterval.value);

          let endTimeStr = formatTime(endTime);
          parameters.params.endTime = endTimeStr;

          parameters.params.interval = timeInterval.interval;
          parameters.params.intervalValue = timeInterval.value;
        }

       console.log('param', parameters);
       axios.get(`http://localhost:${process.env.REACT_APP_PORT}/getSlotGraphData`,
       parameters).then(response => {

         let data = response.data;

         console.log(data);

         let dateLabel = dateStr;

         if(dateLabel === null)
         {
            dateLabel = data[0].Date;
            //setDate(dateLabel);
         }

         if(!data.length)
           dateLabel += '. \t No data found.'

         setChartData({
             labels: data.map(item => item.Time),
             datasets: [
               {
                 label: slotID.name + '  ' + dateLabel,
                 data: data.map(item => item.Value),
                 fill: true,
                 backgroundColor: "rgba(75,192,192,0.2)",
                 borderColor: "rgba(75,192,192,1)"
                 }
               ]
           });

           setShowChart(true);
       }).catch(error => {
               console.error('Error retrieving slot graph!', error);
       });
     }
     if(slotID)
     {
       getSlotData();
     }
  }, [slotID, dateStr, timeStr, timeInterval]);


  const toggleDrawer = (anchor, open) => (event) => {
    console.log('anchor', anchor);
     if (
       event.type === "keydown" &&
       (event.key === "Tab" || event.key === "Shift")
     ) {
       return;
     }
     setState({ ...state, [anchor]: open });
   };


  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join('-');
  }

  function formatTime(time) {
    return [
      padTo2Digits(time.getHours()),
      padTo2Digits(time.getMinutes()),
      padTo2Digits(time.getSeconds()),
    ].join(':');
  }

  const timeHandler = (time) => {
    try {
      time.toISOString();

      let timeStr = formatTime(time);
      setTime(time);
      setTimeStr(timeStr);

      }
     catch (e) {
       return;
     }
  }

   const dateHandler = (date) => {
     try {
       date.toISOString();

       let dateStr = formatDate(date);
       setDate(date);
       setDateStr(dateStr);

      } catch (e) {
        return;
      }
   }

   const slotList = (anchor) => (
     <Box
       sx={{ width: 250 }}
       role="presentation"
       onClick={toggleDrawer(anchor, false)}
       onKeyDown={toggleDrawer(anchor, false)}
     >
       <List>
         {props.slotsName.map((text, index) => (
           <ListItem key={text.name} disablePadding>
             <ListItemButton onClick={() => {
               setSlotID({id: text.id, name: text.name});
             }}>
               <ListItemIcon>
                <InboxIcon />

               </ListItemIcon>
               <ListItemText primary={text.name} />
             </ListItemButton>
           </ListItem>
         ))}
       </List>
       <Divider />
       <List>
       </List>
     </Box>
   );

   const timeOptionsList = (anchor) => (
     <Box
       sx={{ width: 'auto' }}
       role="presentation"
     >
       <TimeOptions onIntervalSelection={timeOptionHandler} intervalOptions={timeInterval}/>
     </Box>
   );

  return (
    <div>

      <div  style={{display: 'flex', 'justifyContent': 'space-around', 'padding': '1%'}}>
      <div style={{display: 'initial'}}>
      <Fab size="small" color="secondary" aria-label="time" onClick={toggleDrawer('top', true)}>
        <TimeIcon />
      </Fab>

      <Drawer
        anchor={'top'}
        open={state['top']}
        onClose={toggleDrawer('top', false)}
      >
        {timeOptionsList('top')}
      </Drawer>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="Time"
            value={time}
            ampm={false}
            openTo="hours"
            views={['hours', 'minutes', 'seconds']}
            inputFormat="HH:mm:ss"
            onChange={(newValue) => {
              timeHandler(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        </div>

        <Button onClick={toggleDrawer('left', true)}>Change Slot</Button>
        <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          {slotList('left')}
        </Drawer>

        <div style={{display: 'initial'}}>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
         <DatePicker
           label="Date"
           value={date}
           inputFormat="MM-dd-yyyy"
           onChange={(newValue) => {
             dateHandler(newValue);
           }}
           renderInput={(params) => <TextField {...params} />}
         />
       </LocalizationProvider>

       <Fab size="small" color="secondary" aria-label="date">
         <DateIcon />
       </Fab>
       </div>

      </div>

    {showChart ? (<ChartData data={chartData}/>) : null}

    </div>
  );
}

export default Graphs;
