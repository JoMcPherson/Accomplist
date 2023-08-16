steps = [
    [
        ## Create the table
        """
        CREATE TABLE my_accomplist_items (
            id SERIAL PRIMARY KEY NOT NULL,
            item_id INT NOT NULL REFERENCES accomplist_items(id),
            user_id INT NOT NULL REFERENCES users(id),
            completed BOOL NOT NULL,
        );
        """,
        """
        DROP TABLE my_accomplist_items;
        """
        ## Drop the table
    ]
]
