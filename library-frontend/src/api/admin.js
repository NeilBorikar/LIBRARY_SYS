import api from './axios';

export const getAdminDashboardMetrics = async () => {
    return await api.get('/admin/dashboard');
};

export const getAdminDailyReport = async (reportDate) => {
    return await api.get(`/admin/reports?report_date=${reportDate}`);
};
