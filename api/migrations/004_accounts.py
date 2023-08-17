steps = [
    [
        # Up statement
        """
        CREATE TABLE user_accounts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        hashed_password VARCHAR(128) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        email VARCHAR(100) UNIQUE NOT NULL,
        bio TEXT,
        photo VARCHAR(255)
        );
        """,
        # Down statement
        """
        DROP TABLE accounts;
        """,
    ],
]
