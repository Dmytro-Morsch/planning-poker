CREATE USER poker WITH ENCRYPTED PASSWORD 'poker';

GRANT poker TO postgres;
GRANT CONNECT ON DATABASE poker to poker;

CREATE SCHEMA poker AUTHORIZATION poker;

ALTER ROLE poker SET search_path TO poker;