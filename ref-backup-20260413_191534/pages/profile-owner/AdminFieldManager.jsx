import React from "react";
/* eslint-disable no-unused-vars */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../../services/api';

const AdminFieldManager = () => {
  const [fields, setFields] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newField, setNewField] = useState({
    fieldName: '',
    fieldType: 'text',
    fieldLabel: '',
    placeholder: '',
    section: 'general',
    hierarchy: 0,
    isRequired: false,
    isSearchable: false,
    options: []
  });

  useEffect(() => {
    loadFields();
    loadSuggestions();
  }, []);

  const loadFields = async () => {
    try {
      const response = await api.get('/profile-fields/fields/active');
      setFields(response.data.fields);
    } catch (error) {
      console.error('Error loading fields:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await api.get('/profile-fields/admin/fields/suggestions');
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleCreateField = async () => {
    try {
      await api.post('/profile-fields/admin/fields', newField);
      setShowCreateModal(false);
      setNewField({
        fieldName: '',
        fieldType: 'text',
        fieldLabel: '',
        placeholder: '',
        section: 'general',
        hierarchy: 0,
        isRequired: false,
        isSearchable: false,
        options: []
      });
      loadFields();
      alert('Field created successfully!');
    } catch (error) {
      console.error('Error creating field:', error);
      alert('Error creating field. Please try again.');
    }
  };

  const handleUpdateSuggestion = async (suggestionId, status, notes = '') => {
    try {
      await api.put(`/profile-fields/admin/fields/suggestions/${suggestionId}`, {
        status,
        adminNotes: notes
      });
      loadSuggestions();
      if (status === 'approved') {
        loadFields(); // Reload fields to show the newly created one
      }
      alert(`Suggestion ${status} successfully!`);
    } catch (error) {
      console.error('Error updating suggestion:', error);
      alert('Error updating suggestion. Please try again.');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedFields = Array.from(fields);
    const [movedField] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, movedField);

    // Update hierarchy based on new order
    const hierarchyUpdates = reorderedFields.map((field, index) => ({
      id: field.id,
      hierarchy: index
    }));

    try {
      await api.put('/profile-fields/admin/fields/hierarchy/update', {
        fields: hierarchyUpdates
      });
      setFields(reorderedFields);
    } catch (error) {
      console.error('Error updating hierarchy:', error);
    }
  };

  const sections = ['general', 'education', 'experience', 'skills', 'certifications', 'custom'];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Manage Profile Fields</h4>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create New Field
              </button>
            </div>
            <div className="card-body">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {fields.map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card mb-2"
                            >
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">{field.fieldLabel}</h6>
                                    <small className="text-muted">
                                      {field.fieldType} • {field.section} • 
                                      {field.isSearchable && ' 🔍 Searchable'}
                                      {field.isRequired && ' • Required'}
                                    </small>
                                  </div>
                                  <div>
                                    <button
                                      className="btn btn-sm btn-outline-secondary me-2"
                                      onClick={() => setEditingField(field)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete this field?')) {
                                          try {
                                            await api.delete(`/profile-fields/admin/fields/${field.id}`);
                                            loadFields();
                                            alert('Field deleted successfully!');
                                          } catch (error) {
                                            console.error('Error deleting field:', error);
                                            alert('Error deleting field. Please try again.');
                                          }
                                        }
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Field Suggestions</h5>
            </div>
            <div className="card-body">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="border-bottom pb-2 mb-2">
                  <h6>{suggestion.fieldName}</h6>
                  <p className="small">{suggestion.description}</p>
                  <div className="d-flex justify-content-between">
                    <span className={`badge ${
                      suggestion.status === 'pending' ? 'bg-warning' :
                      suggestion.status === 'approved' ? 'bg-success' : 'bg-danger'
                    }`}>
                      {suggestion.status}
                    </span>
                    <div>
                      {suggestion.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleUpdateSuggestion(suggestion.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleUpdateSuggestion(suggestion.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Field Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Field</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Field Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newField.fieldName}
                        onChange={(e) => setNewField(prev => ({
                          ...prev,
                          fieldName: e.target.value,
                          fieldLabel: e.target.value // Auto-fill label
                        }))}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Field Type</label>
                      <select
                        className="form-control"
                        value={newField.fieldType}
                        onChange={(e) => setNewField(prev => ({
                          ...prev,
                          fieldType: e.target.value
                        }))}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                        <option value="textarea">Text Area</option>
                        <option value="date">Date</option>
                        <option value="boolean">Yes/No</option>
                        <option value="file">File Upload</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Field Label</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newField.fieldLabel}
                    onChange={(e) => setNewField(prev => ({
                      ...prev,
                      fieldLabel: e.target.value
                    }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <select
                    className="form-control"
                    value={newField.section}
                    onChange={(e) => setNewField(prev => ({
                      ...prev,
                      section: e.target.value
                    }))}
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Placeholder</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newField.placeholder}
                    onChange={(e) => setNewField(prev => ({
                      ...prev,
                      placeholder: e.target.value
                    }))}
                  />
                </div>

                {newField.fieldType === 'select' && (
                  <div className="mb-3">
                    <label className="form-label">Options (one per line)</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      onChange={(e) => setNewField(prev => ({
                        ...prev,
                        options: e.target.value.split('\n').filter(opt => opt.trim())
                      }))}
                    />
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={newField.isRequired}
                        onChange={(e) => setNewField(prev => ({
                          ...prev,
                          isRequired: e.target.checked
                        }))}
                      />
                      <label className="form-check-label">Required Field</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={newField.isSearchable}
                        onChange={(e) => setNewField(prev => ({
                          ...prev,
                          isSearchable: e.target.checked
                        }))}
                      />
                      <label className="form-check-label">Searchable</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateField}
                >
                  Create Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFieldManager;