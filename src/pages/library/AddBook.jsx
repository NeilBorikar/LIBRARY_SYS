function AddBook() {
  return (
    <div className="add-book-page">
      <h2 className="page-title">Add New Book</h2>

      <form className="add-book-form">
        {/* Book Name */}
        <input
          type="text"
          placeholder="Book Name"
        />

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity"
        />

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
