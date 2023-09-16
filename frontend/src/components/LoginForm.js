import { useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function LoginForm() {
    const [value, setValue] = useState('yes');

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    return (
        <div>
            <TextField
                required
                id="outlined-required"
                label="Username"
            />
            <br /><br />
            <TextField
                required
                id="outlined-required"
                label="Password"
            />
            <br /><br />
            <div>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Admin</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </div>
            <br />
            <Button variant="contained">Login</Button>
            <br /><br />
        </div>
    )
}

export default LoginForm;