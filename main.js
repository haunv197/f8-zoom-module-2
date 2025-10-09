import httpRequest from "./utils/httpRequest.js";

// handleXSS
function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");
    const authModal = document.getElementById("authModal");
    const modalClose = document.getElementById("modalClose");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");

    // Function to show signup form
    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    // Function to show login form
    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    // Function to open modal
    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    // Open modal with Sign Up form when clicking Sign Up button
    signupBtn.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    // Open modal with Login form when clicking Login button
    loginBtn.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Close modal function
    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto"; // Restore scrolling
    }

    // Close modal when clicking close button
    modalClose.addEventListener("click", closeModal);

    // Close modal when clicking overlay (outside modal container)
    authModal.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn.addEventListener("click", function () {
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn.addEventListener("click", function () {
        showSignupForm();
    });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener("click", function () {
        // Close dropdown first
        userDropdown.classList.remove("show");

        console.log("Logout clicked");
        // TODO: Students will implement logout logic here
    });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
    // TODO: Implement other functionality here
    const artists = await httpRequest.get("artists")
    console.log('artists', artists)
});

// Register Functionality
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("#signupForm");
    const signupEmail = document.querySelector("#signupEmail");
    const signupPassword = document.querySelector("#signupPassword");
    const validEmail = signupForm.querySelector(".valid-email");
    const validPassword = signupForm.querySelector(".valid-password");
    const formGroupEmail = signupForm.querySelector(".form-group-email");
    const formGroupPassword = signupForm.querySelector(".form-group-password");

    signupForm
        .querySelector(".auth-form-content")
        .addEventListener("submit", async function (e) {
            e.preventDefault();
            formGroupEmail.classList.remove("invalid")
            formGroupPassword.classList.remove("invalid")

            const credentials = {
                email: signupEmail.value,
                password: signupPassword.value,
            }
            try {
                const { user, access_token } = await httpRequest.post(
                    "auth/register",
                    credentials
                )
                localStorage.setItem("access_token", access_token)
                localStorage.setItem("userCurrent", user)

            } catch (err) {
                const { error } = err.response;
                const detailsError = error.details?.[0];
                switch (error.code) {
                    case 'VALIDATION_ERROR':
                        if (detailsError && detailsError.field === 'email') {
                            formGroupEmail.classList.add("invalid")
                            validEmail.textContent = detailsError.message;
                        } else {
                            formGroupPassword.classList.add("invalid")
                            validPassword.textContent = detailsError.message;
                        }
                        break;
                    case 'EMAIL_EXISTS':
                        formGroupEmail.classList.add("invalid")
                        validEmail.textContent = error.message;
                        break;
                }
            }
        })
})


// Get User Functionality
document.addEventListener("DOMContentLoaded", async function () {
    const mainHeader = document.querySelector(".main-header");
    const authorButtons = mainHeader.querySelector(".auth-buttons");
    const userMenu = mainHeader.querySelector(".user-menu");
    const userAvatarImg = mainHeader.querySelector(".user-avatar img")

    try {
        const { user, stats } = await httpRequest.get("users/me");
        userMenu.classList.add("show");
        authorButtons.classList.remove("show");
        userAvatarImg.src = user.avatar_url;

    } catch (err) {
        authorButtons.classList.add("show");
    }
})
