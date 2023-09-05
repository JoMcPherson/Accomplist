steps = [
    [
        # Create the table
        """
        CREATE TABLE my_accomplist_items (
            id SERIAL PRIMARY KEY NOT NULL,
            item_id INT NOT NULL REFERENCES accomplist_items(id),
            user_id INT NOT NULL REFERENCES user_accounts(id),
            completed BOOL NOT NULL,
            CONSTRAINT unique_item_per_user UNIQUE (item_id, user_id)
        );
        """,
        # Drop the table
        """
        DROP TABLE my_accomplist_items;
        """,
    ]
]
