# URL Monitor

### General info
check uour url availaibility,uptime/downtime and get reports.

### Technologies
 typescript/ nodejs/express/postgres/jasmine

### Setup
download the folder to your local machine
```
https://github.com/Shimoo123/URL-Monitor.git
$ npm install
$ npm run start
```
### database setup
```
- $psql -h localhost -U postgres
- $CREATE DATABASE monitor_dev;
- $\c store_dev
- $GRANT ALL PRIVILEGES ON DATABASE monitor_dev TO postgres;
-$ \q
```
```
- $CREATE USER test_user WITH PASSWORD 'postgres';
- $CREATE DATABASE monitor_test;
- $\c store_test
- $GRANT ALL PRIVILEGES ON DATABASE monitor_test TO postgres;
```
### ports
the backend port is 3000 & database port is 5432


### Test
npm run testdb

#### "name": "get all reports"
	"method": "GET"
	"url":  "http://localhost:3000/reports"
#### "name": "edit report",				
	"method": "PATCH",
	"url": "http://localhost:3000/reports/1"
#### "name": "delete report"		
	"method": "DELETE"
	"url": "http://localhost:3000/reports/4"
#### "name": "create report"
	"method": "POST"
    "url": "http://localhost:3000/reports/"
#### "name": "create report for logging user and certain tag of url"
	"method": "GET"
    "url": "http://localhost:3000/get-report/:tag"


#### "name": "create url check"
	"method": "GET"
    "url": "http://localhost:3000/health"


#### "name": "get all users"
    "method": "GET"
    "url": "http://localhost:3000/users/"
#### "name": "edit user"
	"method": "PATCH",
	"url": "http://localhost:3000/users/2"
#### "name": "get one user"
	"method": "GET"
    "url": "http://localhost:3000/users/1"
#### "name": "delete user"
	"method": "DELETE",
	"url": "http://localhost:3000/users/1"
#### "name": "login"
	"method": "POST"
    "url": "http://localhost:3000/login/"
#### "name": "create user"
	"method": "POST"
    "url": "http://localhost:3000/users/"

#### "name": "products in orders"
	"method": "GET"
    "url": "http://localhost:3000/products_in_orders/"
#### "name": "get products of one order",
	"method": "GET"
    "url": "http://localhost:3000/order/2/products"

### Data shape
#### reports
```
id integer primary key
status: number,
availability: number,
outages: number,
uptime: number,
responseTime: number,
user_id: number
```
#### url_checks
```
id :number;
    name :string;
    url :string;
    protocol? :string;
    path?:string;
    port? :number;
    timeout? :number;
    interval? :number;
    threshold? :number;
    assert?  :number;
    responseTime?: number;
    uptime?: number;
    user_id :number;
```
#### Users
```
id integer priamry key
name string
email string
password
```


### Environment variables
```
POSTGRES_HOST= localhost
POSTGRES_DB= monitor_dev
POSTGRES_DB_TEST= monitor_test
POSTGRES_USER= postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
POSTGRES_DRIVER= pg
POSTGRES_DIALECT=postgres
NODE_ENV=dev
BCRYPT_PASSWORD=i-love-my-children
SALT_ROUNDS=10
JWT_TOKEN=i-love-programming
JWT_COOKIE_EXPIRES_IN=90
```

