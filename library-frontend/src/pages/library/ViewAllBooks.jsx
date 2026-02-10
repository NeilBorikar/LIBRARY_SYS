import { motion } from "framer-motion";
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Plus,
  ChevronDown,
  Package,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

function ViewAllBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Enhanced dummy data
  const books = [
    { 
      id: 1, 
      name: "Data Structures and Algorithms", 
      author: "Thomas H. Cormen",
      isbn: "978-0262033848",
      quantity: 5,
      available: 3,
      category: "Computer Science",
      status: "available"
    },
    { 
      id: 2, 
      name: "Operating System Concepts", 
      author: "Abraham Silberschatz",
      isbn: "978-1118063330",
      quantity: 3,
      available: 1,
      category: "Computer Science",
      status: "limited"
    },
    { 
      id: 3, 
      name: "Computer Networks", 
      author: "Andrew S. Tanenbaum",
      isbn: "978-0132126953",
      quantity: 7,
      available: 7,
      category: "Computer Science",
      status: "available"
    },
    { 
      id: 4, 
      name: "Database Management Systems", 
      author: "Raghu Ramakrishnan",
      isbn: "978-0072465631",
      quantity: 4,
      available: 0,
      category: "Database",
      status: "unavailable"
    },
    { 
      id: 5, 
      name: "Artificial Intelligence: A Modern Approach", 
      author: "Stuart Russell",
      isbn: "978-0136042594",
      quantity: 6,
      available: 2,
      category: "AI/ML",
      status: "limited"
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesFilter = filterStatus === "all" || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "limited": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unavailable": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "available": return "Available";
      case "limited": return "Limited";
      case "unavailable": return "Unavailable";
      default: return "Unknown";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-large p-6 mb-8 border border-secondary-100"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-secondary-800">Library Catalog</h1>
                  <p className="text-secondary-600">Manage and view all books in the library</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-3">
              <button className="btn-primary flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add New Book
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Total Books</p>
                <p className="text-2xl font-bold text-secondary-800">{books.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Total Copies</p>
                <p className="text-2xl font-bold text-secondary-800">
                  {books.reduce((sum, book) => sum + book.quantity, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Available</p>
                <p className="text-2xl font-bold text-secondary-800">
                  {books.reduce((sum, book) => sum + book.available, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Categories</p>
                <p className="text-2xl font-bold text-secondary-800">
                  {[...new Set(books.map(book => book.category))].length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="bg-white rounded-2xl shadow-large p-6 mb-8 border border-secondary-100"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by book name, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-secondary-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Books Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-large overflow-hidden border border-secondary-100"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Sr. No
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredBooks.map((book, index) => (
                  <motion.tr
                    key={book.id}
                    variants={itemVariants}
                    className="hover:bg-secondary-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-secondary-800 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-secondary-800">{book.name}</p>
                        <p className="text-sm text-secondary-600">{book.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary-600">
                      {book.author}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-secondary-100 px-2 py-1 rounded">
                        {book.isbn}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-secondary-800 font-medium">
                          {book.available}/{book.quantity}
                        </span>
                        <div className="w-16 h-2 bg-secondary-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              book.available === 0 ? 'bg-red-500' : 
                              book.available < book.quantity / 2 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(book.available / book.quantity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(book.status)}`}>
                        {getStatusText(book.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-600 text-lg">No books found</p>
              <p className="text-secondary-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ViewAllBooks;
