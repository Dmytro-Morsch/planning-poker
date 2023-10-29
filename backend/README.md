CREATE DATABASE poker;
CREATE USER poker WITH ENCRYPTED PASSWORD 'poker';
GRANT poker TO postgres;
GRANT CONNECT ON DATABASE poker to poker;

# Switch to the created db 
\connect poker

CREATE SCHEMA poker AUTHORIZATION poker;
GRANT USAGE ON SCHEMA poker TO poker;
ALTER ROLE poker SET search_path TO poker;
