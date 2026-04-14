import React from "react";
/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import api from '../services/api';

const EnhancedProfileForm = () => {
  const { profileOwnerId } = useParams();
  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    fieldName: '',
    fieldType: 'text',
    description: '',
    suggestedOptions: []
  });

  useEffect(() => {
    loadFormData();
  }, [profileOwnerId]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      
      // Load active fields
      const fieldsResponse = await api.get('/profile-fields/fields/active');
      const fieldsData = fieldsResponse.data.fields;
      setFields(fieldsData);

      // Group fields by section
      const sectionsMap = {};
      fieldsData.forEach(field => {
        if (!sectionsMap[field.section]) {
          sectionsMap[field.section] = [];
        }
        sectionsMap[field.section].push(field);
      });
      
      setSections(Object.entries(sectionsMap));

      // Load existing field values
      if (profileOwnerId) {
        const valuesResponse = await api.get(`/profile-fields/profile-owners/${profileOwnerId}/fields`);
        const valuesMap = {};
        valuesResponse.data.fieldValues.forEach(item => {
          valuesMap[item.fieldId] = item.fieldValue;
        });
        setFieldValues(valuesMap);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const fieldValuesArray = Object.entries(fieldValues).map(([fieldId, value]) => ({
        fieldId,
        value
      }));

      await api.post(`/profile-fields/profile-owners/${profileOwnerId}/fields`, {
        fieldValues: fieldValuesArray
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSuggestField = async () => {
    try {
      await api.post(`/profile-fields/profile-owners/${profileOwnerId}/suggestions`, newSuggestion);
      
      alert('Field suggestion submitted successfully!');
      setShowSuggestionModal(false);
      setNewSuggestion({
        fieldName: '',
        fieldType: 'text',
        description: '',
        suggestedOptions: []
      });
    } catch (error) {
      console.error('Error suggesting field:', error);
      alert('Error submitting suggestion. Please try again.');
    }
  };

  const renderField = (field) => {
    const value = fieldValues[field.id] || '';

    switch (field.fieldType) {
      case 'text':
        return (
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <select
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'boolean':
        return (
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={value === 'true'}
              onChange={(e) => handleFieldChange(field.id, e.target.checked.toString())}
            />
            <label className="form-check-label">
              {field.fieldLabel}
            </label>
          </div>
        );
      
      case 'date':
        return (
          <input
            type="date"
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      
      case 'file':
        return (
          <input
            type="file"
            className="form-control"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // Handle file upload logic here
                handleFieldChange(field.id, file.name);
              }
            }}
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center">Loading form...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Enhanced Profile Form</h4>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowSuggestionModal(true)}
              >
                Suggest New Field
              </button>
            </div>
            <div className="card-body">
              {sections.map(([sectionName, sectionFields]) => (
                <div key={sectionName} className="mb-4">
                  <h5 className="text-capitalize border-bottom pb-2">
                    {sectionName} Section
                  </h5>
                  <div className="row">
                    {sectionFields.map(field => (
                      <div key={field.id} className="col-md-6 mb-3">
                        <label className="form-label">
                          {field.fieldLabel}
                          {field.isRequired && <span className="text-danger">*</span>}
                        </label>
                        {renderField(field)}
                        {field.placeholder && (
                          <div className="form-text">{field.placeholder}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Suggest New Field</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSuggestionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Field Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSuggestion.fieldName}
                    onChange={(e) => setNewSuggestion(prev => ({
                      ...prev,
                      fieldName: e.target.value
                    }))}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Field Type</label>
                  <select
                    className="form-control"
                    value={newSuggestion.fieldType}
                    onChange={(e) => setNewSuggestion(prev => ({
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
                
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newSuggestion.description}
                    onChange={(e) => setNewSuggestion(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSuggestionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSuggestField}
                >
                  Submit Suggestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProfileForm;