const initialState = {
    users: [],
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USERS_SUCCESS':
            return {
                ...state,
                users: action.payload,
            };
        case 'CHANGE_ADMIN_SUCCESS':
            const { userId, isAdmin } = action.payload;
            return {
                ...state,
                users: state.users.map((user) =>
                    user.id === userId ? { ...user, is_admin: isAdmin } : user
                ),
            };
        default:
            return state;
    }
};

export default { user: userReducer };
