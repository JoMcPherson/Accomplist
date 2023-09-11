steps = [
    [
        # Create the table
        """
        CREATE TABLE my_events (
            my_event_id SERIAL PRIMARY KEY NOT NULL,
            event_id INT NOT NULL REFERENCES events(event_id),
            organizer_id INT NOT NULL REFERENCES user_accounts(id)
        );
        """,
        # Drop the table
        """
        DROP TABLE my_events;
        """,
    ]
]
