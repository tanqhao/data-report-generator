import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 5,
    label: '5s',
  },
  {
    value: 15,
    label: '15s',
  },
  {
    value: 30,
    label: '30s',
  },
  {
    value: 45,
    label: '45s',
  },
  {
    value: 60,
    label: '60s',
  },
];



function setMarksLabel(text) {
  for(let mark of marks) {
    mark.label = mark.label.slice(0, -1) + text;
  }
}

const TimeOptions = (props) => {
  const[radioValue, setRadioValue] = React.useState('seconds');
  const[sliderValue, setSliderValue] = React.useState(5);
  const[stepValue, setStepValue] = React.useState({min: 5, max: 60, step: 5});

  const handleRadioChange = (selection) => {
    setRadioValue(selection.target.value)

    switch (selection.target.value) {
      case 'seconds': setMarksLabel('s');
                      setStepValue({min: 5, max: 60, step: 5});
      break;
      case 'minutes': setMarksLabel('m');
                      setStepValue({min: 5, max: 60, step: 5});
      break;
      case 'hours': setMarksLabel('h');
                    setStepValue({min: 1, max: 24, step: 1});
      break;
    }
  }

  const handleSliderChangeCommit = (event, value) => {
    props.onIntervalSelection({interval: radioValue, value: value});
  }

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  }

  React.useEffect(() => {
    setRadioValue(props.intervalOptions.interval);
    setSliderValue(props.intervalOptions.value);
  }, [props.intervalOptions.interval, props.intervalOptions.value]);

  return (
    <div style={{display: 'flex', padding: '35px'}}>
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Time Interval</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue="seconds"
        onChange={handleRadioChange}
        value={radioValue}
      >
        <FormControlLabel value="seconds" control={<Radio />} label="Seconds" />
        <FormControlLabel value="minutes" control={<Radio />} label="Mintues" />
        <FormControlLabel value="hours" control={<Radio />} label="Hours" />

      </RadioGroup>

      <Slider
         aria-label="Always visible"
         min={stepValue.min}
         step={stepValue.step}
         max={stepValue.max}
         marks={marks}
         value={sliderValue}
         onChange={handleSliderChange}
         onChangeCommitted={handleSliderChangeCommit}
         valueLabelDisplay="auto"
       />
    </FormControl>
    </div>
  );
}

export default TimeOptions;
