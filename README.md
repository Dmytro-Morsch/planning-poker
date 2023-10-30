Planning Poker
==============
Planning poker, also called Scrum poker, is a consensus-based, gamified technique for estimating, mostly used for
timeboxing in Agile principles. In planning poker, members of the group make estimates by playing numbered cards
face-down to the table, instead of speaking them aloud. The cards are revealed, and the estimates are then discussed. By
hiding the figures in this way, the group can avoid the cognitive bias of anchoring, where the first number spoken aloud
sets a precedent for subsequent estimates.
[Wikipedia](https://en.wikipedia.org/wiki/Planning_poker)

Project setup
-------------
Install Node.js, JDK 17, Maven, and Postgres.

Create app user and schema:
```sql
CREATE USER poker WITH ENCRYPTED PASSWORD 'poker';
CREATE SCHEMA poker AUTHORIZATION poker;
GRANT USAGE ON SCHEMA poker TO poker;
ALTER ROLE poker SET search_path TO poker;
```

Build frontend:
```shell
cd frontend
npm install
npm run buld
```

Build backend:
```shell
cd backend
mvn clean verify
```

Start backend server:
```shell
cd backend
mvn spring-boot:run
```

Start frontend server:
```shell
cd frontend
npm run dev
```
