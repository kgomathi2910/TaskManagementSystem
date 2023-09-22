import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import AdminSideNav from './AdminSideNav';
import { useNavigate } from "react-router-dom"
import CommentForm from "./CommentForm";
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
    Paper,
    TablePagination
} from '@mui/material';

function AdminTasks() {
    const [taskData, setTaskData] = useState([]); // contains all tasks in the system
    const [isModalOpen, setIsModalOpen] = useState(false); // modal for Add Task
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // modal for Edit Task
    const [statusValue, setStatusValue] = useState('');
    const [comments, setComments] = useState([]);
    const [taskEdit, setTaskEdit] = useState({}); // Store the task being edited

    const { id } = useParams();
    console.log("Admin ID from admin tasks", id)
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEditOpenModal = (task) => {
        console.log("task to be editted: ", task)
        setTaskEdit(task); // in order to keep track of the task being editted
        setIsEditModalOpen(true);
    };

    const handleEditCloseModal = () => {
        setTaskEdit(null); // erase the data in the task to be editted
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


    const editTaskHandler = async () => {
        try {
            if (!taskEdit) {
                console.error('No task selected for editing');
                return;
            }

            const { id, title, description, deadline, assigned_to, status, tag } = taskEdit;

            // for MySQL compatibility
            const modifiedDeadline = new Date(deadline).toISOString().split('T')[0];

            const edittedTask = {
                title,
                description,
                deadline: modifiedDeadline,
                assigned_to,
                status,
                tag,
            };

            const response = await fetch(`http://localhost:8081/updateTask/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(edittedTask),
            });

            if (response.ok) {
                handleEditCloseModal();
            } else {
                console.error('Edit task failed');
            }
        } catch (error) {
            console.error(error);
        }
    };


    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 2));
        setPage(0);
    };

    // Comments
    const handleCommentAdded = async (taskId, userId, comment) => {
        try {
            const response = await fetch(`http://localhost:8081/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId, userId, comment }),
            });

            if (response.ok) {
                const commentResponse = await fetch(`http://localhost:8081/comments/${taskId}`);
                if (commentResponse.ok) {
                    const commentData = await commentResponse.json();
                    setComments(commentData.comments);
                    console.log("Comments: ", comments)
                }
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <React.Fragment>
            <AdminSideNav id={id} />
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
                                    <TableCell>Comments</TableCell>
                                    <TableCell>Add Comments</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(taskData) && taskData.length > 0 ? (
                                    taskData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((task) => (
                                            <TableRow key={task.id} onClick={() => handleEditOpenModal(task)}>
                                                <TableCell>{task.title}</TableCell>
                                                <TableCell>{task.deadline}</TableCell>
                                                <TableCell>{task.status}</TableCell>
                                                <TableCell>{task.assigned_by}</TableCell>
                                                <TableCell>{task.tag}</TableCell>
                                                <TableCell>
                                                    {comments.length > 0 ? (
                                                        comments
                                                            .filter((comment) => comment.task_id === task.id) // Filter comments for the current task ID
                                                            .map((filteredComment, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{filteredComment.comment}</TableCell>
                                                                </TableRow>
                                                            ))
                                                    ) : (
                                                        <span>No comments available</span>
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}>
                                                    <CommentForm
                                                        taskId={task.id}
                                                        userId={id}
                                                        onCommentAdded={handleCommentAdded}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))) : (
                                    <TableRow>
                                        <TableCell>No tasks found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <TablePagination
                    rowsPerPageOptions={[2, 3, 4]}
                    component="div"
                    count={taskData.length} // Total number of rows
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    style={{ marginTop: '16px' }}
                >
                    Add Task
                </Button>
                <br /><br />
                <Typography>Add a comment to see all comments</Typography>
                <Typography>Refresh the page to see the changes made through 'Edit task'</Typography>
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
                            value={taskEdit?.title || ''}
                            onChange={(e) =>
                                setTaskEdit({
                                    ...taskEdit,
                                    title: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={taskEdit?.description || ''}
                            onChange={(e) =>
                                setTaskEdit({
                                    ...taskEdit,
                                    description: e.target.value,
                                })
                            }
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
                            // value={taskEdit?.deadline || ''}
                            // onChange={(e) =>
                            //     setTaskEdit({
                            //         ...taskEdit,
                            //         deadline: e.target.value,
                            //     })
                            // }
                            value={taskEdit?.deadline ? taskEdit.deadline.split('T')[0] : ''}
                            onChange={(e) =>
                                setTaskEdit({
                                    ...taskEdit,
                                    deadline: e.target.value + 'T18:30:00.000Z', // Assuming the time is always '18:30:00.000Z'
                                })
                            }
                        />
                        <TextField
                            label="Assign To"
                            variant="outlined"
                            type="number"
                            fullWidth
                            required
                            margin="normal"
                            value={taskEdit?.assigned_to || ''}
                            onChange={(e) =>
                                setTaskEdit({
                                    ...taskEdit,
                                    assigned_to: e.target.value,
                                })
                            }
                        />
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <Typography>Status</Typography>
                            <Select label="Status"
                                required
                                value={taskEdit?.status || ''}
                                onChange={(e) =>
                                    setTaskEdit({
                                        ...taskEdit,
                                        status: e.target.value,
                                    })
                                }
                            >
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
                            value={taskEdit?.tag || ''}
                            onChange={(e) =>
                                setTaskEdit({
                                    ...taskEdit,
                                    tag: e.target.value,
                                })
                            }
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={editTaskHandler}
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
