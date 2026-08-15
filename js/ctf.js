const CTF = (() => {
  const firstFlag = "FLAG{inspect_the_diagnostics_panel}";
  const encodedSecondHint = "RkxBR3tEQVRBX0lOU1BFQ1RfRk9SX01PUkV9";

  const challengeState = {
    unlockedOne: false,
    unlockedTwo: false
  };

  function normalize(value) {
    return String(value || "").trim();
  }

  function getSecondFlag() {
    try {
      return atob(encodedSecondHint);
    } catch {
      return "";
    }
  }

  function checkFlag(input) {
    const submitted = normalize(input);
    const second = getSecondFlag();

    if (submitted === firstFlag) {
      challengeState.unlockedOne = true;
      return { ok: true, level: 1, message: "FLAG CAPTURED: Stage 1 complete." };
    }

    if (submitted === second) {
      challengeState.unlockedTwo = true;
      return { ok: true, level: 2, message: "FLAG CAPTURED: Stage 2 complete." };
    }

    return { ok: false, level: 0, message: "Flag not recognized." };
  }

  return {
    checkFlag,
    getHintOne() {
      return "Hint: check the Security Diagnostic control for suspicious metadata.";
    },
    getHintTwo() {
      return "Hint: one value in the front-end is encoded and recoverable in devtools.";
    },
    state: challengeState
  };
})();

window.CTF = CTF;
