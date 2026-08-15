const TerminalUI = (() => {
  const commands = new Map();

  let outputEl;
  let inputEl;

  function print(text, kind = "output") {
    const line = document.createElement("p");
    line.className = "term-line";
    if (kind === "command") {
      const prompt = document.createElement("span");
      prompt.className = "prompt";
      prompt.textContent = "anika@portfolio:~$ ";
      line.appendChild(prompt);

      const content = document.createElement("span");
      content.textContent = text;
      line.appendChild(content);
    } else {
      line.textContent = text;
    }

    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function register() {
    commands.set("help", () => {
      print("Available commands: help, about, skills, projects, contact, clear, hint1, hint2, time");
    });

    commands.set("about", () => {
      print("Aspiring cybersecurity professional focused on pentesting, reverse engineering, SOC operations, and secure development.");
    });

    commands.set("skills", () => {
      print("Key skills: Pentesting, VAPT, Reverse Engineering, SOC Monitoring, Python, Bash, Burp Suite, Nmap, Wireshark, Suricata.");
    });

    commands.set("projects", () => {
      print("Projects: Port Scanner, SOHO Network Configuration, NSTU EduEval System, ProjectFlow, Text-to-Speech/Speech-to-Text Java app.");
    });

    commands.set("contact", () => {
      print("Email: t.a.anika536@gmail.com | Location: Dhaka, Bangladesh");
    });

    commands.set("time", () => {
      const now = new Date();
      print(`Local time: ${now.toLocaleString()}`);
    });

    commands.set("hint1", () => {
      print(window.CTF.getHintOne());
    });

    commands.set("hint2", () => {
      print(window.CTF.getHintTwo());
    });

    commands.set("clear", () => {
      outputEl.textContent = "";
    });
  }

  function runCommand(rawInput) {
    const input = String(rawInput || "").trim().toLowerCase();
    if (!input) return;

    print(input, "command");

    const action = commands.get(input);
    if (action) {
      action();
      return;
    }

    if (input.startsWith("flag ")) {
      const candidate = rawInput.slice(5);
      const result = window.CTF.checkFlag(candidate);
      print(result.message);
      document.dispatchEvent(new CustomEvent("ctf:result", { detail: result }));
      return;
    }

    print("Command not found. Type 'help' for available commands.");
  }

  function init() {
    outputEl = document.getElementById("terminalOutput");
    inputEl = document.getElementById("terminalInput");

    if (!outputEl || !inputEl) return;

    register();
    print("Security mini-terminal initialized. Type 'help' to begin.");

    const form = document.getElementById("terminalForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = inputEl.value;
      inputEl.value = "";
      runCommand(value);
    });

    return { runCommand, print };
  }

  return { init };
})();

window.TerminalUI = TerminalUI;
