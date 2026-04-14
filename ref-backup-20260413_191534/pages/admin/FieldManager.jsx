import React from "react";
/* eslint-disable no-unused-vars */
import AdminFieldManager from '../../components/AdminFieldManager';

const FieldManagerPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-header mb-4">
            <h1>Field Management</h1>
            <p className="text-muted">Manage dynamic profile fields and user suggestions</p>
          </div>
          <AdminFieldManager />
        </div>
      </div>
    </div>
  );
};

export default FieldManagerPage;