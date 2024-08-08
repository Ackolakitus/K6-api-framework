import { login_user_schema } from '../schemas/user-schema.js';
import { login, logout, checkStatus } from '../utils/httpUtil.js';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';

export const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
export const EMAIL = 'ace001.ace007@gmail.com';
export const PASSWORD = 'acko123';

export const USERS = [
    {
        "email": "ace001.ace007@gmail.com",
        "password": "acko123"
    },
    {
        "email": "ace001@fake.com",
        "password": "acko123"
    },
    {

        "email": "ace007@fake.com",
        "password": "acko123"
    },
    // {
    //     "email": "nepostoi@fake.com",
    //     "password": "nepostoi"
    // }
]


export function loginAllUsers(){
    let params = []
    for(const user of USERS){

        const response = login(user.email, user.password);
        checkStatus(response.status, 200, 'Login successful');
        expect(response.json(), "Login schema validation.").to.matchSchema(login_user_schema);

        const token = response.json('token');
        params.push({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
    }
    return params;
}
export function logoutAllUsers(data){
    for(const params of data){
        const response = logout(params);
        checkStatus(response.status, 200, "Logged out successfully.");
    }
}