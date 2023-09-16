import { useState } from "react";
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";

function Login() {
    const [clicked, setClicked] = useState(true);

    const handleChange = (event) => {
        setClicked(event.target.checked);
    };

    return (
            <Paper elevation={3}>
                {clicked ? (
                <Chip label="Signup" variant="outlined" color="info" /> ):(
                <Chip label="Login" variant="outlined" color="info" />)}
                <Switch
                    clicked={clicked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                />
                <br/> <br/>
                {clicked ? <LoginForm /> : <SignupForm />}
            </Paper>    
        );
}

export default Login;