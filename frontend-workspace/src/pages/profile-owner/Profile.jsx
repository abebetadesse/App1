import React from "react";
/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const ProfileOwnerProfile = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const availabilityOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: '1_week', label: 'Within 1 week' },
    { value: '2_weeks', label: 'Within 2 weeks' },
    { value: '1_month', label: 'Within 1 month' }
  ];

  const serviceCategories = [
    'IT & Software Development',
    'Design & Creative',
    'Writing & Translation',
    'Marketing & Sales',
    'Administrative Support',
    'Engineering & Architecture',
    'Business & Consulting',
    'Education & Training'
  ];

  useEffect(() => {
    // Set initial form values
    setValue('firstName', 'John');
    setValue('lastName', 'Doe');
    setValue('serviceCategory', 'IT & Software Development');
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification('success', 'Profile updated successfully!');
    } catch (error) {
      addNotification('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Professional Profile</h4>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <small className="text-muted">Profile Completion</small>
                    <div className="progress" style={{ width: '100px', height: '8px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <small className="text-muted">65%</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Progress Steps */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="steps">
                    <div className={`step ${activeTab === 'basic' ? 'active' : ''}`}>
                      <div className="step-number">1</div>
                      <div className="step-label">Basic Info</div>
                    </div>
                    <div className={`step ${activeTab === 'professional' ? 'active' : ''}`}>
                      <div className="step-number">2</div>
                      <div className="step-label">Professional</div>
                    </div>
                    <div className={`step ${activeTab === 'pricing' ? 'active' : ''}`}>
                      <div className="step-number">3</div>
                      <div className="step-label">Pricing</div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Tab Navigation */}
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                      onClick={() => setActiveTab('basic')}
                    >
                      Basic Information
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === 'professional' ? 'active' : ''}`}
                      onClick={() => setActiveTab('professional')}
                    >
                      Professional Details
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
                      onClick={() => setActiveTab('pricing')}
                    >
                      Pricing & Availability
                    </button>
                  </li>
                </ul>

                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <div className="tab-content">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="firstName" className="form-label">First Name *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            id="firstName"
                            {...register('firstName', { required: 'First name is required' })}
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">{errors.firstName.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="lastName" className="form-label">Last Name *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            id="lastName"
                            {...register('lastName', { required: 'Last name is required' })}
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback">{errors.lastName.message}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                        id="phoneNumber"
                        {...register('phoneNumber', { 
                          required: 'Phone number is required'
                        })}
                      />
                      {errors.phoneNumber && (
                        <div className="invalid-feedback">{errors.phoneNumber.message}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="bio" className="form-label">Professional Bio</label>
                      <textarea
                        className="form-control"
                        id="bio"
                        rows="4"
                        {...register('bio')}
                        placeholder="Tell clients about your experience, skills, and what you can offer..."
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Professional Details Tab */}
                {activeTab === 'professional' && (
                  <div className="tab-content">
                    <div className="mb-3">
                      <label htmlFor="serviceCategory" className="form-label">Service Category *</label>
                      <select
                        className={`form-select ${errors.serviceCategory ? 'is-invalid' : ''}`}
                        id="serviceCategory"
                        {...register('serviceCategory', { required: 'Service category is required' })}
                      >
                        <option value="">Select a category</option>
                        {serviceCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.serviceCategory && (
                        <div className="invalid-feedback">{errors.serviceCategory.message}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="skills" className="form-label">Skills & Expertise *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.skills ? 'is-invalid' : ''}`}
                        id="skills"
                        {...register('skills', { required: 'Skills are required' })}
                        placeholder="e.g., JavaScript, React, Node.js, UI/UX Design"
                      />
                      {errors.skills && (
                        <div className="invalid-feedback">{errors.skills.message}</div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="experienceYears" className="form-label">Years of Experience *</label>
                          <input
                            type="number"
                            className={`form-control ${errors.experienceYears ? 'is-invalid' : ''}`}
                            id="experienceYears"
                            min="0"
                            max="50"
                            {...register('experienceYears', { 
                              required: 'Years of experience is required'
                            })}
                          />
                          {errors.experienceYears && (
                            <div className="invalid-feedback">{errors.experienceYears.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing & Availability Tab */}
                {activeTab === 'pricing' && (
                  <div className="tab-content">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="hourlyRate" className="form-label">Hourly Rate ($) *</label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              className={`form-control ${errors.hourlyRate ? 'is-invalid' : ''}`}
                              id="hourlyRate"
                              min="5"
                              step="5"
                              {...register('hourlyRate', { 
                                required: 'Hourly rate is required'
                              })}
                            />
                          </div>
                          {errors.hourlyRate && (
                            <div className="invalid-feedback">{errors.hourlyRate.message}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="availability" className="form-label">Availability *</label>
                      <select
                        className={`form-select ${errors.availability ? 'is-invalid' : ''}`}
                        id="availability"
                        {...register('availability', { required: 'Availability is required' })}
                      >
                        <option value="">Select availability</option>
                        {availabilityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.availability && (
                        <div className="invalid-feedback">{errors.availability.message}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex justify-content-between">
                      {activeTab !== 'basic' && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            const tabs = ['basic', 'professional', 'pricing'];
                            const currentIndex = tabs.indexOf(activeTab);
                            setActiveTab(tabs[currentIndex - 1]);
                          }}
                        >
                          Previous
                        </button>
                      )}
                      
                      {activeTab !== 'pricing' ? (
                        <button
                          type="button"
                          className="btn btn-primary ms-auto"
                          onClick={() => {
                            const tabs = ['basic', 'professional', 'pricing'];
                            const currentIndex = tabs.indexOf(activeTab);
                            setActiveTab(tabs[currentIndex + 1]);
                          }}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success ms-auto"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOwnerProfile;