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
    const toggleMessage = document.getElementById('toggleMessage'); // Get the toggle message element
  
    if (isLoginMode) {
      fullNameField.style.display = 'none';
      registerButton.style.display = 'none';
      loginButton.style.display = 'block';
      toggleMessage.textContent = "Not yet signed up? Register now"; // Change the text for login mode
    } else {
      fullNameField.style.display = 'block';
      loginButton.style.display = 'none';
      registerButton.style.display = 'block';
      toggleMessage.textContent = "Already have an account? Login here"; // Change the text for registration mode
    }
  }
  
// Set up our register function
function register() {
  // Get all our input fields
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;
  full_name = document.getElementById('full_name').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
    // Don't continue running the code
  }
  if (!isLoginMode && !validate_field(full_name)) {
    alert('Full Name is Outta Line!!');
    return;
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User data
      var user_data = {
        email: email,
        full_name: full_name,
        last_login: Date.now()
      };

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data);

      // Redirect to home.html after successful registration
      window.location.href = 'home.html';
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;

      alert(error_message);
    });
}

// Set up our login function
function login() {
  // Get all our input fields
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User data
      var user_data = {
        last_login: Date.now()
      };

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data);

      // Redirect to home.html after successful login
      window.location.href = 'home.html';
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;

      alert(error_message);
    });
}

// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    // Email is good
    return true;
  } else {
    // Email is not good
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password.length < 6) {
    return false;
  } else {
    return true;
  }
}

function validate_field(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}

// Initialize the page with the login mode (full name hidden)
toggleRegistration();