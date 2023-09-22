import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

function CommentForm({ taskId, userId, onCommentAdded }) {
    const [comment, setComment] = useState('');

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleAddComment = () => {
        if (comment.trim() === '') {
            return;
        }
        onCommentAdded(taskId, userId, comment);
        setComment('');
    };

    return (
        <Box>
            <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={comment}
                onChange={handleCommentChange}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
                style={{ marginTop: '16px' }}
            >
                Add Comment
            </Button>
        </Box>
    );
}

export default CommentForm;
