CREATE ROLE vagrant;
ALTER ROLE vagrant WITH LOGIN PASSWORD 'vagrant' NOSUPERUSER NOCREATEDB NOCREATEROLE;
CREATE DATABASE vagrant OWNER vagrant;
REVOKE ALL ON DATABASE vagrant FROM PUBLIC;
GRANT CONNECT ON DATABASE vagrant TO vagrant;
GRANT ALL ON DATABASE vagrant TO vagrant;

