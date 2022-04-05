CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    status INTEGER Not Null,
    availability Numeric Not Null,
    outages INTEGER Not Null,
    uptime Numeric Not Null,
    responseTime Numeric Not Null,
    user_id INTEGER Not Null
);