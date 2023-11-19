### Test Postgres with Docker

1. Pull the postgres image
2. Run this command to create a new docker container for postgres database
    ```bash
    docker run --name openmusic-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=openmusicapp -d postgres
    ```
3. If you're using docker desktop, go to the `Exec` menu and run this command to create new database with root user 
   ```bash
   psql -U postgres;
   ```
   ```bash
   CREATE DATABASE openmusicapp;
   ```
4. Add privileges to the postgres user for the new created database
    ```bash
    GRANT ALL PRIVILEGES ON DATABASE openmusicapp TO postgres;
    ```
5. Run the migration to create the table
