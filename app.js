var firebaseConfig = {
    apiKey: "AIzaSyBCQT4jYP6WEcSMYNMsF8wgAlOMidaHS4g",
    authDomain: "login-fef6e.firebaseapp.com",
    databaseURL: "https://login-fef6e-default-rtdb.firebaseio.com",
    projectId: "login-fef6e",
    storageBucket: "login-fef6e.appspot.com",
    messagingSenderId: "365869099274",
    appId: "1:365869099274:web:c9c03dbc4b1ceb4f30f2f3",
    measurementId: "G-9SN9TSYZY8"
  };
  
  firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Add a variable to track the current mode (login or registration)
let isLoginMode = true;

// Function to toggle between login and registration modes
function toggleRegistration() {
  isLoginMode = !isLoginMode;

  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const fullNameField = document.getElementById('full_name');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const toggleMessage = document.getElementById('toggleMessage');

  if (isLoginMode) {
    fullNameField.style.display = 'none';
    registerButton.style.display = 'none';
    loginButton.style.display = 'block';
    toggleMessage.textContent = "Not yet signed up? Register now";
  } else {
    fullNameField.style.display = 'block';
    loginButton.style.display = 'none';
    registerButton.style.display = 'block';
    toggleMessage.textContent = "Already have an account? Login here";
  }
}

// Set up our register function
function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('full_name').value;

  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is invalid.');
    return;
  }

  if (!isLoginMode && !validate_field(full_name)) {
    alert('Full Name is invalid.');
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      const user = auth.currentUser;

      const user_data = {
        email: email,
        full_name: full_name,
        last_login: Date.now()
      };

      const database_ref = database.ref();

      database_ref.child('users/' + user.uid).set(user_data)
        .then(function () {
          console.log("User registered and data saved to the database.");
          window.location.href = 'home.html';
        })
        .catch(function (error) {
          console.error("Error saving user data to the database:", error);
          alert("Error occurred while saving user data.");
        });
    })
    .catch(function (error) {
      console.error("Error registering user:", error);
      alert("Error occurred while registering user.");
    });
}

// Set up our login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is invalid.');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      const user = auth.currentUser;
      const user_data = {
        last_login: Date.now()
      };

      const database_ref = database.ref();

      database_ref.child('users/' + user.uid).update(user_data)
        .then(function () {
          console.log("User logged in and last login time updated in the database.");
          window.location.href = 'home.html';
        })
        .catch(function (error) {
          console.error("Error updating last login time in the database:", error);
          alert("Error occurred while updating last login time.");
        });
    })
    .catch(function (error) {
      console.error("Error logging in:", error);
      alert("Error occurred while logging in.");
    });
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}

function validate_field(field) {
  return field != null && field.length > 0;
}

// Initialize the page with the login mode (full name hidden)
toggleRegistration();