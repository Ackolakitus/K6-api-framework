import http from "k6/http";
import { check } from 'k6';
import { BASE_URL } from "../config/config.js"

export function login(email, password){
    const payload = JSON.stringify({
        "email": email, 
        "password": password
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return http.post(`${BASE_URL}/users/login`, payload, params);
}

export function logout(params){
    return http.post(`${BASE_URL}/users/logout`, null, params);
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


export function getContactList(params){
    return http.get(`${BASE_URL}/contacts`, params);
}

export function getContact(contactId, params){
    return http.get(`${BASE_URL}/contacts/${contactId}`, params);
}

export function createContact(payload, params){
    return http.post(`${BASE_URL}/contacts`, payload, params);
}

export function deleteContact(contactId, params){
    return http.del(`${BASE_URL}/contacts/${contactId}`, null, params);
}

export function partiallyUpdateContact(contactId, payload, params){
    return http.patch(`${BASE_URL}/contacts/${contactId}`, payload, params);
}

export function fullyUpdateContact(contactId, payload, params){
    return http.patch(`${BASE_URL}/contacts/${contactId}`, payload, params);
}
