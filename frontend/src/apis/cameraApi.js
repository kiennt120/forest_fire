import axiosClient from './axiosClient';

const cameraApi = {
    createCamera(data) {
        const url = '/camera/create';
        return axiosClient.post(url, data);
    },
    getCamera() {
        const url = '/camera/show';
        return axiosClient.get(url);
    },
    getCameraById(id) {
        const url = `/camera/show/${id}`;
        return axiosClient.get(url);
    },
    updateCamera(data, id) {
        const url = `/camera/update/${id}`;
        return axiosClient.put(url, data);
    },
    updateStatus(status, id) {
        const url = `/camera/update-status/${id}`;
        return axiosClient.put(url, { status });
    },
    deleteCamera(id) {
        const url = `/camera/delete/${id}`;
        return axiosClient.delete(url);
    },
    searchCamera(data) {
        const q = data.query.target.value;
        const url = `/camera/search?q=${q}`;
        return axiosClient.get(url, data);
    },
};

export default cameraApi;
