<template>
  <div>
    <h1>Rate Scrapping Fun</h1>
    <form method=get v-on:submit.prevent="getData()">
      <label>Doctor Name</label>
      <input class="form-control" v-model="doctor" placeholder="doctor Name"><br>
      <input class="btn btn-warning" type=submit value=Submit>
    </form>
    <br>
    <div>
      <h3>Health Grades</h3>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th>Doctor</th>
            <th>Rating</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ this.values.doctor }}</td>
            <td>{{ this.values.rating }}</td>
            <td>{{ this.values.url }}</td>
          </tr>
        </tbody>
      </table>
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