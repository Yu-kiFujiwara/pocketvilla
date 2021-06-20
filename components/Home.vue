<template lang="pug">
  .container.mx-auto.mt-5.bg-white
    .container.h-screen.flex.justify-center.items-center
      .row.w-full.text-center
        span(@click="note") Note
</template>

<script>
export default {
  middleware: 'notAuthenticated',
  name: "home",
  data () {
    return {
    }
  },
  methods: {
    note () {
      this.$router.push("/note")
    }
  },
}
</script>