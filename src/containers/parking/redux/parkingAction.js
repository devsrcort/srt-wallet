export const sendEmail = (username, password) => ({
    type: "POST_USER_AUTHENTICATE_API",
    username,
    password
});

export const loading = () => ({
    type: "CHANGE_LOADING_STATE"
});

