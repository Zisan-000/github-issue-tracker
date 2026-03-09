const signIn = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "admin" && password === "admin123") {
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password");
  }
};

let allIssuesData = [];
let currentFilter = "all";
let filterTimeout;

const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const issueContainer = document.getElementById("issue-container");
const totalIssuesElement = document.getElementById("total-issues");
const searchInput = document.getElementById("searchInput");

const btnAll = document.getElementById("btn-all");
const btnOpen = document.getElementById("btn-open");
const btnClosed = document.getElementById("btn-closed");

issueContainer.innerHTML =
  '<div class="col-span-full w-full flex justify-center items-center py-20"><span class="loading loading-bars loading-xl text-[#4A00FF]"></span></div>';

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    allIssuesData = data.data;
    setActiveButton(btnAll);
    applyFilters();
  });

const openIssueModal = (id) => {
  const modalBox = document.getElementById("dynamic-modal-content");

  modalBox.innerHTML = `
    <div class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg text-[#4A00FF]"></span>
    </div>
  `;

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then((response) => response.json())
    .then((data) => {
      const issue = data.data;

      const d = new Date(issue.createdAt);
      const formattedDate = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;

      let priorityBg = "bg-gray-500";
      if (issue.priority.toLowerCase() === "high") priorityBg = "bg-red-600";
      if (issue.priority.toLowerCase() === "medium")
        priorityBg = "bg-yellow-500";
      if (issue.priority.toLowerCase() === "low") priorityBg = "bg-green-500";

      const statusBg =
        issue.status.toLowerCase() === "open" ? "bg-[#00A96E]" : "bg-[#8250df]";

      const assigneeName = issue.assignee ? issue.assignee : "Unassigned";

      modalBox.innerHTML = `
        <h3 class="text-lg font-bold">${issue.title}</h3>
        
        <div class="flex items-center gap-2 py-2">
          <div class="p-1 text-center ${statusBg} rounded-3xl w-20 text-white text-sm capitalize">
            ${issue.status}
          </div>
          <p class="text-sm text-gray-500">• Opened by ${issue.author} •</p>
          <p class="text-sm text-gray-500">${formattedDate}</p>
        </div>

        <div class="py-3 flex flex-wrap gap-1">
          ${issue.labels
            .map(
              (label) => `
            <div class="border ${getLabelStyle(label)} text-[10px] rounded-3xl px-2 py-1 flex items-center gap-1 font-semibold">
              ${getLabelIcon(label)} ${label}
            </div>
          `,
            )
            .join("")}
        </div>

        <p class="py-4 text-gray-700 leading-relaxed">
          ${issue.description}
        </p>

        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-md mt-2">
          <div>
            <h1 class="text-gray-500 text-sm mb-1">Assignee:</h1>
            <p class="font-bold text-gray-900">${assigneeName}</p>
          </div>
          <div>
            <h1 class="text-gray-500 text-sm mb-1 text-right">Priority:</h1>
            <div class="px-4 py-1 ${priorityBg} rounded-2xl text-white inline-block">
              <span class="text-xs font-medium uppercase tracking-wider">${issue.priority}</span>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <label for="my_modal_6" class="btn bg-[#4A00FF] hover:bg-[#4A00FF]/90 text-white border-none px-8">Close</label>
        </div>
      `;
    });
};

function applyFilters() {
  issueContainer.innerHTML =
    '<div class="col-span-full w-full flex justify-center items-center py-20"><span class="loading loading-bars loading-xl text-[#4A00FF]"></span></div>';

  clearTimeout(filterTimeout);

  filterTimeout = setTimeout(() => {
    const searchTerm = searchInput ? searchInput.value.trim() : "";

    const fetchUrl =
      searchTerm !== ""
        ? `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchTerm}`
        : "https://phi-lab-server.vercel.app/api/v1/lab/issues";

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        const fetchedIssues = data.data || [];

        const finalFilteredIssues = fetchedIssues.filter((issue) => {
          return (
            currentFilter === "all" ||
            issue.status.toLowerCase() === currentFilter
          );
        });

        renderIssues(finalFilteredIssues);
      });
  });
}

function renderIssues(issues) {
  issueContainer.innerHTML = "";

  if (totalIssuesElement) {
    totalIssuesElement.textContent =
      issues.length === 1 ? "1 Issue" : `${issues.length} Issues`;
  }

  issues.forEach((issue) => {
    const statusImg =
      issue.status === "open"
        ? "../assets/open-status.png"
        : "../assets/closed-status.png";
    const borderTopColor =
      issue.status === "open" ? "border-t-[#00A96E]" : "border-t-[#8250df]";

    const card = document.createElement("div");
    card.innerHTML = `
      <label for="my_modal_6" class="cursor-pointer h-full block" onclick="openIssueModal(${issue.id})">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 border-t-4 ${borderTopColor} hover:shadow-md transition-all flex flex-col h-[340px]">
          
          <div class="flex justify-between items-start p-5">
            <img class="w-5 h-5 object-contain" src="${statusImg}" alt="${issue.status}" />
            <div class="px-3 py-1 rounded-full ${getPriorityStyles(issue.priority)}">
                <span class="text-[10px] font-bold tracking-wider uppercase">${issue.priority}</span>
            </div>
          </div>

          <div class="px-5">
            <h2 class="text-[15px] font-bold text-gray-900 leading-snug text-left line-clamp-2">
              ${issue.title}
            </h2>
          </div>

          <p class="text-xs mt-3 px-5 text-gray-500 text-left line-clamp-2 leading-relaxed">
            ${issue.description}
          </p>

          <div class="px-5 mt-4 flex flex-wrap gap-2">
            ${issue.labels
              .map(
                (label) => `
              <div class="border ${getLabelStyle(label)} text-[10px] font-semibold rounded-full px-2.5 py-1 flex items-center gap-1">
                ${getLabelIcon(label)} ${label.toUpperCase()}
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="mt-auto">
            <div class="border-t border-gray-100 mx-5"></div>
            <div class="px-5 py-4 flex flex-col gap-1 text-[11px] text-gray-400 text-left">
              <span class="font-medium text-gray-500">#${issue.id} by ${issue.author}</span>
              <span>${issue.createdAt}</span>
            </div>
          </div>

        </div>
      </label>
    `;
    issueContainer.appendChild(card);
  });
}

function setActiveButton(activeBtn) {
  if (!btnAll || !btnOpen || !btnClosed) return;

  [btnAll, btnOpen, btnClosed].forEach((btn) => {
    btn.className =
      "btn w-[120px] bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors";
  });

  activeBtn.className =
    "btn w-[120px] bg-[#4A00FF] text-white border border-transparent hover:bg-[#4A00FF]/90 transition-colors";
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (btnAll && btnOpen && btnClosed) {
  btnAll.addEventListener("click", () => {
    currentFilter = "all";
    setActiveButton(btnAll);
    applyFilters();
  });

  btnOpen.addEventListener("click", () => {
    currentFilter = "open";
    setActiveButton(btnOpen);
    applyFilters();
  });

  btnClosed.addEventListener("click", () => {
    currentFilter = "closed";
    setActiveButton(btnClosed);
    applyFilters();
  });
}

const getPriorityStyles = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-500";
    case "medium":
      return "bg-yellow-50 text-yellow-600";
    case "low":
      return "bg-gray-100 text-gray-500";
    default:
      return "bg-blue-50 text-blue-500";
  }
};

const getLabelStyle = (label) => {
  const l = label.toLowerCase();
  if (l.includes("bug")) return "text-red-500 border-red-200 bg-[#FEECEC]";
  if (l.includes("good first issue"))
    return "text-purple-500 border-purple-200 bg-[#FEECEC]";
  if (l.includes("help") || l.includes("wanted"))
    return "text-yellow-600 border-yellow-200 bg-[#FFF8DB]";
  if (l.includes("enhancement"))
    return "text-green-500 border-green-500 bg-[#BBF7D0]";
  return "text-gray-500 border-gray-200 bg-gray-100";
};

const getLabelIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("bug")) return `<i class="fa-solid fa-bug"></i>`;
  if (l.includes("good first issue"))
    return `<i class="fa-regular fa-thumbs-up"></i>`;
  if (l.includes("enhancement")) return `<i class="fa-regular fa-star"></i>`;
  if (l.includes("help") || l.includes("wanted"))
    return `<i class="fa-regular fa-life-ring"></i>`;
  return `<i class="fa-solid fa-align-right"></i>`;
};
