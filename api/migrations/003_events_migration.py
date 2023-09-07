steps = [
    [
        # create table
        """
        CREATE TABLE events (
            event_id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            date VARCHAR(100) NOT NULL,
            time VARCHAR(20) NOT NULL,
            cost VARCHAR(100) NOT NULL,
            location VARCHAR(300) NOT NULL,
            description VARCHAR(2000) NOT NULL,
            organizer_id INT REFERENCES user_accounts(id),
            organizer_username VARCHAR(500) REFERENCES user_accounts(username),
            goal_id INT REFERENCES accomplist_items(id)
        );
        """,
        # drop table
        """
        DROP TABLE events;
        """,
    ]
]
