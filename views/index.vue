<template>
  <div>
    <h1>Hello World</h1>
    <form method=put v-on:submit.prevent="">
      <input v-model="doctor" placeholder="doctor Name">
      <input type=submit value=Submit>
    </form>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      doctor: '',
    }
  }
}
</script>

<style lang="css">
</style>