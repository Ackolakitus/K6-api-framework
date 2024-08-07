import exec from 'k6/execution';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { getRandomDataElement} from '../utils/dataUtil.js';
import { checkStatus, getContact, createContact } from '../utils/httpUtil.js';
import { contact_schema } from '../schemas/contact-schema.js';


export const addContacts = {
    executor: 'shared-iterations',
    vus: 5,
    iterations: 50,
    maxDuration: '10s',
    startTime: '0s',
    exec: 'add_contact'
}

const contacts = JSON.parse(open('../data/testData.json'))['contacts'];

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