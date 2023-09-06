steps = [
    [
        ## Create the table
        """
        CREATE TABLE accomplist_items (
            id SERIAL PRIMARY KEY NOT NULL,
            user_id INT NOT NULL REFERENCES user_accounts(id),
            title VARCHAR(1000) UNIQUE NOT NULL,
            details TEXT NOT NULL,
            photo TEXT,
            resources TEXT,
            comments TEXT,
            date_added DATE
        );
        """,
        """
        DROP TABLE accomplist_items;
        """
        ## Drop the table
    ]
]
