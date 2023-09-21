import { useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { Link, useNavigate } from "react-router-dom"
import Typography from '@mui/material/Typography';


function LoginForm() {
    const [username, setUserName] = useState('')
    const [passwd, setPasswd] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setAdmin] = useState('false')

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(username, passwd, email, isAdmin);

        const response = await fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, passwd, email, isAdmin }),
        });

        const data = await response.json();

        if (data.success) {
            console.log('Login successful');
            console.log("Admin or not", isAdmin)
            if (isAdmin == 1) {
                console.log("Navigating to admin")
                const adminId = data.idUser;
                console.log("Admin id (from login form)", adminId)
                navigate(`/admin/${adminId}`)
            }
            else {
                console.log("Navigating to user")
                const id = data.idUser;
                console.log("User id (from login form)", id);
                navigate(`/user/${id}`)
            }
        } else {
            console.error('Login failed:', data.message);
        }
    }

    return (
        <>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                TASK MANAGEMENT SYSTEM
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Login
            </Typography>
            <br />
            <form onSubmit={handleSubmit}>
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
                    sx={{ mb: 4 }}
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
                    sx={{ mb: 4 }}
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
                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                            <FormControlLabel value="0" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <br />
                <Button variant="contained" color="primary" type="submit">Login</Button>
                <br /><br />
            </form>
            <small>Need to create an account?<Link to="/signup">Sign up here</Link></small>
        </>
    )
}

export default LoginForm;