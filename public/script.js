document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayCourses();
});

// document.addEventListener("DOMContentLoaded", async () => {
//   // Show the loader
//   document.getElementById("loader").style.display = "block";

//   try {
//     // Fetch and display courses
//     await fetchAndDisplayCourses();

//     // Hide the loader
//     document.getElementById("loader").style.display = "none";
//     // Show the container
//     document.getElementById("container").style.display = "block";
//   } catch (error) {
//     console.error("Error:", error);
//   }
// });

async function fetchAndDisplayCourses() {
  try {
    // Updated to use relative URL
    const response = await fetch("https://j3ba.onrender.com/api/courses");
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const courses = await response.json();
    const container = document.getElementById("container");
    container.innerHTML = ""; // Clear previous content

    courses.forEach((course) => {
      if (
        course.name !== "Succeed VE 2024" &&
        course.name !== "Dip of Information Technology (2405)"
      ) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.addEventListener("click", () => {
          window.location.href = `assessments.html?courseId=${course.id}`;
        });
        const title = document.createElement("h3");
        title.textContent = course.name;

        card.appendChild(title);
        container.appendChild(card);
      }
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function fetchAndDisplayAssessments(courseId) {
  try {
    // Updated to use relative URL
    const response = await fetch(
      `https://j3ba.onrender.com/api/courses/${courseId}/assignments`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch assessments");
    }
    const assessments = await response.json();
    const container = document.getElementById("assessment-container");
    container.innerHTML = ""; // Clear previous content

    const filteredAssessments = assessments.filter((assessment) => {
      const dueDate = new Date(assessment.due_at);
      const timeDiff = dueDate.getTime() - new Date().getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysRemaining >= 0;
    });

    filteredAssessments.sort((a, b) => {
      const dateA = new Date(a.due_at);
      const dateB = new Date(b.due_at);
      return dateA - dateB;
    });

    filteredAssessments.forEach((assessment) => {
      const listItem = document.createElement("li");
      listItem.textContent = assessment.name;
      const dueDate = document.createElement("div");
      dueDate.classList.add("due-date");
      dueDate.innerHTML = formatDate(assessment.due_at);
      listItem.appendChild(dueDate);
      container.appendChild(listItem);
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${day}/${month}/${year} at ${hours}:${minutes}`;

  // Calculate time remaining
  const timeDiff = date.getTime() - new Date().getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  let colorClass = "";
  if (daysRemaining <= 7) {
    colorClass = "red";
  } else if (daysRemaining <= 14) {
    colorClass = "orange";
  } else {
    colorClass = "green";
  }

  return `Due: <span class="${colorClass}">${formattedDate}</span>`;
}
