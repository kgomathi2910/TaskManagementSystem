import { useParams } from "react-router";
import UserSideNav from './UserSideNav';
import React, { useEffect, useState } from 'react';
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

function UserTasks() {
    const { id } = useParams();
    console.log("User id from (User.js)", id)
    const [taskData, setTaskData] = useState([]); // contains all tasks of a user in the system
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // modal for Edit Task
    const [taskEdit, setTaskEdit] = useState({}); // Store the task being edited
    const [comments, setComments] = useState([]);

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
            const reqData = await fetch(`http://localhost:8081/getTask/${id}`);
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
            <UserSideNav id={id} />
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
                                            <TableRow key={task.id}
                                                onClick={() => handleEditOpenModal(task)}>
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
                <br />
                <Typography>Add a comment to see all comments</Typography>
                <Typography>Refresh the page to see the changes</Typography>
            </Box>



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
                            disabled
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={taskEdit?.description || ''}
                            disabled
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
                            value={taskEdit?.deadline ? taskEdit.deadline.split('T')[0] : ''}
                            disabled
                        />
                        <TextField
                            label="Assign To"
                            variant="outlined"
                            type="number"
                            fullWidth
                            required
                            margin="normal"
                            value={taskEdit?.assigned_to || ''}
                            disabled
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
                            disabled
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
    )
}

export default UserTasks;
