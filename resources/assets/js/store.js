export default {
    state: {
        welcomeMessage: "hello"
    },
    mutations: {},
    getters: {
        welcome(state) {
            return state.welcomeMessage;
        }
    },
    actions: {}
};