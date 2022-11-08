# Environment Setup

## Local

### Running Development Environment Locally

```sh
docker-compose up
```

## Production

### Building Production Docker Image

```sh
cd next_mui
docker build . -t next_mui:latest
```

### Running Production Docker Locally

```sh
docker run --publish 3000:3000 --name next_mui next_mui
```

### Bashing into Production Docker

```sh
docker exec -it next_mui bash
```

# Initialization

## Environment Variables

Create `.env.local` in the `next_mui` folder and add the following environment variables to utilise Rapid API:

- XG_URL=https://football-xg-statistics.p.rapidapi.com
- XG_KEY=<YOUR_KEY>
- XG_HOST=football-xg-statistics.p.rapidapi.com

Values are retrieved from [RapidAPI](https://rapidapi.com/Wolf1984/api/football-xg-statistics/). Account will need to be created to get the `XG_KEY` value.

\
There is no authentication for this application, but there are certain APIs we do not want the public to use. Add another variable to 'secure' these APIs:

- API_SECRET=<YOUR_SECRET>

## Database Table Creation

Create the database tables:

```sh
psql --host=localhost --username=next_mui_user --dbname=next_mui_db -f .postgres/createTable.sql
```

## Database Table Update

Run the following command periodically to update the DB from the API source:

```sh
curl "<url>/api/initialize/fixtures" --header "Api-Secret: <YOUR_SECRET>"
curl "<url>/api/initialize/teams" --header "Api-Secret: <YOUR_SECRET>"
```

The data from [RapidAPI](https://rapidapi.com/Wolf1984/api/football-xg-statistics/) is usually updated a few days after a match.