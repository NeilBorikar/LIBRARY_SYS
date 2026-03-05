import api from './axios';

export const registerStaff = async (staffData) => {
    return await api.post('/staff/register', staffData);
};

export const getStaffDashboard = async (empId) => {
    return await api.get(`/staff/dashboard?emp_id=${empId}`);
};

export const getStaffBooksIssued = async (empId) => {
    return await api.get(`/staff/books-issued?emp_id=${empId}`);
};

export const getStaffBooksReturned = async (empId) => {
    return await api.get(`/staff/books-returned?emp_id=${empId}`);
};

export const payStaffDeposit = async (empId, depositData) => {
    return await api.post(`/staff/deposit?emp_id=${empId}`, depositData);
};
