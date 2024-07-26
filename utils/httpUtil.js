import http from "k6/http";
import { check } from 'k6';
import { BASE_URL } from "../config/config.js"

export function login(url, email, password){
    const response = http.post(url, 
        JSON.stringify({
            "email": email, 
            "password": password
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        });

    return response;
}

export function logout(url, params){
    return http.post(url, null, params);
}

export function checkStatus(actual, expected, text = `status is ${expected}`) {
    check(actual, {
        [text]: () => actual === expected
    });
}

export function httpRequest(method, url, payload=null, params=null){
    if (method == 'get')
        return http[method](BASE_URL + url, params)
    
    return http[method](BASE_URL + url, payload, params)
}


export function getContactList(){

}

export function getContact(){

}

export function createContact(){

}

export function deleteContact(){

}

export function partiallyUpdateContact(){

}

export function updateContact(){
    
}