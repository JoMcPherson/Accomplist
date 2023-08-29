import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect } from "react";


export default function AccountProfilePage({user}) {
  const { token, fetchWithToken } = useToken();

  return (
    token && (
      <div>
        <h1>My Profile</h1>
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Username</th>
              <th>Membersince</th>
              <th>Name</th>
              <th>Bio</th>
            </tr>
          </thead>
          <tbody>
                <tr key={user.id}>
                  <td>{user.photo}</td>
                  <td>{user.username}</td>
                  <td>{user.first_name}</td>
                  <td>{user.bio}</td>
                </tr>
          </tbody>
        </table>
      </div>
    )
  );
}
