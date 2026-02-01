import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LibraryDashboard() {
  const navigate = useNavigate();
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  return (
    <div className="library-dashboard">
      <div className="top-bar">
        <div className="user-info">
          Logged in as: <strong>Library Staff</strong>
        </div>
      </div>

      <div className="library-actions">
        <button onClick={() => navigate("/library/books-issued")}>
          Books Issued
        </button>

        <button onClick={() => navigate("/library/books-returned")}>
          Books Returned
        </button>

        <button onClick={() => navigate("/library/fine-collected")}>
          Fine Collected
        </button>

        <div className="dropdown">
          <button onClick={() => setShowBookDropdown(!showBookDropdown)}>
            Book Add ▾
          </button>

          {showBookDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/library/add-book")}>
                Add Book (Name & Quantity)
              </button>
              <button onClick={() => navigate("/library/all-books")}>
                View All Books
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LibraryDashboard;
