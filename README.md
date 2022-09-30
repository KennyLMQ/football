# Running Development Environment Locally
```
docker-compose up
```
# Building Production Docker Image
```
cd next_mui
docker build . -t next_mui:latest
```
# Running Production Docker Locally
```
docker run --publish 3000:3000 --name next_mui next_mui
```
# Bashing into Production Docker
```
docker exec -it next_mui bash
```