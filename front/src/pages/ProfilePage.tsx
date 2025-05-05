import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatCardNumber(num: string) {
  return num.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    securityNumber: "",
    cardExpiryDate: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const res = await fetch("http://localhost:8080/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data);
        setCardInfo({
          cardNumber: data.cardNumber || "",
          securityNumber: data.securityNumber || "",
          cardExpiryDate: data.cardExpiryDate
            ? new Date(data.cardExpiryDate).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    fetchUser();
  }, []);

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/addCard", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cardInfo),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      setEditing(false);
    }
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardInfo({ ...cardInfo, cardNumber: formatCardNumber(raw) });
  };

  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome, {user.firstName}!
      </h2>

      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Reg No:</strong> {user.registrationNumber}
        </p>
        <p>
          <strong>User Type:</strong> {user.userType}
        </p>
      </div>

      <hr className="my-4" />

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Credit Card Info</h3>

        {editing ? (
          <form onSubmit={handleCardSubmit} className="space-y-3">
            <div>
              <input
                value={cardInfo.cardNumber}
                placeholder="Card Number"
                className="w-full p-2 border rounded"
                onChange={handleCardInput}
              />
            </div>
            <div>
              <input
                value={cardInfo.securityNumber}
                placeholder="Security Number"
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, securityNumber: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="date"
                value={cardInfo.cardExpiryDate}
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, cardExpiryDate: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : !cardInfo.cardNumber ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Card Info
          </button>
        ) : (
          <>
            <div className="relative">
              <p className="mb-1 font-medium text-sm text-gray-700">
                Card Number
              </p>
              <span className="block p-2 border rounded pr-20 bg-gray-50">
                {showCard ? cardInfo.cardNumber : "**** **** **** ****"}
              </span>
              <button
                type="button"
                onClick={() => setShowCard(!showCard)}
                className="absolute right-2 top-7 text-sm text-blue-600 hover:underline"
              >
                {showCard ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative mt-3">
              <p className="mb-1 font-medium text-sm text-gray-700">CVV</p>
              <span className="block p-2 border rounded pr-20 bg-gray-50">
                {showCVV ? cardInfo.securityNumber : "***"}
              </span>
              <button
                type="button"
                onClick={() => setShowCVV(!showCVV)}
                className="absolute right-2 top-7 text-sm text-blue-600 hover:underline"
              >
                {showCVV ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative mt-3">
              <p className="mb-1 font-medium text-sm text-gray-700">
                Expiry Date
              </p>
              <span className="block p-2 border rounded pr-20 bg-gray-50">
                {showDate ? cardInfo.cardExpiryDate : "**/**/****"}
              </span>
              <button
                type="button"
                onClick={() => setShowDate(!showDate)}
                className="absolute right-2 top-7 text-sm text-blue-600 hover:underline"
              >
                {showDate ? "Hide" : "Show"}
              </button>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Edit Card Info
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
