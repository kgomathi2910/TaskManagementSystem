import React, { useEffect, useState } from 'react';
import AdminSideNav from './AdminSideNav';
import {
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    Button,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Box,
    Paper
} from '@mui/material';

function AdminTasks() {
    const [taskData, setTaskData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const sty = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        const getTaskData = async () => {
            const reqData = await fetch('http://localhost:8081/getTasks');
            const resData = await reqData.json();
            console.log("ResData: ", resData);
            setTaskData(resData.tasks);
            console.log("TaskData: ", taskData);
        };
        getTaskData();
    }, []);

    useEffect(() => {
        console.log("TaskData has changed:", taskData);
    }, [taskData]);

    const handleEditTask = () => {
        // Implement the logic to edit the task here
    };

    return (
        <React.Fragment>
            <AdminSideNav />
            <Box sx={sty}>
                <Typography variant="h5">
                    Tasks
                </Typography>
                <Paper style={{ width: '100%' }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Deadline</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Tag</TableCell>
                                <TableCell>Do changes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(taskData) && taskData.length > 0 ? (
                                taskData.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>{task.deadline}</TableCell>
                                        <TableCell>{task.status}</TableCell>
                                        <TableCell>{task.assigned_by}</TableCell>
                                        <TableCell>{task.tag}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleEditTask}
                                            >
                                                Save Changes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))) : (
                                <TableRow>
                                    <TableCell>No tasks found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    style={{ marginTop: '16px' }}
                >
                    Add Task
                </Button>
            </Box>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={style}>
                    <div>
                        <Typography variant="h6">Add Task</Typography>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <TextField
                            label="Deadline"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <Typography>Status</Typography>
                            <Select label="Status">
                                <MenuItem value="Assigned">Assigned</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Tag"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCloseModal}
                            style={{ marginTop: '16px' }}
                        >
                            Add Task
                        </Button>
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default AdminTasks;
