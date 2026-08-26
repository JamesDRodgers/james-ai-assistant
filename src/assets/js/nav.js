// Contact modal — shared by every page via partials/nav.njk

function showContactForm() {
  document.getElementById("contactModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeContactForm() {
  document.getElementById("contactModal").style.display = "none";
  document.body.style.overflow = "auto";
}

document.addEventListener("click", function (event) {
  const modal = document.getElementById("contactModal");
  if (event.target === modal) {
    closeContactForm();
  }
});
