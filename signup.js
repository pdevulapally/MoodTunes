// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAmi6ovITMP8HtNQFLTHhVYSGkUwh0Jzw",
    authDomain: "moodflix-682e5.firebaseapp.com",
    projectId: "moodflix-682e5",
    storageBucket: "moodflix-682e5.firebasestorage.app",
    messagingSenderId: "593455524793",
    appId: "1:593455524793:web:d11a968c4328256db32468",
    measurementId: "G-NKP0TQRKZG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const signupForm = document.getElementById("signupForm");
const messageArea = document.getElementById("messageArea");

// Handle Sign-Up Form Submission
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const displayName = document.getElementById("displayName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Create User with Email and Password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update Display Name
        await updateProfile(userCredential.user, { displayName });

        // Redirect to Login or Homepage
        window.location.href = "login.html"; // Redirect after successful sign-up
    } catch (error) {
        // Display Error Message
        messageArea.textContent = error.message;
        messageArea.classList.add("visible");
    }
});
