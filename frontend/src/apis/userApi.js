import axiosClient from './axiosClient';

const userApi = {
    register(data) {
        const url = '/user/create';
        return axiosClient.post(url, data);
    },
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
    updatePassword(email, password) {
        const url = '/auth/update-password';
        return axiosClient.patch(url, { email, password });
    },
    show() {
        const url = '/user/show';
        return axiosClient.get(url);
    },
    showOne(email) {
        const url = `/user/show/${email}`;
        return axiosClient.get(url);
    },
    update(data, email) {
        const url = `/user/update/${email}`;
        return axiosClient.put(url, data);
    },
    delete(email) {
        const url = `/user/delete/${email}`;
        return axiosClient.delete(url);
    },
    search(q) {
        const params = q.target.value;
        const url = `/user/search?q=${params}`;
        return axiosClient.get(url);
    },
};

export default userApi;
