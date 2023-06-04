import axios from "axios";
// import AWS from 'aws-sdk';
// AWS.config.update({ region: "ap-northeast-2" });

import {
    BASE_URL,
    API_HEADER,
    HEADER_REQUEST,
    HEADER_RESPONSE,
} from "../constants/apiBaseUrl";
import {
    badRequest,
    internalServerError,
} from "../containers/errors/statusCodeMessage";
import { setAuthToken, getUsername } from "../utils/localStorage";
import { encryptMd5 } from "../utils/cryptography";
import i18n from "../utils/i18n";

class UserService {
    async createUser(userInfo) {
        try {
            let response = await axios.post(
                BASE_URL + "/users/register", {
                    name: userInfo.name,
                    phonenum: userInfo.phonenum,
                    email: userInfo.email,
                    password: encryptMd5(userInfo.password),
                    link: userInfo.link,
                },
                HEADER_REQUEST
            );

            return response;
        } catch (error) {
            if (error.response.data.code === 500) {
                return badRequest(i18n.t("NOTIFICATION_SERVICE_ALREADY_REGISTRED"));
            }

            internalServerError();
            return;
        }
    }

    async getUser(token) {
        try {
            API_HEADER.headers.Authorization = token;
            let response = await axios.get(BASE_URL + "/users/getUserInfo", {
                params: { id: getUsername() },
                headers: { Authorization: token },
            });

            setAuthToken(response.data.token);
            return response;
        } catch (error) {
            internalServerError();
            return;
        }
    }

    async updateUser(userInfo, token) {
        try {
            API_HEADER.headers.Authorization = token;

            const response = await axios
                .patch(BASE_URL + "/user", userInfo, API_HEADER)
                .catch((error) => {
                    return error.response;
                });

            setAuthToken(response.headers[HEADER_RESPONSE]);

            return response;
        } catch (error) {
            return internalServerError();
        }
    }

    async editUser(token, data) {
        let userData = {
            name: data.name,
            phonenum: data.phonenum,
            birthday: new Date(data.birthday),
            phone: data.phone,
            street: data.street,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
        };
        API_HEADER.headers.Authorization = token;
        let response = await axios.patch(BASE_URL + "/user", userData, API_HEADER);
        setAuthToken(response.headers[HEADER_RESPONSE]);

        return response;
    }

    async resetUserPassword(token, newPassword, oldPassword) {
        try {
            const user = {
                newPassword: encryptMd5(newPassword),
                oldPassword: encryptMd5(oldPassword),
            };

            API_HEADER.headers.Authorization = token;
            const response = await axios.post(
                BASE_URL + "/users/resetUserPassword",
                user,
                API_HEADER
            );

            return response;
        } catch (error) {
            return internalServerError();
        }
    }

    async sendMailUserInfo(userName, email, address, message) {
        try {
            const response = await axios
                .get(BASE_URL + "/users/sendEmailUserInfo", {
                    params: { 
                        email: email,
                        userName: userName, 
                        address: address,
                        message: message
                     }
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        } catch (error) {
            return internalServerError();
        }
    }

    async resetPass(data) {
        try {
            const response = await axios
                .get(BASE_URL + "/users/sendEmailResetPasswd", {
                    params: { email: data.email }
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        } catch (error) {
            return internalServerError();
        }
    }

    async verifyEmail(hash) {
        try {
            let response = await axios.get(
                `${BASE_URL}/user/email-verify/${hash}`,
                API_HEADER
            );

            return response.data;
        } catch (error) {
            return internalServerError();
        }
    }
}

export default UserService;