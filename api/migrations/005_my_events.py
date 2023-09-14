steps = [
    [
        # Create the table
        """
        CREATE TABLE my_events (
            id SERIAL PRIMARY KEY NOT NULL,
            event_id INT NOT NULL REFERENCES events(event_id),
            attendee_id INT NOT NULL REFERENCES user_accounts(id),
            CONSTRAINT unique_event_per_user UNIQUE (event_id, attendee_id)
        );
        """,
        # Drop the table
        """
        DROP TABLE my_events;
        """,
    ]
]
