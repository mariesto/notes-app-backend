### Test Postgres with Docker

1. Pull the postgres image
2. Run this command to create a new container
    ```bash
    docker run --name notesapp-postgres -p 5432:5432 -e POSTGRES_PASSWORD=pwd123 -e POSTGRES_DB=notesapp -d postgres
    ```
3. Add privileges to the postgres user for the new created database
    ```bash
    GRANT ALL PRIVILEGES ON DATABASE notesapp TO postgres
    ```
4. Create new database
   ```bash
   CREATE DATABASE notesapp;
   ```


