import useToken from "@galvanize-inc/jwtdown-for-react";
import React from "react";
import { Container, Row } from 'react-bootstrap';

export default function MyAccomplistItemsList({my_accomplist_items, user}) {
    const { token } = useToken();

    if (token) {
        const completedItems = my_accomplist_items.filter(item => item.completed);
        const pendingItems = my_accomplist_items.filter(item => !item.completed);

        return (
            <Container>
                <h1 style={{ marginTop: '150px' }}>{user.username}'s Accomplist items.</h1>

                <Row>
                    <table>
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedItems.map(my_item => (
                                <tr key={my_item.id}>
                                    <td>{my_item.item_id}</td>
                                    <td>{my_item.item_title}</td>
                                    <td>Done</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Row>

                <Row>
                    <table>
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingItems.map(my_item => (
                                <tr key={my_item.id}>
                                    <td>{my_item.item_id}</td>
                                    <td>{my_item.item_title}</td>
                                    <td>Will Do!</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Row>
            </Container>
        );
    }
}
