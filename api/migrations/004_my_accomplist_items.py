steps = [
    [
        ## Create the table
        """
        CREATE TABLE my_accomplist_items (
            id SERIAL PRIMARY KEY NOT NULL,
            item_id INT NOT NULL,
            user_id INT REFERENCES users(id) NOT NULL,
            completed BOOL NOT NULL,
            CONSTRAINT fk_user
                FOREIGN KEY(user_id)
                    REFERENCES users(id),
            CONSTRAINT fk_item
                FOREIGN KEY(item_id)
                    REFERENCES accomplist_items(id)
        );
        """,
        """
        DROP TABLE my_accomplist_items;
        """
        ## Drop the table
    ]
]
