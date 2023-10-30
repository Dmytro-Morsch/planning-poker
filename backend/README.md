Create database, app user and schema:
```sql
CREATE DATABASE poker;
CREATE USER poker WITH ENCRYPTED PASSWORD 'poker';
CREATE SCHEMA poker AUTHORIZATION poker;
GRANT USAGE ON SCHEMA poker TO poker;
ALTER ROLE poker SET search_path TO poker;
```
