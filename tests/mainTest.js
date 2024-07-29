import { addContacts } from '../scenarios/add-contacts.js';
import { updateContacts } from '../scenarios/update-contacts.js';
import { deleteContacts } from '../scenarios/delete-contacts.js';
import { USERS } from "../config/config.js"
import { login, logout, checkStatus, getContactList, getContact, createContact, deleteContact, partiallyUpdateContact } from '../utils/httpUtil.js';
import { getRandomDataElement } from '../utils/dataUtil.js';
import { contact_schema } from '../schemas/contact-schema.js';
import { login_user_schema } from '../schemas/user-schema.js';
import exec from 'k6/execution';
import { expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { initContractPlugin } from 'https://jslib.k6.io/k6chaijs-contracts/4.3.4.0/index.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

initContractPlugin(chai)

const contacts = JSON.parse(open('../data/testData.json'))['contacts'];


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

export function setup(){
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
        // console.log("Logged in user with token: " + token)
    }
    return params;
}

export function add_contact(data){

    const index = exec.scenario.iterationInTest % data.length;
    const params = data[index]
    // console.log("Iteration " + exec.scenario.iterationInTest +" got index " + index)

    const payload = JSON.stringify(getRandomDataElement(contacts))
 
    const createResp = createContact(payload, params)
    checkStatus(createResp.status, 201, "Contact created successfully.")
    expect(createResp.json(), "Contact response schema.").to.matchSchema(contact_schema);
    
    const contactId = createResp.json()['_id'];

    const getContactResp = getContact(contactId, params)
    checkStatus(getContactResp.status, 200, "Contact successfully retrieved.");

}

export function update_contact(data){

    const index = exec.scenario.iterationInTest % data.length;
    const params = data[index]
    // console.log("Iteration " + exec.scenario.iterationInTest +" got index " + index)
    
    const getContactsResp = getContactList(params);
    checkStatus(getContactsResp.status, 200, "All contacts retrieved.");

    const responseBody = JSON.parse(getContactsResp.body);

    if (responseBody.length !== 0)
    {
        const contactId = getRandomDataElement(getContactsResp.json())['_id']

        const payload = JSON.stringify({
            "firstName": randomString(7),
            "lastName": randomString(8)
        });

        const updateContactResp = partiallyUpdateContact(contactId, payload, params)
        checkStatus(updateContactResp.status, 200, "Contact successfully updated.")
        expect(updateContactResp.json(), "Update contact schema.").to.matchSchema(contact_schema)
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
    
    const getContactsResp = getContactList(params);
    checkStatus(getContactsResp.status, 200, "All contacts retrieved.");

    const responseBody = JSON.parse(getContactsResp.body);
    // expect(responseBody, 'Contacts list').to.be.an('array')

    if (responseBody.length !== 0)
    {
        responseBody.forEach(element => {
            expect(element, 'Contact list item schema').to.matchSchema(contact_schema)
        });
        const contactId = getRandomDataElement(getContactsResp.json())['_id']
        
        const contactResp = getContact(contactId, params)
        checkStatus(contactResp.status, 200, "Get contact before deleting")

        const response = deleteContact(contactId, params)
        checkStatus(response.status, 200, "Contact deleted.")

        const getDeleted = getContact(contactId, params)
        checkStatus(getDeleted.status, 404, "Contact was indeed deleted!")
    }
    else
    {
        console.error("Contact list is empty")
    }
}

export function teardown(data){
    for(const params of data){
        const response = logout(params);
        checkStatus(response.status, 200, "Logged out successfully.");
        // console.log("Logged out user with token: " + params.headers['Authorization'].replace('Bearer ', ''))
    }
}
