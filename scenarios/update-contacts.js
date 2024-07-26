// export const updateContacts = {
//     executor: 'constant-arrival-rate',
//     rate: 5,
//     timeUnit: '5s',
//     duration: '15s',
//     startTime: '20s',
//     exec: 'update_contact'
// }

export const updateContacts = {
    executor: 'constant-vus',
    vus: 3,
    duration: '5s',
    startTime: '5s',
    exec: 'update_contact'
}