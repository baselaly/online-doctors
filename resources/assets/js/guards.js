//*****admin guards */
function checkAdmin() {
    var token = localStorage.getItem('token');
    return new Promise(resolve => {
        if (token) {
            axios
                .get("/api/admin/check", {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                .then(response => {
                    resolve(true);
                })
                .catch(error => {
                    resolve(false);
                });
        } else {
            resolve(false);
        }
    })
}

export async function adminGuard(to, from, next) {
    if (to.meta.adminAuth) {
        var user = await checkAdmin();
        user ? next() : next("/admin/login");

    } else if (to.meta.adminLogin) {
        var user = await checkAdmin();
        user ? next("/admin") : next();
    }
}

/************user guards */
function checkUser() {
    var token = localStorage.getItem('token');
    return new Promise(resolve => {
        if (token) {
            axios
                .get("/api/user/check", {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                .then(response => {
                    resolve(true);
                })
                .catch(error => {
                    resolve(false);
                });
        } else {
            resolve(false);
        }
    })
}

export async function userGuard(to, from, next) {
    if (to.meta.userAuth) {
        var user = await checkUser();
        user ? next() : next("/login");

    } else if (to.meta.userLogin) {
        var user = await checkUser();
        user ? next("/") : next();
    }
}

///// doctor guards //////
function checkDoctor() {
    var token = localStorage.getItem('token');
    return new Promise(resolve => {
        if (token) {
            axios
                .get("/api/doctor/check", {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                .then(response => {
                    resolve(true);
                })
                .catch(error => {
                    resolve(false);
                });
        } else {
            resolve(false);
        }
    })
}

export async function doctorGuard(to, from, next) {
    if (to.meta.doctorAuth) {
        var user = await checkDoctor();
        user ? next() : next("/doctor/login");

    } else if (to.meta.doctorLogin) {
        var user = await checkDoctor();
        user ? next("/doctor/today") : next();
    }
}