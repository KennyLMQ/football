CREATE TABLE IF NOT EXISTS fixtures_12310 (
    fixture_id INT UNIQUE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    update_time TIMESTAMP NOT NULL,
    home_id INT NOT NULL,
    home_name VARCHAR(64) NOT NULL,
    home_score INT NOT NULL,
    home_xg NUMERIC NOT NULL,
    away_id INT NOT NULL,
    away_name VARCHAR(64) NOT NULL,
    away_score INT NOT NULL,
    away_xg NUMERIC NOT NULL,
    events JSON NOT NULL,
    odds JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
    team_id INT UNIQUE NOT NULL,
    team_name VARCHAR(64) NOT NULL
);