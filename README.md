# Environment Setup
## Local
### Running Development Environment Locally
```
docker-compose up
```
## Production
### Building Production Docker Image
```
cd next_mui
docker build . -t next_mui:latest
```
### Running Production Docker Locally
```
docker run --publish 3000:3000 --name next_mui next_mui
```
### Bashing into Production Docker
```
docker exec -it next_mui bash
```
# Initialization
Create `.env.local` in the `next_mui` folder and add the following environment variables:
* XG_URL=https://football-xg-statistics.p.rapidapi.com
* XG_KEY=<YOUR_KEY>
* XG_HOST=football-xg-statistics.p.rapidapi.com

Values are retrieved from [RapidAPI](https://rapidapi.com/Wolf1984/api/football-xg-statistics/). Account will need to be created to get the `XG_KEY` value.


Run the following command periodically to update the DB from the API source
```
curl "<url>/api/fpl/initialize"
```