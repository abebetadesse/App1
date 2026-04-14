import React from "react";
/* eslint-disable no-unused-vars */
import EnhancedSearch from '../../components/EnhancedSearch';

const EnhancedSearchPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-header mb-4">
            <h1>Advanced Search</h1>
            <p className="text-muted">Find service providers using enhanced search filters</p>
          </div>
          <EnhancedSearch />
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchPage;