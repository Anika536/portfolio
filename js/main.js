(() => {
  const nav = document.getElementById("siteNav");
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = Array.from(document.querySelectorAll("nav a"));
  const revealNodes = document.querySelectorAll(".reveal");
  const sections = Array.from(document.querySelectorAll("main section"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const modalBackdrop = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModal");
  const statusTime = document.getElementById("localTime");
  const ctfButton = document.getElementById("runDiagnostic");
  const flagInput = document.getElementById("flagInput");
  const submitFlag = document.getElementById("submitFlag");
  const flagResult = document.getElementById("flagResult");
  const terminalToggle = document.getElementById("terminalToggle");
  const terminalPanel = document.getElementById("terminalPanel");
  const terminalClose = document.getElementById("terminalClose");

  const terminal = window.TerminalUI.init();

  function setLocalTime() {
    if (!statusTime) return;
    const now = new Date();
    statusTime.textContent = `Local Time: ${now.toLocaleString()}`;
  }

  function toggleMenu() {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  }

  function closeMenuIfMobile() {
    if (window.innerWidth <= 780) {
      menuBtn.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    }
  }

  function activateNavByScroll() {
    const top = window.scrollY + 140;
    let current = sections[0]?.id || "home";

    for (const section of sections) {
      if (top >= section.offsetTop) {
        current = section.id;
      }
    }

    navLinks.forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", target === current);
    });
  }

  function revealOnScroll() {
    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealNodes.forEach((node) => observer.observe(node));
  }

  function filterProjects(category) {
    projectCards.forEach((card) => {
      const groups = (card.dataset.category || "").split(" ");
      const show = category === "all" || groups.includes(category);
      card.style.display = show ? "block" : "none";
    });
  }

  function wireProjectFiltering() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.filter;
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        filterProjects(category);
      });
    });
  }

  const projectDetailMap = {
    portscanner: {
      title: "Port Scanner",
      objective: "Build a practical reconnaissance utility during a TCM Security capstone.",
      implementation: "Implemented scanning logic in Python to identify open ports and services.",
      tools: "Python",
      security: "Supports attack-surface mapping and service discovery.",
      result: "Improved hands-on networking and offensive-security workflow understanding.",
      link: ""
    },
    soho: {
      title: "SOHO Network Configuration",
      objective: "Design and configure a wired IT company network in an Akamai course project.",
      implementation: "Planned network layout and configured connectivity for business use.",
      tools: "Networking tools and configuration workflows",
      security: "Strengthens secure network design and operational networking fundamentals.",
      result: "Delivered a complete network setup project.",
      link: "https://url-shortener.me/6KQO"
    },
    edueval: {
      title: "NSTU EduEval System",
      objective: "Build a student feedback platform at NSTU.",
      implementation: "Developed the full stack using HTML, CSS, PHP, MySQL, and JavaScript.",
      tools: "HTML, CSS, PHP, MySQL, JavaScript",
      security: "Applied secure coding practices in web application development.",
      result: "Delivered a functional academic feedback system.",
      link: "https://url-shortener.me/6KQM"
    },
    projectflow: {
      title: "ProjectFlow",
      objective: "Create a project management platform with secure messaging.",
      implementation: "Built a full-stack system with collaboration and messaging features.",
      tools: "HTML, CSS, PHP, MySQL, JavaScript",
      security: "Integrated secure coding principles and secure messaging concepts.",
      result: "Built an end-to-end project management application.",
      link: "https://url-shortener.me/6KQG"
    },
    tts: {
      title: "Text to Speech and Speech to Text Java Application",
      objective: "Explore practical voice interaction software at NSTU.",
      implementation: "Implemented Java application capabilities for speech/text conversion.",
      tools: "Java",
      security: "Not security-specific, but strengthens software engineering fundamentals.",
      result: "Expanded development and problem-solving experience.",
      link: "https://url-shortener.me/6KQ1"
    }
  };

  function openModal(projectKey) {
    const data = projectDetailMap[projectKey];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBody.textContent = "";

    const items = [
      ["Objective", data.objective],
      ["Implementation", data.implementation],
      ["Tools", data.tools],
      ["Security Concepts", data.security],
      ["Result", data.result]
    ];

    items.forEach(([label, value]) => {
      const block = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      block.appendChild(strong);
      block.appendChild(document.createTextNode(value));
      modalBody.appendChild(block);
    });

    if (data.link) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "Link: ";
      const a = document.createElement("a");
      a.href = data.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = data.link;
      p.appendChild(strong);
      p.appendChild(a);
      modalBody.appendChild(p);
    }

    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    closeModalBtn.focus();
  }

  function closeModal() {
    modalBackdrop.classList.remove("open");
    modalBackdrop.setAttribute("aria-hidden", "true");
  }

  function wireProjectModal() {
    document.querySelectorAll("[data-project-open]").forEach((button) => {
      button.addEventListener("click", () => {
        openModal(button.dataset.projectOpen);
      });
    });

    closeModalBtn.addEventListener("click", closeModal);

    modalBackdrop.addEventListener("click", (event) => {
      if (event.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  function wireTimeline() {
    document.querySelectorAll(".timeline-item button").forEach((button) => {
      button.addEventListener("click", () => {
        const parent = button.closest(".timeline-item");
        parent.classList.toggle("open");
      });
    });
  }

  function wireTerminal() {
    terminalToggle.addEventListener("click", () => {
      const open = terminalPanel.classList.toggle("open");
      terminalToggle.setAttribute("aria-expanded", String(open));
      if (open) {
        document.getElementById("terminalInput").focus();
      }
    });

    terminalClose.addEventListener("click", () => {
      terminalPanel.classList.remove("open");
      terminalToggle.setAttribute("aria-expanded", "false");
      terminalToggle.focus();
    });
  }

  function wireDiagnosticChallenge() {
    ctfButton.addEventListener("click", () => {
      if (terminal && typeof terminal.print === "function") {
        terminal.print("Diagnostic hint: run 'hint1' in terminal or inspect the button attributes.");
      }
      flagResult.textContent = "Diagnostic mode ready. Enter a flag below or use the terminal command: flag <value>.";
    });

    submitFlag.addEventListener("click", () => {
      const result = window.CTF.checkFlag(flagInput.value);
      flagResult.textContent = result.message;
      if (result.ok) {
        flagResult.style.color = "#6ef0b3";
      } else {
        flagResult.style.color = "#f0c17a";
      }
    });

    document.addEventListener("ctf:result", (event) => {
      const result = event.detail;
      flagResult.textContent = result.message;
      flagResult.style.color = result.ok ? "#6ef0b3" : "#f0c17a";
    });
  }

  function wireKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (modalBackdrop.classList.contains("open")) {
          closeModal();
        }
        if (terminalPanel.classList.contains("open")) {
          terminalPanel.classList.remove("open");
          terminalToggle.setAttribute("aria-expanded", "false");
        }
      }

      if (event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        terminalPanel.classList.add("open");
        terminalToggle.setAttribute("aria-expanded", "true");
        document.getElementById("terminalInput").focus();
      }
    });
  }

  function init() {
    setLocalTime();
    setInterval(setLocalTime, 1000);

    menuBtn.addEventListener("click", toggleMenu);
    navLinks.forEach((link) => link.addEventListener("click", closeMenuIfMobile));

    window.addEventListener("scroll", activateNavByScroll, { passive: true });
    activateNavByScroll();

    revealOnScroll();
    wireProjectFiltering();
    wireProjectModal();
    wireTimeline();
    wireTerminal();
    wireDiagnosticChallenge();
    wireKeyboardShortcuts();
  }

  init();
})();
