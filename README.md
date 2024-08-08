# k6 Performance Testing Framework

This framework is designed for performance testing using k6 and the API from [https://thinking-tester-contact-list.herokuapp.com](https://thinking-tester-contact-list.herokuapp.com).

## Setup

1. **Generate Test Data**

   ```bash
   cd data
   node generateTestData.js
   ```

2. **Run Performance Scenarios**

   ```bash
   cd tests
   k6 run mainTest.js
   ```

## Files

- `data/generateTestData.js`: Script to generate random test data using FakerJS.
- `data/testData.json`: The generated test data file.
- `tests/mainTest.js`: The k6 script to run performance tests.
- `scenarios/`: Folder containing scenario options and test functions used in mainTest.js.

## Requirements

- Node.js
- k6 (`npm install -g k6`)