import { addContacts, add_contact } from '../scenarios/add-contacts.js';
import { updateContacts, update_contact} from '../scenarios/update-contacts.js';
import { deleteContacts, delete_contact } from '../scenarios/delete-contacts.js';
import { USERS } from "../config/config.js"
import { login, logout, checkStatus } from '../utils/httpUtil.js';
import { login_user_schema } from '../schemas/user-schema.js';

import { expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
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
    }
    return params;
}

export function teardown(data){
    for(const params of data){
        const response = logout(params);
        checkStatus(response.status, 200, "Logged out successfully.");
    }
}
