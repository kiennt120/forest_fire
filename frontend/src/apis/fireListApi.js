import axiosClient from './axiosClient';
import dayjs from 'dayjs';

const fireListApi = {
    getFireList() {
        const url = '/fire-list/show';
        return axiosClient.get(url);
    },
    getFireListbyId(id) {
        const url = `/fire-list/show/${id}`;
        return axiosClient.get(url);
    },
    searchFireList(data) {
        const q = data.q;
        const from = data.from ? dayjs(data.from.$d).format('YYYY-MM-DD HH:mm:ss') : '2000/01/01';
        const to = data.to ? dayjs(data.to.$d).format('YYYY-MM-DD HH:mm:ss') : '2100/01/01';
        const url = `/fire-list/search?q=${q}&from=${from}&to=${to}`;
        return axiosClient.get(url);
    },
    searchFireListByTime(data) {
        const from = dayjs(data[0].$d).format('YYYY-MM-DD HH:mm:ss');
        const to = dayjs(data[1].$d).format('YYYY-MM-DD HH:mm:ss');
        const url = `/fire-list/searchByTime?from=${from}&to=${to}`;
        return axiosClient.get(url);
    },
};

export default fireListApi;
