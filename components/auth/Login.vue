<template lang="pug">
  .container.mx-auto.mt-5.bg-white
    .container.h-screen.flex.justify-center.items-center
      .row.w-full.text-center
        .mb-5
          input.border-b(class="w-3/4 lg:w-2/5 xl:w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="email" :counter="40" type="text" placeholder="email")
          p.ml-12.text-red-500(v-if="$v.email.$error") ※ メールアドレスを入力してください。
        .mb-5
          input.border-b(class="w-3/4 lg:w-2/5 xl:w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="password" type="password" placeholder="password" autocomplete="on")
          p.ml-12.text-red-500(v-if="$v.password.$error") ※ パスワードを入力してください。
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
const { required } = require('vuelidate/lib/validators');

export default {
  name: "login",
  data () {
    return {
      email: "",
      password: "",
      error: "",
    }
  },
  validations: {
    email: { required },
    password: { required },
  },
  methods: {
    login () {
      // validation
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const self = this;
      if (!(this.email && this.password)) {
        this.error = "入力を確認してください";
      } else {
        auth.signInWithEmailAndPassword(this.email, this.password).then((user) => {
          // TODO: ↓ userを取得し、email, name, idもstoreで保持する
          self.$store.dispatch("auth/gotUser", { uid: user.uid });
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