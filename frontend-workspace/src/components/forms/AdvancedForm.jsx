import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const AdvancedForm = ({ fields, onSubmit, submitLabel = 'Submit' }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-advanced">
      {fields.map((field, i) => (
        <motion.div 
          key={field.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="form-group-advanced"
        >
          {field.type === 'select' ? (
            <select {...register(field.name, field.validation)} className="form-input-advanced">
              <option value="">Select {field.label}</option>
              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea {...register(field.name, field.validation)} className="form-input-advanced" rows={field.rows || 4} placeholder=" " />
          ) : (
            <input type={field.type || 'text'} {...register(field.name, field.validation)} className="form-input-advanced" placeholder=" " />
          )}
          <label className="form-label-advanced">{field.label}</label>
          {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>}
        </motion.div>
      ))}
      <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50">
        {isSubmitting ? 'Processing...' : submitLabel}
      </button>
    </form>
  );
};
export default AdvancedForm;
