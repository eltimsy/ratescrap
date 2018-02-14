<template>
  <div class="text-center" style="padding:50px 0">
    <div class="h3">login</div>
    <div class="login-form-1">
      <div class="alert alert-danger" role="alert" v-if="errormessage">{{ errormessage }}</div>
      <form method=post v-on:submit.prevent="Login()" id="login-form" class="text-left">
        <div class="login-form-main-message"></div>
        <div class="main-login-form">
          <div class="login-group">
            <div class="form-group">
              <label for="lg_username" class="sr-only">Username</label>
              <input type="text" class="form-control" id="lg_username" name="username" placeholder="username" v-model="username">
            </div>
            <div class="form-group">
              <label for="lg_password" class="sr-only">Password</label>
              <input type="password" class="form-control" id="lg_password" name="password" placeholder="password" v-model="password">
            </div>
            <div class="form-group login-group-checkbox">
              <input type="checkbox" id="lg_remember" name="lg_remember">
              <label for="lg_remember">remember</label>
            </div>
          </div>
          <button type="submit" class="login-button"><i class="fa fa-chevron-right"></i></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      username: '',
      password: '',
      errormessage: '',
    }
  },
  methods: {
    Login: function() {
      axios.post('/login', {
        username: this.username,
        password: this.password,
      }).then(response => {
        if(response.data === "ok") {
          window.location.href = "/";
        }
      }).catch(error => {
        this.errormessage = error.response.data
      })
    }
  }
}
</script>

<style lang="css">
  body {
    background: #efefef;
    padding: 10px;
    font-family: 'Varela Round';
  }
  .login-form-1 {
    max-width: 300px;
    border-radius: 5px;
    display: inline-block;
  }
  .main-login-form {
    position: relative;
  }
  .login-form-1 .form-control {
    border: 0;
    box-shadow: 0 0 0;
    border-radius: 0;
    background: transparent;
    color: #555555;
    padding: 7px 0;
    font-weight: bold;
    height:auto;
  }
  .login-form-1 .form-control::-webkit-input-placeholder {
    color: #999999;
  }
  .login-form-1 .form-control:-moz-placeholder,
  .login-form-1 .form-control::-moz-placeholder,
  .login-form-1 .form-control:-ms-input-placeholder {
    color: #999999;
  }
  .login-form-1 .form-group {
    margin-bottom: 0;
    border-bottom: 2px solid #efefef;
    padding-right: 20px;
    position: relative;
  }
  .login-form-1 .form-group:last-child {
    border-bottom: 0;
  }
  .login-group {
    background: #ffffff;
    color: #999999;
    border-radius: 8px;
    padding: 10px 20px;
  }
  .login-group-checkbox {
    padding: 5px 0;
  }
  /*=== 5. Login Button ===*/
  .login-form-1 .login-button {
    position: absolute;
    right: -25px;
    top: 50%;
    background: #ffffff;
    color: #999999;
    padding: 11px 0;
    width: 50px;
    height: 50px;
    margin-top: -25px;
    border: 5px solid #efefef;
    border-radius: 50%;
    transition: all ease-in-out 500ms;
  }
  .login-form-1 .login-button:hover {
    color: #555555;
    transform: rotate(450deg);
  }
  .login-form-1 .login-button.clicked {
    color: #555555;
  }
  .login-form-1 .login-button.clicked:hover {
    transform: none;
  }
  .login-form-1 .login-button.clicked.success {
    color: #2ecc71;
  }
  .login-form-1 .login-button.clicked.error {
    color: #e74c3c;
  }
</style>