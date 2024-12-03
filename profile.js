import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    deleteUser, 
    signOut,
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

// Firebase configuration
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

// DOM Elements - Adding null checks
const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const logoutBtn = document.getElementById("logoutBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const editBtns = document.querySelectorAll(".edit-btn");
const changeAvatarBtn = document.querySelector(".change-avatar-btn");
const burgerMenu = document.querySelector(".burger-menu");
const navLinks = document.querySelector(".nav-links");
const editModal = document.getElementById("editModal");
const passwordModal = document.getElementById("passwordModal");
const editProfileForm = document.getElementById("editProfileForm");
const changePasswordForm = document.getElementById("changePasswordForm");
const closeModalBtns = document.querySelectorAll(".close-modal");

// Mobile Navigation Toggle
if (burgerMenu && navLinks) {
    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close mobile menu when clicking a link
    navLinks.addEventListener("click", () => {
        burgerMenu.classList.remove("active");
        navLinks.classList.remove("active");
    });
}

// Verify user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (profileAvatar) profileAvatar.src = user.photoURL || "https://via.placeholder.com/150";
        if (profileName) profileName.textContent = user.displayName || "Anonymous User";
        if (profileEmail) profileEmail.textContent = user.email || "No Email";
    } else {
        window.location.href = "login.html";
    }
});

// Edit Profile Handlers
if (editBtns) {
    editBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const field = btn.dataset.field;
            const editField = document.getElementById("editField");
            if (editModal && editField) {
                const fieldLabel = editModal.querySelector("label");
                if (fieldLabel) {
                    fieldLabel.textContent = `Edit ${field.charAt(0).toUpperCase() + field.slice(1)}`;
                    editField.value = field === 'name' ? profileName.textContent : profileEmail.textContent;
                    editField.dataset.field = field;
                    editModal.style.display = "block";
                }
            }
        });
    });
}

// Edit Profile Form Submit
if (editProfileForm) {
    editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const editField = document.getElementById("editField");
        if (!editField) return;

        const field = editField.dataset.field;
        const newValue = editField.value;

        try {
            if (field === 'name') {
                await updateProfile(user, { displayName: newValue });
                if (profileName) profileName.textContent = newValue;
            } else if (field === 'email') {
                await updateEmail(user, newValue);
                if (profileEmail) profileEmail.textContent = newValue;
            }
            if (editModal) editModal.style.display = "none";
            alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
        } catch (error) {
            alert(`Error updating ${field}: ${error.message}`);
        }
    });
}

// Change Password Handler
if (changePasswordBtn && passwordModal) {
    changePasswordBtn.addEventListener("click", () => {
        passwordModal.style.display = "block";
    });
}

// Change Password Form Submit
if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const currentPassword = document.getElementById("currentPassword")?.value;
        const newPassword = document.getElementById("newPassword")?.value;
        const confirmPassword = document.getElementById("confirmPassword")?.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            
            if (passwordModal) {
                passwordModal.style.display = "none";
                changePasswordForm.reset();
            }
            alert("Password updated successfully!");
        } catch (error) {
            alert(`Error updating password: ${error.message}`);
        }
    });
}

// Change Avatar Handler
if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener("click", async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    alert("Avatar upload functionality will be implemented soon!");
                } catch (error) {
                    alert(`Error updating avatar: ${error.message}`);
                }
            }
        };
        
        input.click();
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully.");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    });
}

// Delete account functionality
if (deleteAccountBtn) {
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
}

// Close Modal Handlers
if (closeModalBtns) {
    closeModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (editModal) editModal.style.display = "none";
            if (passwordModal) passwordModal.style.display = "none";
        });
    });
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === editModal || e.target === passwordModal) {
        if (editModal) editModal.style.display = "none";
        if (passwordModal) passwordModal.style.display = "none";
    }
});
