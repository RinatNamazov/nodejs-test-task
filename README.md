# nodejs-test-task

## Installation

Download the project source.
```bash
$ git clone https://github.com/RinatNamazov/nodejs-test-task
$ npm install
```
Edit the information about connecting to PostgreSQL in `.env` file.

Set up the database.
```bash
$ npm run migrate up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The site is accessible on `localhost:3000`, documentation at `localhost:3000/docs`.

## License

The source code is published under GPLv3, the license is available [here](LICENSE).
