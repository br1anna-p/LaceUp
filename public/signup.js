document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fname: document.getElementById("fname").value,
      lname: document.getElementById("lname").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();

  if (data.success) {
    alert("Account created!");
    window.location = "/login.html";
  } else {
    alert(data.error);
  }
});
