<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-3">Doctor Rating Finder</h1>
    </div>
    <div class="container">
      <form method=get v-on:submit.prevent="getData()">
        <label>Please enter Doctor Name</label>
        <input class="form-control" v-model="doctor" placeholder="Doctor Name"><br>
        <label>Specialty</label>
        <input class="form-control" v-model="specialty" placeholder="Specialty"><br>
        <label>City</label>
        <input class="form-control" v-model="city" placeholder="City"><br>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="healthgrades">
          Healthgrades
        </label>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="vitals">
          Vitals (requires specialty)
        </label>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="ratemds">
          Ratemds
        </label>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="yelp">
          Yelp (requires City)
        </label>
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" v-model="places">
          Places
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
      specialty: '',
      city: '',
      values: '',
      healthgrades: false,
      vitals: false,
      ratemds: false,
      yelp: false,
      places: false,
    }
  },
  methods: {
    getData: function() {
      axios.get('/doctorapi', {
        params: {
          doctor: this.doctor,
          specialty: this.specialty,
          city: this.city,
          healthgrades: this.healthgrades,
          vitals: this.vitals,
          ratemds: this.ratemds,
          yelp: this.yelp,
          places: this.places,
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