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