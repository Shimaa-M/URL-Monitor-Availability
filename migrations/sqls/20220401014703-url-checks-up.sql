CREATE TABLE url_checks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    protocol VARCHAR(255),
    path VARCHAR(150),
    port INTEGER,
    timeout INTEGER DEFAULT 5,
    interval INTEGER,
    threshold INTEGER  DEFAULT 1,
    assert  INTEGER,
    responseTime Numeric,
    uptime Numeric,
    user_id INTEGER 
);