## Install Postgres
1. [Install Homebrew](http://brew.sh/)

2. Update Homebrew
```
$> brew update
$> brew doctor

```

3. Install Postgres
```
$> brew install postgresql

```

4. Create/Upgrade a database
```
$> initdb /usr/local/var/postgres -E utf8

```

5. Manually start postgres

```
>$ pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start
```
(...and stop postgres)

```
>$ pg_ctl -D /usr/local/var/postgres stop -s -m fast
```

## Set Up Postgres

1. Connect to the default database with user postgres.

```
$> sudo -u postgres psql template1
```

2. Set the password for user postgres, then exit psql(CTRL+D)
```
$> ALTER USER postgres with encrypted password 'xxxxxx';

```
*you can name the password whatever you'd like, just make sure to update
the env file*

3. Edit the `pg_hba.conf` file:
```
$> sudo vim /usr/loca/var/postgresql/9.3/main/pg_hba.conf

```

And change "peer" to "md5" on the line concerning postgres
`local all postgres md5`

4. Restart the database:

```
>$ pg_ctl -D /usr/local/var/postgres stop -s -m fast
>$ pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start
```
5. Create a user having the same name as you (to find it, type `whoami`)

```
>$ createuser -U postgres -d -e -E -l -P -r -s <postgres_username>
```
*you can name the user whatever you'd like, just make sure to update
the env file*

(...and stop postgres)

6. Create database
```

>%$ sudo -u <postgres_username> createdb auction-house-library
```
*you can name the database whatever you'd like, just make sure to update
the env file*

7. Create Table with schema
*Assuming you are in the root of the project, run the following command, to
create the necessary tables relations, and seed data:*
```
>$  psql -f schema.sql auction-house-library
```