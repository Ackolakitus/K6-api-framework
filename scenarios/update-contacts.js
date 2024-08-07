import exec from 'k6/execution';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { getRandomDataElement} from '../utils/dataUtil.js';
import { checkStatus, getContactList, partiallyUpdateContact} from '../utils/httpUtil.js';
import { contact_schema } from '../schemas/contact-schema.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { fail } from 'k6'

export const updateContacts = {
    executor: 'constant-vus',
    vus: 3,
    duration: '5s',
    startTime: '5s',
    exec: 'update_contact'
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
        fail("Contact list is empty")
    }
}