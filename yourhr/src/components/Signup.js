import React, { useState } from 'react';
import axios from 'axios'
function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualifications: '',
    preferences: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
      console.log(formData[key])
    }
    // Add your API call here to submit the form
    console.log(formData);
    const result = await axios.post('http://localhost:5000/signup',formData,{
      headers: {
        "Content-Type": "multipart/form-data"
      },
    })
    console.log(result);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup for YourHR</h2>
        
        <label className="block mb-4">
          <span className="text-gray-700">Name</span>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Qualifications</span>
          <input
            name="qualifications"
            type="text"
            value={formData.qualifications}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Preferences</span>
          <input
            name="preferences"
            type="text"
            value={formData.preferences}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700">Resume</span>
          <input
            name="resume"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
