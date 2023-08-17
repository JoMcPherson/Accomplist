steps = [
    [
        ## Create the table
        """
        CREATE TABLE accomplist_items (
            id SERIAL PRIMARY KEY NOT NULL,
            user_id INT NOT NULL REFERENCES users_accounts(id),
            title VARCHAR(1000) NOT NULL,
            details TEXT NOT NULL,
            photo TEXT,
            resources TEXT,
            things_to_do TEXT,
            things_not_to_do TEXT,
            date_added DATE
        );
        """,
        """
        DROP TABLE accomplist_items;
        """
        ## Drop the table
    ]
]
