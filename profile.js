import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAmi6ovITMP8HtNQFLTHhVYSGkUwh0Jzw",
    authDomain: "moodflix-682e5.firebaseapp.com",
    projectId: "moodflix-682e5",
    storageBucket: "moodflix-682e5.firebasestorage.app",
    messagingSenderId: "593455524793",
    appId: "1:593455524793:web:d11a968c4328256db32468",
    measurementId: "G-NKP0TQRKZG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Profile elements
const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const logoutBtn = document.getElementById("logoutBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

// Verify user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in, populate profile data
        profileAvatar.src = user.photoURL || "https://via.placeholder.com/150";
        profileName.textContent = user.displayName || "Anonymous User";
        profileEmail.textContent = user.email || "No Email";
    } else {
        // Redirect to login page if user is not authenticated
        window.location.href = "login.html";
    }
});

// Logout functionality
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully.");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error during logout:", error.message);
    }
});

// Delete account functionality
deleteAccountBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
            const user = auth.currentUser;
            await deleteUser(user);
            alert("Account deleted successfully.");
            window.location.href = "signup.html";
        } catch (error) {
            console.error("Error deleting account:", error.message);
            alert("Failed to delete account. Please try again.");
        }
    }
});
