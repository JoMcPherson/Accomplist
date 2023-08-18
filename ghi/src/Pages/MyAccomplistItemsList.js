export default function MyAccomplistItemsList({my_accomplist_items}) {

console.log("my items",my_accomplist_items)
    return(
        <div>
            <h1>My Accomplist Items</h1>
            <table>
                <thead>
                    <tr>
                        <th>
                            User Name
                        </th>
                        <th>
                            Item Name
                        </th>
                        <th>
                            Completed
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {my_accomplist_items.map(my_item => {
                        return (
                            <tr key={my_item.id} >
                                <td>{my_item.username}</td>
                                <td>{my_item.item_title}</td>
                                <td>{my_item.completed ? "Done" : "Will Do!"}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
