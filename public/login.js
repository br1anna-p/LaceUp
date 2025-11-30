document.getElementById("loginForm").addEventListener("submit", async (e) => {
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

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location = "/";
  } else {
    alert("Invalid login");
  }
});
