import { loginAllUsers, logoutAllUsers } from '../config/config.js';
import { addContacts, add_contact } from '../scenarios/add-contacts.js';
import { updateContacts, update_contact} from '../scenarios/update-contacts.js';
import { deleteContacts, delete_contact } from '../scenarios/delete-contacts.js';

import { chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { initContractPlugin } from 'https://jslib.k6.io/k6chaijs-contracts/4.3.4.0/index.js';

export { add_contact, update_contact, delete_contact }
initContractPlugin(chai)

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
        checks: ['rate > 0.95'],
    }
}

export function setup(){
    return loginAllUsers()
}

export function teardown(data){
    logoutAllUsers(data)
}
