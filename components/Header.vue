<template lang="pug">
  div.bg-white
    .mx-auto.flex.justify-between.text-2xl.p-3
      .text-left
        button
          svg.h-6.w-6.fill-current(viewBox="0 0 24 24")
            path(d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z")
      .text-center
        button(@click="root") pocket villa
      .text-right.text-sm
        font-awesome-icon.fa-2x(icon="user" @click="login")
</template>

<script>
export default {
  name: "Header",
  methods: {
    root () {
      this.$router.push('/');
    },
    login () {
      this.$router.push('/auth/login');
    }
  }
}
</script>