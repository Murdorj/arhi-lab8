import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:8080/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const me = await res.json();
        if (me.userType !== "admin") {
          throw new Error("Access denied");
        }

        setIsAdmin(true);

        return fetch("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!isAdmin) return <p className="text-center mt-10">Checking permission...</p>;
  if (!users.length) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">All Registered Users</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Reg. No</th>
            <th className="p-2 border">Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.firstName} {u.lastName}</td>
              <td className="p-2 border">{u.registrationNumber}</td>
              <td className="p-2 border">{u.userType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
