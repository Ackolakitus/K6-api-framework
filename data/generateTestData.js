const faker = require('../data/faker.min')
const fs = require('fs');

function generateContact() {
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

function generateContacts(numContacts) {
    const contacts = [];
    for (let i = 0; i < numContacts; i++) {
        contacts.push(generateContact());
    }
    return contacts;
}

function generateTestData(filePath, numContacts = 15){
    const data = { 
        contacts: generateContacts(numContacts) 
    };

    fs.writeFile(filePath, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error("Error writing testData file:", err);
        } else {
            console.log("JSON file has been saved.");
        }
    });
}

generateTestData("../data/testData.json", 20)