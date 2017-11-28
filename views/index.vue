<template>
  <div>
    <h1>Rate Scrapping Fun</h1>
    <form method=get v-on:submit.prevent="getData()">
      <input v-model="doctor" placeholder="doctor Name">
      <input type=submit value=Submit>
    </form>
    <div>
      {{ this.values.doctor }}
    </div>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      doctor: '',
      values: '',
    }
  },
  methods: {
    getData: function() {
      axios.get('/doctorapi', {
        params: {
          doctor: this.doctor
        }
      }).then(response => {
        this.values = response.data;
        console.log(response.data)
      })
    }
  }
}
</script>

<style lang="css">
</style>