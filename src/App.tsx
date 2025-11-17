import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import SkillsCube from "./SkillsCube";

const userName = "Shokhruhmirzo Toyirov";

const contentMap: Record<string, string> = {
  help: 'Available commands:\n  <span class="text-yellow-400">about</span>: Overview + headline.\n  <span class="text-yellow-400">skills</span>: Key stacks & platforms.\n  <span class="text-yellow-400">career</span>: Employment timeline.\n  <span class="text-yellow-400">projects</span>: Highlighted builds.\n  <span class="text-yellow-400">education</span>: Academic background.\n  <span class="text-yellow-400">languages</span>: Spoken languages.\n  <span class="text-yellow-400">achievements</span>: Awards & certifications.\n  <span class="text-yellow-400">contact</span>: Reach me quickly.\n  <span class="text-yellow-400">resume</span>: All sections in one feed.\n  <span class="text-yellow-400">resume-pdf</span>: Fetch and open the PDF resume.\n  <span class="text-yellow-400">open [link_name]</span>: Launch an external resource (e.g., <span class="text-cyan-400">open linkedin</span>).\n  <span class="text-yellow-400">clear</span>: Clear the console.',
  about: `ABOUT SHOKHRUKHMIRZO TOYIROV
<span class="terminal-key">title:</span> Senior Software Engineer
<span class="terminal-key">summary:</span> Seasoned engineer shipping distributed systems, backend architectures, and modern AI products across remote startup teams.
<span class="terminal-key">focus:</span> Node.js · Python · Go · React/Next.js · DevOps (Nginx, Docker, Kubernetes, AWS, GCP) · AI agents & RAG.`,
  skills: `SKILLS & STACK
<span class="terminal-key">languages:</span> JavaScript/TypeScript, Python, Go, Solidity
<span class="terminal-key">backend:</span> Node.js (Express, Nest), Python (FastAPI, Django)
<span class="terminal-key">frontend/mobile:</span> React.js, Next.js, React Native (Redux, MobX)
<span class="terminal-key">distributed/devops:</span> CI/CD, AWS, Google Cloud, Terraform, Nginx, Docker, Kubernetes, MQs (RabbitMQ, Bull), Redis, Prometheus, Grafana
<span class="terminal-key">databases/orms:</span> MySQL, PostgreSQL, MongoDB, DynamoDB, TypeORM, Sequelize, Prisma
<span class="terminal-key">ai:</span> Agents, LangChain, LlamaIndex, CrewAI, LangGraph, Vector DBs (Weaviate, Qdrant, Chroma), RAG`,
  career: `CAREER
<span class="terminal-key">role:</span> Senior Software Engineer — EPAM Systems (Jan 2025 – Present)
<span class="terminal-key">project:</span> CoCounsel (AI agentic workflow for legal documentation)
<span class="terminal-key">impact:</span> Built AI agent skill suite, orchestrated multi-agent legal workflows, and added human-in-the-loop review for high-stakes filings.
<span class="terminal-key">stack:</span> Python (FastAPI), LangChain, RAG, React, AWS

<span class="terminal-key">role:</span> Senior Software Engineer — XCDM Limited (Dec 2023 – Jan 2025)
<span class="terminal-key">scope:</span> Delivered 12+ full-stack projects (finance, AI, healthcare) generating $400K+ revenue; mentored devs and designed distributed systems with 99% uptime.
<span class="terminal-key">stack:</span> Node.js (Nest/Express), Python (FastAPI/Django), React, React Native, RabbitMQ, microservices

<span class="terminal-key">role:</span> Software Developer — The Morrow Digital (Dec 2021 – Dec 2023)
<span class="terminal-key">projects:</span> Ownable UK, Moropo, Terra Listens, ACT It Out
<span class="terminal-key">impact:</span> Built dashboards/mobile apps incl. 3D renders, leveraged AWS Device Farm, adopted clean architecture, reduced mobile error rates 20%, led serverless deployments.

<span class="terminal-key">role:</span> Full Stack Developer — Assorty Products (Jan 2020 – Dec 2021)
<span class="terminal-key">impact:</span> Shipped frontend, backend, and CRM features; launched mobile apps with caching/data normalization (+20% perf) and managed CI/CD + store releases.`,
  projects: `PROJECTS
<span class="terminal-key">project:</span> Docum AI (Jan 2023 – Dec 2023)
<span class="terminal-key">summary:</span> No-code AI platform delivering customer-support chatbots with 50K+ monthly interactions, semantic caching, Telegram/Instagram integrations, multi-stage CI/CD, and agentic RAG workflows. Won national startup competition ($50K).

<span class="terminal-key">project:</span> New Journey (Jan 2021 – Jul 2021)
<span class="terminal-key">summary:</span> Mobile platform connecting immigrants in South Korea to native-language businesses; delivered full MVP (iOS/Android + backend) in 6 weeks with 2K+ downloads in 3 weeks.`,
  education: `EDUCATION
<span class="terminal-key">degree:</span> Bachelors in Integrated System Engineering
<span class="terminal-key">institution:</span> Inha University (South Korea)
<span class="terminal-key">highlights:</span> GPA 3.8/4.5 · A+ in Software Programming, Computer Programming, Linear Algebra, Database`,
  languages: `LANGUAGES
<span class="terminal-key">english:</span> Proficient
<span class="terminal-key">uzbek:</span> Native
<span class="terminal-key">korean:</span> Limited working
<span class="terminal-key">russian:</span> Limited working`,
  achievements: `ACHIEVEMENTS
<span class="terminal-key">sat math level 2:</span> 800
<span class="terminal-key">sat general:</span> 1420 (Math 800)
<span class="terminal-key">iymc:</span> International Youth Math Championship — Gold Honor`,
  contact: `CONTACT
<span class="terminal-key">email:</span> <span class="link-name" data-command="open email">toirovshohruxmirzo@gmail.com</span>
<span class="terminal-key">phone:</span> +998 90 777 99 55
<span class="terminal-key">location:</span> Tashkent, Uzbekistan
<span class="terminal-key">github:</span> <span class="link-name" data-command="open github">github.com/Brian-1812</span>
<span class="terminal-key">linkedin:</span> <span class="link-name" data-command="open linkedin">linkedin.com/in/shohruhmirzo-toyirov-428448193</span>`,
  404: '<span class="text-red-500">Error:</span> Command not recognized. Type <span class="text-yellow-400">help</span> for a list of valid commands.',
  init: `<span class="text-green-500">Initializing Portfolio System...</span>\n\nWelcome to ${userName}'s Interactive Portfolio.\n\nType <span class="text-yellow-400">help</span> and press [Enter] to begin.\n\n<div id="skills-cube-container"></div>`,
};

contentMap.resume = [
  contentMap.about,
  contentMap.skills,
  contentMap.career,
  contentMap.projects,
  contentMap.education,
  contentMap.languages,
  contentMap.achievements,
  contentMap.contact,
].join("\n\n");

const linkMap: Record<string, string> = {
  "project-nova": "https://github.com/jdoe/project_nova_link",
  "trade-bot": "https://github.com/jdoe/algotrade_bot_link",
  "ux-case": "https://medium.com/jdoe/ux-case-study-link",
  email: "mailto:toirovshohruxmirzo@gmail.com",
  linkedin: "https://www.linkedin.com/in/shohruhmirzo-toyirov-428448193",
  github: "https://github.com/Brian-1812",
  techsolutions: "https://techsolutions.com/careers",
  digitalmedia: "https://digitalmediaagency.com",
};

const resumePdfEndpoint = "/api/resume-pdf";

function App() {
  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [commandValue, setCommandValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hasInitializedRef = useRef(false);

  const focusInput = useCallback(() => {
    if (isMinimized) return;
    inputRef.current?.focus();
  }, [isMinimized]);

  const scrollToBottom = useCallback(() => {
    const container = outputRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const clearOutput = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.innerHTML = "";
    }
    focusInput();
  }, [focusInput]);

  const appendEcho = useCallback(
    (text = "") => {
      const container = outputRef.current;
      if (!container) return;
      const echo = document.createElement("span");
      echo.className = "input-echo";
      echo.innerHTML = `<span class="text-yellow-400">user@portfolio:~ $</span>${
        text ? ` ${text}` : ""
      }`;
      container.appendChild(echo);
      scrollToBottom();
      focusInput();
    },
    [focusInput, scrollToBottom]
  );

  const typeOut = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        const container = outputRef.current;
        if (!container) {
          resolve();
          return;
        }

        const block = document.createElement("span");
        block.className = "terminal-line";
        block.style.whiteSpace = "pre-wrap";
        block.innerHTML = text.replace(/\n/g, "<br>");
        container.appendChild(block);
        container.appendChild(document.createElement("br"));

        scrollToBottom();
        focusInput();

        // Check if we need to render the skills cube
        const cubeContainer = container.querySelector("#skills-cube-container");
        if (cubeContainer && !cubeContainer.hasChildNodes()) {
          const root = createRoot(cubeContainer);
          root.render(<SkillsCube />);
        }

        resolve();
      }),
    [focusInput, scrollToBottom]
  );

  const appendPromptOnly = useCallback(() => {
    appendEcho("");
  }, [appendEcho]);

  const processCommand = useCallback(
    async (rawInput?: string) => {
      focusInput();
      const providedInput = rawInput ?? "";
      const trimmed = providedInput.trim();

      if (!trimmed) {
        setCommandValue("");
        appendPromptOnly();
        focusInput();
        return;
      }

      appendEcho(providedInput);
      setCommandValue("");

      if (trimmed.toLowerCase() === "clear") {
        clearOutput();
        focusInput();
        return;
      }

      const parts = trimmed.toLowerCase().split(/\s+/);
      const action = parts[0];
      const argument = parts.slice(1).join(" ");

      if (action === "open" && argument) {
        const url = linkMap[argument];
        if (url) {
          window.open(url, "_blank", "noreferrer");
          await typeOut(
            `<span class="text-cyan-400">Success:</span> Launching external resource: <span class="text-white">${url}</span>\nNote: Please check your browser's new tab or window.`
          );
        } else {
          await typeOut(
            `<span class="text-red-500">Error:</span> Link name <span class="text-white">'${argument}'</span> not found. Use <span class="text-yellow-400">projects</span> or <span class="text-yellow-400">contact</span> to see available link names.`
          );
        }
        focusInput();
        return;
      }

      if (action === "resume-pdf") {
        try {
          const response = await fetch(resumePdfEndpoint);
          if (!response.ok) {
            throw new Error("Resume fetch failed");
          }
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);
          window.open(pdfUrl, "_blank", "noreferrer");
          window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
          await typeOut(
            '<span class="text-cyan-400">Success:</span> Resume PDF opened in a new tab.'
          );
        } catch (error) {
          console.error("Unable to fetch resume PDF", error);
          await typeOut(
            '<span class="text-red-500">Error:</span> Unable to fetch the PDF resume right now. Please try again shortly.'
          );
        }
        focusInput();
        return;
      }

      const content = contentMap[action] ?? contentMap["404"];
      await typeOut(content);
      focusInput();
    },
    [appendEcho, appendPromptOnly, clearOutput, focusInput, typeOut]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void processCommand(commandValue);
      }
    },
    [commandValue, processCommand]
  );

  const handleContainerClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isMinimized) return;
      const target = event.target as HTMLElement;
      const command = target?.getAttribute?.("data-command");
      if (command) {
        void processCommand(command);
        focusInput();
        return;
      }
      inputRef.current?.focus();
    },
    [focusInput, isMinimized, processCommand]
  );

  useEffect(() => {
    if (hasInitializedRef.current) {
      focusInput();
      return;
    }
    hasInitializedRef.current = true;
    focusInput();
    void typeOut(contentMap.init);
  }, [focusInput, typeOut]);

  useEffect(() => {
    const syncFullscreen = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
    };
  }, []);

  useEffect(() => {
    if (isMinimized) {
      inputRef.current?.blur();
    } else {
      focusInput();
    }
  }, [focusInput, isMinimized]);

  const handleCloseClick = useCallback(() => {
    const confirmed = window.confirm(
      "Close the terminal portfolio window? Unsaved commands will be lost."
    );
    if (!confirmed) return;
    window.open("", "_self");
    window.close();
  }, []);

  const handleMinimizeClick = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const handleFullscreenClick = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen", error);
    }
  }, []);

  return (
    <div
      className={`terminal-container${
        isFullscreen ? " terminal-container--fullscreen" : ""
      }`}
      onClick={handleContainerClick}
    >
      <div className="terminal-header">
        <div className="window-controls">
          <button
            type="button"
            className="control control--close"
            aria-label="Close terminal window"
            onClick={(event) => {
              event.stopPropagation();
              handleCloseClick();
            }}
          />
          <button
            type="button"
            className="control control--minimize"
            aria-label={isMinimized ? "Restore terminal" : "Minimize terminal"}
            aria-pressed={isMinimized}
            onClick={(event) => {
              event.stopPropagation();
              handleMinimizeClick();
            }}
          />
          <button
            type="button"
            className="control control--maximize"
            aria-label={isFullscreen ? "Exit fullscreen" : "Go fullscreen"}
            aria-pressed={isFullscreen}
            onClick={(event) => {
              event.stopPropagation();
              void handleFullscreenClick();
            }}
          />
        </div>
        <div className="terminal-title">SHOHRUHMIRZO::PORTFOLIO</div>
      </div>
      <div
        className={`terminal-body${
          isMinimized ? " terminal-body--hidden" : ""
        }`}
      >
        <div ref={outputRef} className="terminal-output" aria-live="polite" />
        <div className="terminal-input-line">
          <span className="prompt text-yellow-400">
            shohruhmirzo@portfolio:~ $
          </span>
          <div className="terminal-input-wrapper">
            <span className="terminal-input-ghost" aria-hidden="true">
              {commandValue || "\u200b"}
            </span>
            <span className="cursor" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={commandValue}
              onChange={(event) => setCommandValue(event.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              aria-label="Terminal input"
            />
          </div>
        </div>
      </div>
      {isMinimized && (
        <div className="terminal-minimized-message">
          Terminal minimized. Click the yellow button to restore.
        </div>
      )}
    </div>
  );
}

export default App;
