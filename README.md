# Environment Setup

## Local

### Running Development Environment Locally

```sh
docker-compose up
```

## Production

### Building Production Docker Image

```sh
cd football
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

## Application Environment Variables

Duplicate the `.env.sample` file:

```sh
cd football
cp .env.sample .env.local
```

Update both variables (`XG_KEY`, `API_SECRET`) in the file.

Create an account with [RapidAPI](https://rapidapi.com/Wolf1984/api/football-xg-statistics/) to get the `XG_KEY` value.

There is no authentication for this application, but there are private APIs that are secured by `API_SECRET`. Use your own value for this.

## Database Environment Variables

Duplicate the `.env.sample` file in the database folder:

```sh
cd football/database
cp .env.sample .env.local
```

Update all three variables (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) in the file.

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
