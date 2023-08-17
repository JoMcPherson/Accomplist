steps = [
    [
        # Create the table
        """
        CREATE TABLE my_accomplist_items (
            id SERIAL PRIMARY KEY NOT NULL,
            item_id INT NOT NULL REFERENCES accomplist_items(id),
            user_id INT NOT NULL REFERENCES users_accounts(id),
            completed BOOL NOT NULL
        );
        """,
        # Drop the table
        """
        DROP TABLE my_accomplist_items;
        """,
    ]
]