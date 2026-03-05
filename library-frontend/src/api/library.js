import api from './axios';

export const registerLibraryStaff = async (staffData) => {
    return await api.post('/library/register', staffData);
};

export const issueBookByLibrary = async (issueData) => {
    return await api.post('/library/issue-book', issueData);
};

export const returnBookByLibrary = async (returnData) => {
    return await api.post('/library/return-book', returnData);
};

export const collectFineByLibrary = async (fineData) => {
    return await api.post('/library/collect-fine', fineData);
};

export const getLibraryBooksIssued = async () => {
    return await api.get('/library/books-issued');
};

export const getLibraryBooksReturned = async () => {
    return await api.get('/library/books-returned');
};
