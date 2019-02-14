//guards
import { adminGuard, doctorGuard, userGuard } from './guards.js'

//not found component
import notFound from './components/user/notFound'

////admin components
import admin from './components/admin/admin'
import adminlogin from './components/admin/login'
import users from './components/admin/users'
import categories from './components/admin/categories'
import dashboard from './components/admin/dashboard'
import feedbacks from './components/admin/feedbacks'
import appointments from './components/admin/appointments'
import todayAppointments from './components/admin/todayAppointments'
import checkedAppointments from './components/admin/checkedAppointments'
import uncheckedAppointments from './components/admin/uncheckedAppointments'

//user components
import user from './components/user/user'
import home from './components/user/home'
import userlogin from './components/user/login'
import userRegister from './components/user/register'
import userProfile from './components/user/profile'
import specialist from './components/user/specialist'
import doctorPage from './components/user/doctor'
import upcoming from './components/user/upcoming'
import finished from './components/user/finished'

//doctor compenents
import doctor from './components/doctor/doctor'
import doctorLogin from './components/doctor/login'
import upcomingDoctor from './components/doctor/upcoming'
import finishedDoctor from './components/doctor/finished'
import todayDoctor from './components/doctor/today'


export const routes = [
    {
        path: '/404',
        component: notFound,
        name: 'notFound'
    },
    {
        path: '*',
        redirect: '/404'
    },
    ///////////////// admin routes ///////////////////
    {
        path: '/admin/login',
        component: adminlogin,
        beforeEnter: adminGuard,
        meta: { adminLogin: true },
        name: 'Adminlogin'
    },
    {
        path: '/admin',
        component: admin,
        children: [
            {
                path: '',
                redirect: { name: 'dashboard' },
            },
            {
                path: 'users',
                meta: { adminAuth: true },
                component: users,
                beforeEnter: adminGuard,
                name: 'users'
            },
            {
                path: 'categories',
                meta: { adminAuth: true },
                component: categories,
                beforeEnter: adminGuard,
                name: 'categories'
            },
            {
                path: 'feedbacks',
                meta: { adminAuth: true },
                component: feedbacks,
                beforeEnter: adminGuard,
                name: 'feedbacks'
            },
            {
                path: 'appointments',
                meta: { adminAuth: true },
                component: appointments,
                beforeEnter: adminGuard,
                name: 'appointments'
            },
            {
                path: 'appointments/today',
                meta: { adminAuth: true },
                component: todayAppointments,
                beforeEnter: adminGuard,
                name: 'TodayAppointments'
            },
            {
                path: 'appointments/checked',
                meta: { adminAuth: true },
                component: checkedAppointments,
                beforeEnter: adminGuard,
                name: 'CheckedAppointments'
            },
            {
                path: 'appointments/unchecked',
                meta: { adminAuth: true },
                component: uncheckedAppointments,
                beforeEnter: adminGuard,
                name: 'UncheckedAppointments'
            },
            {
                path: 'dasboard',
                meta: { adminAuth: true },
                component: dashboard,
                beforeEnter: adminGuard,
                name: 'dashboard'
            }
        ]
    },
    //////////////////////// user routes //////////////////////////////////
    {
        path: '/',
        component: user,
        children: [
            {
                path: '',
                component: home,
                name: 'home'
            },
            {
                path: '/specialist/:id',
                component: specialist,
                name: 'specialist'
            },
            {
                path: '/login',
                component: userlogin,
                name: 'Userlogin',
                beforeEnter: userGuard,
                meta: { userLogin: true },
            },
            {
                path: '/register',
                component: userRegister,
                name: 'Userregister',
                beforeEnter: userGuard,
                meta: { userLogin: true },
            },
            {
                path: '/profile',
                component: userProfile,
                name: 'userProfile',
                beforeEnter: userGuard,
                meta: { userAuth: true },
            },
            {
                path: '/doctor/:id/:name',
                component: doctorPage,
                name: 'doctor',
                beforeEnter: userGuard,
                meta: { userAuth: true },
            },
            {
                path: '/upcoming',
                component: upcoming,
                name: 'upcoming',
                beforeEnter: userGuard,
                meta: { userAuth: true },
            },
            {
                path: '/finished',
                component: finished,
                name: 'finished',
                beforeEnter: userGuard,
                meta: { userAuth: true },
            },
        ]
    },
    ///////////// doctor routes /////////////////
    {
        path: '/doctor',
        component: doctor,
        children: [
            {
                path: '',
                redirect: { name: 'doctorLogin' },
            },
            {
                path: 'login',
                component: doctorLogin,
                name: 'doctorLogin',
                beforeEnter: doctorGuard,
                meta: { doctorLogin: true },
            },
            {
                path: 'upcoming',
                component: upcomingDoctor,
                name: 'upcomingDoctor',
                beforeEnter: doctorGuard,
                meta: { doctorAuth: true },
            },
            {
                path: 'finished',
                component: finishedDoctor,
                name: 'finishedDoctor',
                beforeEnter: doctorGuard,
                meta: { doctorAuth: true },
            },
            {
                path: 'today',
                component: todayDoctor,
                name: 'todayDoctor',
                beforeEnter: doctorGuard,
                meta: { doctorAuth: true },
            },
        ]
    }
]