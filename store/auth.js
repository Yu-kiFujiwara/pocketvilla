import { auth } from '~/plugins/firebase';

export const state = () => ({
  user: { id: "", uid: "", name: "", email: "" },
  status: ""
});

export const mutations = {
  setUser(state, user) {
    state.status = "loggedIn";
    state.user = user;
  },
  logout(state) {
    state.status = "loggedOut";
    state.user = {};
  }
};

export const getters = {
  isLoggedIn: (state) => {
    return state.status === "loggedIn";
  },
  getUsername: (state) => state.user.name,
  getUser: (state) => state.user
};

export const actions = {
  gotUser({ commit }, user) {
    commit("setUser", user);
  },
  logout({ commit }) {
    auth.signOut().then(() => { commit("logout"); });
  },
};