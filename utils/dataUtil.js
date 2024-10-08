import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js'

export function generateContact() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        birthdate: faker.date.past(50, new Date(2005, 0, 1)).toISOString().split('T')[0],
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber('##########'),
        street1: faker.address.streetAddress(),
        street2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        stateProvince: faker.address.stateAbbr(),
        postalCode: faker.address.zipCode(),
        country: faker.address.countryCode()
    };
}

export function generateContacts(numContacts) {
    const contacts = [];
    for (let i = 0; i < numContacts; i++) {
        contacts.push(generateContact());
    }
    return contacts;
}

export function getRandomDataElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}