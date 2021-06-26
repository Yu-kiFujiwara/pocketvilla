<template lang="pug">
  .container.mx-auto
    .container.h-screen.flex.justify-center.items-center
      .row.w-full.text-center
        .mb-5
          input.border-b(class="w-3/4 lg:w-2/5 xl:w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="name" :counter="40" type="text" placeholder="name")
        .mb-5
          input.border-b(class="w-3/4 lg:w-2/5 xl:w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="email" :counter="40" type="email" placeholder="email")
        .mb-5
          input.border-b(class="w-3/4 lg:w-2/5 xl:w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="password" type="password" placeholder="password" autocomplete="on")
        .mb-5
          p.errors.text-red-500(v-if="error") {{ error }}
        .error
          button(class="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded" @click="createUser") Create User
        .login
          label 会員登録がお済みの方はこちら　→　
          button.mr-4(class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" @click="login") Log In
</template>

<script>
import { db } from "/plugins/firebase.js";
import { auth } from "/plugins/firebase.js";
// import { required } from 'Vuelidate';

export default {
  name: "signup",
  // validations: {
  //   name: { required },
  //   email: { required },
  //   password: { required },
  // },
  data () {
    return {
      name: "",
      email: "",
      password: "",
      error: "",
    }
  },
  methods: {
    async createUser () {
      const self = this;
      if (this.name && this.email && this.password) {
        auth.createUserWithEmailAndPassword(this.email, this.password).then((res) => {
          db.collection("users").add({ uid: res.user.uid, name: this.name, email: this.email, password: this.password }).then(docRef => {
            self.$store.dispatch("auth/gotUser", { id: docRef.id, uid: res.user.uid, name: this.name, email: this.email });
            localStorage.setItem("uid", `${docRef.uid}`);
            self.$router.push("/home");
          }).catch(error => { console.error("Error adding document: ", error) });
        })
        .catch((error) => { this.error = ((code) => {
          switch (code) {
            case "auth/email-already-in-use":　return "既にそのメールアドレスは使われています";
            case "auth/wrong-password":　return "※パスワードが正しくありません";
            case "auth/weak-password":　return "※パスワードは最低6文字以上にしてください";
            default:　return "※メールアドレスとパスワードをご確認ください";
          }
        })(error.code)})
      } else {
        this.error = "入力を確認してください";
      };
    },
    login () {
      this.$router.push('/auth/login');
    },
  },
}
</script>