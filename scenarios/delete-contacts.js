import exec from 'k6/execution';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { fail } from 'k6'
import { getRandomDataElement} from '../utils/dataUtil.js';
import { checkStatus, getContact, getContactList, deleteContact } from '../utils/httpUtil.js';
import { contact_schema } from '../schemas/contact-schema.js';

export const deleteContacts = {
    executor: 'constant-arrival-rate',
    rate: 10,
    timeUnit: '2s',
    duration: '10s',
    startTime: '10s',
    preAllocatedVUs: 3,
    maxVUs: 6,
    exec: 'delete_contact'
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
        fail("Contact list is empty")
    }
}