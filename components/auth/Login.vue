<template lang="pug">
  .container.mx-auto.mt-5.bg-white
    .container.h-screen.flex.justify-center.items-center
      .row.w-full.text-center
        .mb-5
          input.border-b(class="w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="email" :counter="40" type="text" placeholder="email")
        .mb-5
          input.border-b(class="w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="password" type="password" placeholder="password" autocomplete="on")
        .mb-5
          button.mr-4(class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" @click="login") Log In
        .error
          p.errors.text-red-500(v-if="error") {{ error }}
        .signup
          label 会員登録がまだの方はこちら　→　
          button(class="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded" @click="createUser") Create User
</template>

<script>
import { auth } from "/plugins/firebase.js";
import { db } from "/plugins/firebase.js";

export default {
  name: "login",
  data () {
    return {
      email: "",
      password: "",
      error: "",
    }
  },
  methods: {
    login () {
      const self = this;
      if (!(this.email && this.password)) {
        this.error = "入力を確認してください";
      } else {
        auth.signInWithEmailAndPassword(this.email, this.password).then((user) => {
          // ローカルストレージにuidを保持
          localStorage.setItem("uid", `${user.uid}`);
          self.$router.push("/home");
        })
        .catch((error) => { this.error = ((code) => {
          switch (code) {
            case "auth/wrong-password":　return "※パスワードが正しくありません";
            default:　return "※メールアドレスとパスワードをご確認ください";
          }
        })(error.code)})
      };
    },
    createUser () {
      this.$router.push('/auth/signup');
    },
  },
}
</script>