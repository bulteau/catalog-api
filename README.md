# catalog-api
Expose a product recommandation API, based on Google Vision API

## List package used
- ORM : sequelize
pros : faster to develop
cons : could be slower with a large dataset
- DB : Postgres
- Web Framework : express
- Color Proximity Calcul : colour-proximity
- image-downloader

## How to use it

### Step 1 - loading csv data
**prerequisite :**
- Node installed
- CSV file with comma delimiter
- Postgres DB available, you can install it quickly with Docker `docker run --name catalog-postgres -e POSTGRES_PASSWORD=kT6xMdTqahVCvYAN -e POSTGRES_USER=catalog-user -e POSTGRES_DB=catalog-db -p 5432:5432 -d postgres`

Launch this command line to load your data
`node src/cmd/step1-loading.js path/to/file.csv`

### Step 2 - Identify color for each products
**prerequisite :**
- A key authentification configured on your env : [see more](https://cloud.google.com/docs/authentication/getting-started#auth-cloud-implicit-nodejs)

Launch this command line to populate database with Metadata from Google Vision API
`node src/cmd/step2-identifyColors.js`

All Backup Data from step 1 and 2 : backup-data.sql

### Step 3 - API ENDPOINTS

Launch this command line
`node index.js`

Go to : http://localhost:3000/api/recommandation/[productid]
Example : http://localhost:3000/api/recommandation/L1212-00-001


Also available : http://localhost:3000/api/products in order to list every products
