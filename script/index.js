const signIn = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username, password);
  if (username === "admin" && password === "admin123") {
    window.location.href = "index.html";
  } else {
    alert("Invalid username or password");
  }
};

// total issues
const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
fetch(api)
  .then((response) => response.json())
  .then((data) => {
    console.log(data.data);
  });

const total = () => {
  const totalIssues = document.getElementById("total-issues");
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      const count = data.data.length;
      totalIssues.textContent = `${count} Issues`;
    });
};
total();

// card design
const issueContainer = document.getElementById("issue-container");
fetch(api)
  .then((response) => response.json())
  .then((data) => {
    const issues = data.data;

    issues.forEach((issue) => {
      const statusImg =
        issue.status === "open"
          ? "./assets/Open-Status.png"
          : "./assets/Closed-Status.png";
      const borderColor =
        issue.status === "open" ? "border-[#00A96E]" : "border-[#8250df]";
      const card = document.createElement("div");
      card.innerHTML = `
      <label for="my_modal_6" class="cursor-pointer">
        <div class="card w-60 h-[300px] bg-base-100 shadow-md border-t-3 ${borderColor} hover:shadow-lg transition-shadow">
          <div>
            <div class="flex justify-between items-center p-4">
              <span>
              <img src="${statusImg}" alt="${issue.status}" /></span>
              <div class="px-4 rounded-2xl ${getPriorityStyles(issue.priority)}">
                  <span class="text-xs font-medium uppercase">${issue.priority}</span>
              </div>
            </div>

            <div class="flex justify-between px-4">
              <h2 class="text-sm font-semibold text-left">
                ${issue.title}
              </h2>
            </div>

            <p class="text-xs py-2 px-4 text-gray-500 text-left">
              ${issue.description}
            </p>

            <div class="px-4 py-3 flex flex-wrap gap-1">
              ${issue.labels
                .map(
                  (label) => `
              <div class="border ${getLabelStyle(label)} text-[10px] rounded-3xl px-2 py-1 flex items-center gap-1">
                ${label.toUpperCase()}
                </div>
                        `,
                )
                .join("")}
    </div>

            <div class="border-t border-gray-100 mx-4"></div>

            <div class="px-4 py-3 text-xs text-gray-500 text-left">
              <h3>#${issue.id} by ${issue.author}</h3>
              <p class="pt-1">${issue.createdAt}</p>
            </div>
          </div>
        </div>
      `;
      issueContainer.appendChild(card);
    });
  });
const getPriorityStyles = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-600";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-blue-100 text-blue-600";
  }
};
const getLabelStyle = (label) => {
  const l = label.toLowerCase();
  if (l.includes("bug")) return "bg-red-50 text-red-500 border-red-100";
  if (l.includes("enhancement"))
    return "bg-green-50 text-green-500 border-green-100";
  if (l.includes("help"))
    return "bg-yellow-50 text-yellow-600 border-yellow-100";
  if (l.includes("good first issue"))
    return "bg-purple-50 text-purple-600 border-purple-100";
  return "bg-gray-50 text-gray-500 border-gray-100";
};
