<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-3">Doctor Rating Finder</h1>
    </div>
    <div class="container">
      <form method=get v-on:submit.prevent="getData()">
        <label>Please enter Doctor Name and Specialty</label>
        <input class="form-control" v-model="doctor" placeholder="Name + Specialty"><br>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="healthgrades">
          Healthgrades
        </label>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="vitals">
          Vitals
        </label>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="ratemds">
          Ratemds
        </label>
        <input class="btn btn-warning" type=submit value=Submit>
      </form>
      <br>
    </div>
    <div>
      <h1 class="display-4">List of Ratings</h1>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th>Doctor</th>
            <th>Rating</th>
            <th>Count</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in values">
            <td>{{ value.doctor }}</td>
            <td>{{ value.rating }}</td>
            <td>{{ value.total }}</td>
            <td>{{ value.url }}</td>
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
      healthgrades: false,
      vitals: false,
      ratemds: false,
    }
  },
  methods: {
    getData: function() {
      axios.get('/doctorapi', {
        params: {
          doctor: this.doctor,
          healthgrades: this.healthgrades,
          vitals: this.vitals,
          ratemds: this.ratemds,
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
  .form-check-label {
    padding-right: 1.25em;
  }
  .display-4 {
    text-align: center;
  }
</style>