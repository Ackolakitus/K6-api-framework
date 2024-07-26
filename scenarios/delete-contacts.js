// export const deleteContacts = {
//     executor: 'constant-arrival-rate',
//     rate: 5,
//     timeUnit: '5s',
//     duration: '15s',
//     startTime: '40s',
//     exec: 'delete_contact'
// }

export const deleteContacts = { 
    executor: 'constant-vus',
    vus: 3,
    // vus: 1,
    duration: '5s',
    startTime: '10s',
    // startTime: '0s',
    exec: 'delete_contact'
}