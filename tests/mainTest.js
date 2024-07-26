import { sleep, check } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { addContacts } from '../scenarios/add-contacts.js';
import { updateContacts } from '../scenarios/update-contacts.js';
import { deleteContacts } from '../scenarios/delete-contacts.js';
import { BASE_URL, USERS } from "../config/config.js"
import { login, logout, checkStatus, httpRequest } from '../utils/httpUtil.js';
import { getRandomDataElement } from '../utils/dataUtil.js';
import { expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { initContractPlugin } from 'https://jslib.k6.io/k6chaijs-contracts/4.3.4.0/index.js';
import { contact_schema } from '../schemas/contact-schema.js';
import { login_user_schema, user_schema } from '../schemas/user-schema.js';
import exec from 'k6/execution';


const contacts = JSON.parse(open('../data/testData.json'))['contacts'];

initContractPlugin(chai)

export function setup(){
    let params = []
    for(const user of USERS){
        const response = login(`${BASE_URL}/users/login`,user.email, user.password);
        checkStatus(response.status, 200, 'Login successful');
        expect(response.json(), "Login schema validation.").to.matchSchema(login_user_schema);

        const token = response.json('token');
        params.push({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        // console.log("Logged in user with token: " + token)
    }
    return params;
}

export const options = {
    scenarios: {
        add_contacts: addContacts,
        update_contacts: updateContacts,
        delete_contacts: deleteContacts,
    },
    thresholds: {
        'http_req_duration': ['avg < 200', 'p(95) < 250'],
        'http_req_blocked': ['avg < 150'],
        'http_req_waiting': ['p(95) < 250'],
        'iteration_duration': ['p(95) < 1000'],
        checks: ['rate > 0.85'],
    }
}

export function add_contact(data){

    const index = exec.scenario.iterationInTest % data.length;
    const params = data[index]

    // console.log("Iteration " + exec.scenario.iterationInTest +" got index " + index)

    // sleep(1)
    // const resError = http.get(BASE_URL + "/contacts"); 
    // checkStatus(resError.status, 401)

    const payload = JSON.stringify(getRandomDataElement(contacts))
 
    const addContactResp = httpRequest('post', "/contacts", payload, params)
    checkStatus(addContactResp.status, 201, "Contact created successfully.")
    expect(addContactResp.json(), "Contact response schema.").to.matchSchema(contact_schema)

    // sleep(0.3)
    
    const contactId = addContactResp.json()['_id']

    const getContactResp = httpRequest('get', `/contacts/${contactId}`, null, params)
    checkStatus(getContactResp.status, 200, "Contact successfully retrieved.");

}
// ````````````````````````````

export function update_contact(data){

    const index = exec.scenario.iterationInTest % data.length;
    const params = data[index]

    // console.log("Iteration " + exec.scenario.iterationInTest +" got index " + index)
    // sleep(1)
    
    const getContactsResp = httpRequest('get', `/contacts`, null, params);
    checkStatus(getContactsResp.status, 200, "All contacts retrieved.");

    const responseBody = JSON.parse(getContactsResp.body);

    if (responseBody.length !== 0)
    {
        const contactId = getRandomDataElement(getContactsResp.json())['_id']

        const payload = JSON.stringify({
            "firstName": "New name",
            "lastName": "New surname"
        });

        const updateContactResp = httpRequest('patch', `/contacts/${contactId}`, payload, params)
        checkStatus(updateContactResp.status, 200, "Contact successfully updated.")
    }
    else
    {
        console.error("Contact list is empty")
    }
}


export function delete_contact(data){

    const index = exec.scenario.iterationInTest % data.length;
    const params = data[index]

    // console.log("Iteration " + exec.scenario.iterationInTest +" got index " + index)
    
    // sleep(1)

    const getContactsResp = httpRequest('get', `/contacts`, null, params);
    checkStatus(getContactsResp.status, 200, "All contacts retrieved.");
    const responseBody = JSON.parse(getContactsResp.body);

    if (responseBody.length !== 0)
    {
        const contactId = getRandomDataElement(getContactsResp.json())['_id']
        
        const get = httpRequest('get', `/contacts/${contactId}`, null , params)
        checkStatus(get.status, 200, "Get contact before deleting")
        console.log(get.json())

        const response = httpRequest('del', `/contacts/${contactId}`, null, params)
        checkStatus(response.status, 200, "Contact deleted.")

        const getDeleted = httpRequest('get', `/contacts/${contactId}`, null ,params)
        checkStatus(getDeleted.status, 404, "Contact was indeed deleted!")
    }
    else
    {
        console.error("Contact list is empty")
    }
}



export function teardown(data){
    console.log('\n')
    for(const params of data){
        const response = logout(`${BASE_URL}/users/logout`, params);
        checkStatus(response.status, 200, "Logged out successfully.");
        // console.log("Logged out user with token: " + params.headers['Authorization'].replace('Bearer ', ''))
    }
}
