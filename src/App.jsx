// App.jsx
import React, { useState, useEffect } from "react";
import { debounce } from "lodash";

import Records from "./Components/Records";
import Pagination from "./Components/Pagination";
import "./app.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [allRecords, setAllRecords] = useState([]);
  const [editedRecords, setEditedRecords] = useState([]);
  const recordsPerPage = 10;

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => {
        // Sort the records by the id field
        const sortedRecords = data.sort((a, b) => a.id - b.id);
        setAllRecords(sortedRecords);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
      });
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  // Combine original and edited records
  const originalRecordsWithoutEdited = allRecords.filter(
    (originalRecord) =>
      !editedRecords.some(
        (editedRecord) => editedRecord.id === originalRecord.id
      )
  );

  // Combine original records without edited and edited records
  const allRecordsCombined = [
    ...originalRecordsWithoutEdited,
    ...editedRecords,
  ].sort((a, b) => a.id - b.id);

  // Filter records based on the search term for both original and edited records
  const filteredRecords = allRecordsCombined.filter((record) => {
    const searchableProperties = Object.values(record).join(" ").toLowerCase();
    const includesSearchTerm = searchableProperties.includes(
      searchTerm.toLowerCase()
    );

    return includesSearchTerm;
  });

  const startIndex = Math.min(
    (currentPage - 1) * recordsPerPage,
    filteredRecords.length
  );
  const endIndex = Math.min(
    startIndex + recordsPerPage,
    filteredRecords.length
  );
  const currentRecords =
    searchTerm.length > 0
      ? filteredRecords.slice(0, recordsPerPage)
      : filteredRecords.slice(startIndex, endIndex);

  const handlePageChanged = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page when performing a new search
  };
  const handleEdit = (record) => {
    setEditedRecords((prevEditedRecords) => [
      ...prevEditedRecords.filter((prevRecord) => prevRecord.id !== record.id),
      record,
    ]);
  };

  return (
    <div className="app">
      <div className="Search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-icon"
        />
      </div>
      <Records data={currentRecords} onEdit={handleEdit} />
      <div className="pagination">
        <Pagination
          totalRecords={filteredRecords.length}
          recordsPerPage={recordsPerPage}
          onPageChanged={handlePageChanged}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredRecords.length / recordsPerPage)}
        />
      </div>
    </div>
  );
};

export default App;
