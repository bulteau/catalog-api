# catalog-api
Expose a product recommandation API

## List package used
- ORM : sequelize
pros : faster to develop
cons : could be slower with a large dataset
- DB : Postgres
- API : express

## How to use it

### Step 1 - loading csv data
**prerequisite :**
- CSV file with comma delimiter
- Postgres DB available, you can install it quickly with Docker `docker run --name catalog-postgres -e POSTGRES_PASSWORD=kT6xMdTqahVCvYAN -e POSTGRES_USER=catalog-user -e POSTGRES_DB=catalog-db -d postgres`

Launch this command line to load your data
`node src/cmd/step1-loading.js path/to/file.csv`
