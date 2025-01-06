
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3kLD8f1yV-iTTh_a7oinQvDbMjnbwak4",
  authDomain: "quiz-app-3a668.firebaseapp.com",
  projectId: "quiz-app-3a668",
  storageBucket: "quiz-app-3a668.firebasestorage.app",
  messagingSenderId: "1071749583255",
  appId: "1:1071749583255:web:02ea76f46053372776f4d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Registration Function
window.signup = async () => {
  const email = document.getElementById('id-username').value;
  const password = document.getElementById('id-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      createdAt: new Date()
    });

    alert("Registration successful!");
    window.location.href = "index.html"; // Redirect to login page
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

// Login Function
window.loginHandler = async () => {
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "guideance.html"; // Redirect to guideance page
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};
window.ok = () => {
    try {
      // Redirect to the quiz page
      window.location.href = "quiz.html";
    } catch (error) {
      // Display an error message in an alert box
      alert(`Error: ${error.message}`);
    }
  };

// Submit Quiz and Save Score
window.submit = async () => {
    let score = 0;
  
    // Calculate score
    const question1 = document.querySelector('input[name="ques-1"]:checked');
    const question2 = document.querySelector('input[name="ques-2"]:checked');
    const question3 = document.querySelector('input[name="ques-3"]:checked');
  
    if (question1 && question1.value === "Hyper Text Markup Language") {
      score++;
    }
    if (question2 && question2.value === "Cascading Style Sheets") {
      score++;
    }
    if (question3 && question3.value === "4") {
      score++;
    }
  
    // Display result
    const resultText = document.getElementById("result-text");
    resultText.innerHTML = `You scored ${score} out of 3.`;
  
    const resultDiv = document.querySelector(".result");
    resultDiv.style.display = "block";
  
    // Disable quiz options
    const quizOptions = document.querySelectorAll('input[type="radio"]');
    quizOptions.forEach((option) => (option.disabled = true));
  
    const submitButton = document.querySelector(".submit");
    submitButton.disabled = true;
  
    // Save score to Firestore
    const user = auth.currentUser;
  
    if (user) {
      const userScore = {
        email: user.email,
        score: score,
        timestamp: new Date().toISOString()
      };
  
      try {
        const docRef = doc(db, "quiz_scores", `${user.uid}_${Date.now()}`); // Use unique document ID
        await setDoc(docRef, userScore);
        alert("Score saved successfully!");
      } catch (error) {
        console.error("Error saving score: ", error);
        alert("Failed to save score. Please try again.");
      }
    } else {
      alert("User is not logged in. Score cannot be saved.");
    }
  };
  

// Cancel Button Functionality
window.cancelHandler = () => {
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
};
