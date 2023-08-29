steps = [
    [
        # create table
        """
        CREATE TABLE events (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            date VARCHAR(100) NOT NULL,
            time VARCHAR(20) NOT NULL,
            cost VARCHAR(100) NOT NULL,
            location VARCHAR(300) NOT NULL,
            description VARCHAR(2000) NOT NULL,
            organizer VARCHAR(500)
        );
        """,
        # drop table
        """
        DROP TABLE events;
        """,
    ]
]
