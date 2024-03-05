# Fillout.com Engineering Screen

This repo fulfills the requirements specified by https://fillout.notion.site/Software-engineering-screen-fbd58fd78f59495c99866b91b1358221

The server itself can be accessed at http://fillout-screen-production.up.railway.app

## Implementation Notes

- As a base for this repo I've used my personal TypeScript boilerplate with `eslint` and `prettier` configs
- The server is build using `express.js`
- Requests to the Fillout API are performed using `axios`
- Query variables are parsed and typed using `zod`
- Request logging using `morgan`
- Environment variables are parsed and typed using `envsafe`
- A few basic tests are implemented using `jest`
- For the sake of simplicity I'm running the server using `tsx` in production

Basic error handling is implemented using a custom error handler. Any error status codes and messages from the Fillout API are forwarded.

In an effort to make the code easily scannable I've included many brief comments without formal JSDocs.

There are just a couple unit tests for easily isolated filtering logic.

Please let me know if you have any questions or feedback!
