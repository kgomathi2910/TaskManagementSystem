import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import AdminSideNav from './AdminSideNav';
import { useNavigate } from "react-router-dom"
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { id } = useParams();
    console.log("Admin ID from admin tasks", id)
    const [statusValue, setStatusValue] = useState('');
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEditOpenModal = () => {
        setIsEditModalOpen(true);
    };

    const handleEditCloseModal = () => {
        setIsEditModalOpen(false);
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
        width: 900,
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



    const addTaskHandler = async () => {
        try {
            const title = document.getElementById("titleInput").value;
            const description = document.getElementById("descInput").value;
            const deadline = document.getElementById("deadlineInput").value;
            // const status = document.getElementById("statusInput").value;
            const status = statusValue;
            const tag = document.getElementById("tagInput").value;
            const assignTo = document.getElementById("assignedToInput").value;

            if (id === undefined) {
                console.error("adminId is undefined");
                return;
            }

            const assignBy = id;

            console.log("Status: ", status)

            const newTask = {
                title,
                description,
                status,
                deadline,
                assignBy,
                assignTo,
                tag
            };
            console.log("new task", newTask);

            const response = await fetch("http://localhost:8081/addTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                handleCloseModal();
                document.getElementById("titleInput").value = "";
                document.getElementById("descInput").value = "";
                document.getElementById("deadlineInput").value = "";
                document.getElementById("statusInput").value = "";
                document.getElementById("tagInput").value = "";
                document.getElementById("assignedToInput").value = "";
                console.log("Navigating")
                // navigate(`/adminTasks/${id}`)
            } else {
                console.error("Add task failed");
            }
        } catch (error) {
            console.error(error);
        }
    };


    const editTaskHandler = () => {
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(taskData) && taskData.length > 0 ? (
                                    taskData.map((task) => (
                                        <TableRow key={task.id} onClick={handleEditOpenModal}>
                                            <TableCell>{task.title}</TableCell>
                                            <TableCell>{task.deadline}</TableCell>
                                            <TableCell>{task.status}</TableCell>
                                            <TableCell>{task.assigned_by}</TableCell>
                                            <TableCell>{task.tag}</TableCell>
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

            {/* Add task */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={style}>
                    <div>
                        <Typography variant="h6">Add Task</Typography>
                        <TextField
                            label="Title"
                            id="titleInput"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            id="descInput"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <TextField
                            label="Deadline"
                            id="deadlineInput"
                            type="date"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Assign To"
                            id="assignedToInput"
                            variant="outlined"
                            type="number"
                            fullWidth
                            required
                            margin="normal"
                        />
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <Typography>Status</Typography>
                            <Select label="Status"
                                id="statusInput"
                                required
                                value={statusValue}
                                onChange={(e) => setStatusValue(e.target.value)}
                            >
                                <MenuItem value="Assigned">Assigned</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Tag"
                            id="tagInput"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addTaskHandler}
                            style={{ marginTop: '16px' }}
                        >
                            Add Task
                        </Button>
                    </div>
                </Box>
            </Modal>



            <Modal open={isEditModalOpen} onClose={handleEditCloseModal}>
                <Box sx={style}>
                    <div>
                        <Typography variant="h6">Edit Task</Typography>
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
                            onClick={handleEditCloseModal}
                            style={{ marginTop: '16px' }}
                        >
                            Edit Task
                        </Button>
                    </div>
                </Box>
            </Modal>


        </React.Fragment>
    );
}

export default AdminTasks;
