import axiosClient from './axiosClient';

const mSApi = {
    createMonitoringStation(data) {
        const url = '/monitoring-station/create';
        return axiosClient.post(url, data);
    },
    getMonitoringStation(data) {
        const url = '/monitoring-station/show';
        return axiosClient.post(url, data);
    },
    getMonitoringStationbySlug(slug) {
        const url = `/monitoring-station/show/${slug}`;
        return axiosClient.get(url);
    },
    updateMonitoringStation(data, slug) {
        const url = `/monitoring-station/update/${slug}`;
        return axiosClient.put(url, data);
    },
    deleteMonitoringStation(slug) {
        const url = `/monitoring-station/delete/${slug}`;
        return axiosClient.delete(url);
    },
    searchMonitoringStation(data) {
        const q = data.query.target.value;
        const url = `/monitoring-station/search?q=${q}`;
        return axiosClient.post(url, data);
    },
};

export default mSApi;
