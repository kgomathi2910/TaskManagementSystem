export const getUsersAction = () => {
    return async (dispatch) => {
        try {
            const response = await fetch('http://localhost:8081/getUsers');
            const userData = await response.json();

            // User object = User object + Task count
            const usersAlongWithTaskCounts = await Promise.all(
                userData.users.map(async (user) => {
                    const taskCountsResp = await fetch(`http://localhost:8081/getTaskCounts/${user.id}`);
                    const taskCounts = await taskCountsResp.json();
                    return { ...user, taskCounts };
                })
            );

            dispatch({ type: 'GET_USERS_SUCCESS', payload: usersAlongWithTaskCounts });
        } catch (error) {
            console.error('Error fetching user data:', error);
            dispatch({ type: 'GET_USERS_FAILURE', error });
        }
    };
};

export const changeAdminStatusAction = (id, isAdmin) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:8081/updateAdminStatus/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isAdmin }),
            });

            if (response.ok) {
                dispatch({ type: 'CHANGE_ADMIN_SUCCESS', payload: { id, isAdmin } });
            } else {
                console.error('Failed to update admin status');
            }
        } catch (error) {
            console.error('Error updating admin status:', error);
            dispatch({ type: 'CHANGE_ADMIN_FAILURE', error });
        }
    };
};
