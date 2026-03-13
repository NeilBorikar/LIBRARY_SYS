import { useState, useEffect } from "react";
import api from "../../api/axios";
import staffService from "../../services/staffService";

function StaffBooksIssued() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const empId = localStorage.getItem("userIdentifier");
        if (empId) {
          // Try the new service first
          const books = await staffService.getStaffBooksIssued(empId);
          setIssuedBooks(books.books || books);
        }
      } catch (error) {
        console.error("Failed to fetch issued books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">📚</span>
            My Issued Books
          </h2>

          {issuedBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No books issued yet.</div>
              <div className="text-gray-400 text-sm mt-2">Visit the library to issue books.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                    <th className="border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Name</th>
                    <th className="border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                    <th className="border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {issuedBooks.map((book, index) => (
                    <tr key={book.transaction_id || index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.book_name || book.name || "Unknown"}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.issue_date || book.issueDate ? new Date(book.issue_date || book.issueDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.due_date || book.dueDate ? new Date(book.due_date || book.dueDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffBooksIssued;
