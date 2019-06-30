import firebase from "firebase";

    var config = {
      apiKey: "AIzaSyC2EyhsSk2YYHCezQKQqUGNu47dDk-lMbw",
      authDomain: "boredapp-11e1d.firebaseapp.com",
      databaseURL: "https://boredapp-11e1d.firebaseio.com",
      projectId: "boredapp-11e1d",
      storageBucket: "boredapp-11e1d.appspot.com",
      messagingSenderId: "865422442796",
      appId: "1:865422442796:web:d066b0a512c09e27"
    };

  const Firebase = firebase.initializeApp(config);

  export default Firebase;