import { useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Link, useNavigate } from "react-router-dom"

function SignupForm() {
    const [username, setUserName] = useState('')
    const [passwd, setPasswd] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setAdmin] = useState('false')

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        console.log(username, passwd, email, isAdmin) 
        navigate("/login")
    }
 
    return (
        <>
        <form onSubmit={handleSubmit} to="login/">
            <TextField
                type="text"
                variant='outlined'
                color='primary'
                label="Username"
                onChange={e => setUserName(e.target.value)}
                value={username}
                fullWidth
                required
            />
            <br /><br />
            <TextField
                type="password"
                variant='outlined'
                color='primary'
                label="Password"
                onChange={e => setPasswd(e.target.value)}
                value={passwd}
                required
                fullWidth
                sx={{mb: 4}}
            />
            <br />
            <TextField
                type="email"
                variant='outlined'
                color='primary'
                label="Email"
                onChange={e => setEmail(e.target.value)}
                value={email}
                fullWidth
                required
                sx={{mb: 4}}
            />
            <br />
            <div>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Admin</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={isAdmin}
                        onChange={e => setAdmin(e.target.value)}
                    >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </div>
            <br />
            <Button variant="contained" color="primary" type="submit">Sign up</Button>
            <br /><br />
        </form>
        <small>Already have an account?<Link to="/login">Login</Link></small>
        </>
    )
}

export default SignupForm;