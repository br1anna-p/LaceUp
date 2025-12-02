document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();

  if (res.ok) {
    // Login successful
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location = "/";
  } else {
    alert("Invalid login");
  }
});
