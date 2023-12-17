import axiosClient from './axiosClient';

const userApi = {
    login(email, password) {
        const url = '/auth/login';
        return axiosClient.post(url, { email, password }).then((res) => {
            console.log(res);
            if (res.status) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                localStorage.setItem('role', res.role);
            }
            return res;
        });
    },
    // logout() {
    //     const url = '/auth/logout';
    //     return axiosClient.get(url);
    // },
    updatePassword(email, password) {
        const url = '/auth/update-password';
        return axiosClient.patch(url, { email, password }).then((res) => {
            console.log(res);
            if (res.status === 'success') {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
            }
            return res;
        });
    },
    show() {
        const url = '/user/show';
        return axiosClient.get(url);
    },
    showOne(email) {
        const url = `/user/show/${email}`;
        return axiosClient.get(url);
    },
    update(data, id) {
        const url = `/user/update/${id}`;
        return axiosClient.put(url, data);
    },
    delete(email) {
        const url = `/user/delete/${email}`;
        return axiosClient.delete(url);
    },
    search(q) {
        const params = { q };
        const url = '/user/search';
        return axiosClient.get(url, { params });
    },
};

export default userApi;
