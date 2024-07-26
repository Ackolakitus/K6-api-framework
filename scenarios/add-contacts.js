// export const addContacts = {
//     executor: 'constant-arrival-rate',
//     rate: 5,
//     timeUnit: '5s',
//     duration: '15s',
//     startTime: '0s',
//     preAllocatedVUs: 20,
//     exec: 'add_contact'
// }

export const addContacts = {
    executor: 'constant-vus',
    vus: 3,
    duration: '5s',
    startTime: '0s',
    exec: 'add_contact'
}