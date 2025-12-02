document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      F_name: document.getElementById("fname").value,
      L_name: document.getElementById("lname").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();

  if (data.success) {
    alert("Account created!");
    window.location = "/login.html";
  } else {
    alert(data.error || "Signup failed.");
  }
});
