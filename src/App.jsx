import { useState, useRef, useEffect } from "react";
import {
  Code2,
  Bot,
  BarChart3,
  Building2,
  ArrowRight,
  Send,
  RotateCcw,
  CheckCircle2,
  MessageCircle,
  Calculator,
  Mail,
  User,
  ChevronDown,
  Quote,
  Compass,
  Sparkles
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                              */
/* ------------------------------------------------------------------ */

const CAREERS = [
  {
    id: "sistemas",
    name: "Ingeniería en Sistemas, Informática y Ciencias de la Computación",
    short: "Sistemas",
    icon: Code2,
    tag: "Construyes lo invisible",
    blurb: "Diseñas la lógica detrás de apps, plataformas y sistemas que millones de personas usan sin pensarlo dos veces.",
    challenge: {
      title: "Resuelve el problema lógico",
      subtitle: "Un ingeniero en sistemas piensa en flujos y posibles fallos.",
      steps: [
        {
          type: "choice",
          prompt: "Una app de comida muestra que el restaurante está abierto, pero al intentar pedir lanza un error. ¿Dónde es más probable que esté el problema?",
          options: [
            { label: "En el color de los botones de la aplicación.", correct: false },
            { label: "En la desincronización de datos entre la app y el servidor del restaurante.", correct: true },
            { label: "En que la pantalla del celular del usuario está sucia.", correct: false },
          ],
          explanation: "Los sistemas modernos dividen lo que el usuario ve (frontend) de los datos reales (backend). Si hay error, suele ser en la comunicación entre ambos.",
        },
        {
          type: "choice",
          prompt: "Quieres que tu aplicación recomiende películas. ¿Qué dato te sería más útil recolectar?",
          options: [
            { label: "El historial de las últimas 10 películas que el usuario vio completas.", correct: true },
            { label: "La marca y modelo del celular desde el que se conecta.", correct: false },
            { label: "El nombre completo y la dirección del usuario.", correct: false },
          ],
          explanation: "La Inteligencia Artificial y los algoritmos de recomendación se alimentan de patrones de comportamiento (qué ves), no de datos irrelevantes.",
        },
      ],
    },
    system: {
      duracion: "9 semestres aprox.",
      materias: "Estructuras de datos, bases de datos, ingeniería de software, redes, IA aplicada",
      salidas: "Desarrollo de software, ciencia de datos, ciberseguridad, arquitectura de sistemas",
    },
    roadmap: [
      "Practica lógica de programación 30 min/día (ej. Khan Academy o Codecademy)",
      "Repasa álgebra básica — ayuda a pensar de forma estructurada",
      "Investiga qué es el frontend y el backend",
    ],
    professor: {
      name: "Ing. Andrea Solís",
      role: "Coordinadora del área de Ingeniería en Sistemas",
      initials: "AS",
      highlight: "Ex líder técnica en banca digital.",
      shortLine: "“Cada estudiante que duda en su primer código termina liderando proyectos reales.”",
      quote: "Lo que más me emociona es ver a alguien que llegó pensando que 'no nació para programar' crear su primera app funcional a mitad de semestre.",
    },
  },
  {
    id: "mecatronica",
    name: "Ingeniería en Mecatrónica",
    short: "Mecatrónica",
    icon: Bot,
    tag: "Le das movimiento a las ideas",
    blurb: "Mezclas mecánica, electrónica y programación para crear máquinas y robots que interactúan con el mundo real.",
    challenge: {
      title: "Ordena el automatismo",
      subtitle: "Así razona un ingeniero mecatrónico al diseñar algo automático.",
      steps: [
        {
          type: "choice",
          prompt: "Estás diseñando una puerta automática de supermercado. ¿Qué es lo primero que debe hacer el sistema para funcionar bien?",
          options: [
            { label: "Activar los motores al máximo de velocidad.", correct: false },
            { label: "Detectar mediante un sensor si hay alguien acercándose.", correct: true },
            { label: "Encender una luz verde de bienvenida.", correct: false },
          ],
          explanation: "Todo sistema mecatrónico depende de 'sentir' su entorno antes de actuar. Si los motores arrancan sin sensor, el sistema es ciego.",
        },
        {
          type: "choice",
          prompt: "La puerta automática a veces se cierra justo cuando alguien está pasando. ¿Qué revisas primero?",
          options: [
            { label: "Cambiar los motores por unos más grandes y potentes.", correct: false },
            { label: "Revisar que el sensor de presencia esté limpio y bien calibrado.", correct: true },
            { label: "Poner un letrero que diga 'Pase rápido'.", correct: false },
          ],
          explanation: "En mecatrónica, diagnosticar por capas es clave. La mayoría de los errores físicos provienen de fallas de lectura (sensores), no de fuerza mecánica.",
        },
      ],
    },
    system: {
      duracion: "10 semestres aprox.",
      materias: "Robótica, control automático, circuitos, programación de microcontroladores",
      salidas: "Automatización industrial, robótica, diseño de producto, manufactura",
    },
    roadmap: [
      "Repasa física básica: fuerzas y movimiento",
      "Explora qué es un circuito eléctrico básico",
      "Mira videos de proyectos con Arduino para entender la mezcla de código y electrónica",
    ],
    professor: {
      name: "Ing. Fernando Casasola",
      role: "Catedrático de Robótica y Control",
      initials: "FC",
      highlight: "Director de proyectos de robótica estudiantil.",
      shortLine: "“Aquí no memorizas fórmulas, las ves moverse.”",
      quote: "La primera vez que un estudiante hace que su propio circuito cobre vida, ya no hay vuelta atrás.",
    },
  },
  {
    id: "industrial",
    name: "Ingeniería Industrial",
    short: "Industrial",
    icon: BarChart3,
    tag: "Haces que todo fluya mejor",
    blurb: "Optimizas procesos, recursos y personas para que una empresa funcione con la menor fricción posible.",
    challenge: {
      title: "Optimiza la fila",
      subtitle: "El ingeniero industrial busca constantemente la eficiencia y el orden.",
      steps: [
        {
          type: "choice",
          prompt: "En una cafetería hay demasiada fila y tienes a 3 empleados detrás del mostrador. ¿Cuál es la mejor forma de organizarlos?",
          options: [
            { label: "Que los tres intenten atender a los clientes al mismo tiempo cruzándose.", correct: false },
            { label: "Dividir el trabajo: uno toma órdenes y cobra, otro prepara bebidas, y otro entrega.", correct: true },
            { label: "Que solo trabaje uno y los otros dos descansen para no estorbar.", correct: false },
          ],
          explanation: "Especializar las tareas crea un flujo continuo (línea de ensamblaje), lo cual reduce enormemente el tiempo de espera.",
        },
        {
          type: "choice",
          prompt: "Los clientes ahora se quejan de que el café llega tibio. ¿Qué dato necesitas medir para solucionar esto?",
          options: [
            { label: "El tiempo exacto que pasa desde que se sirve el café hasta que se entrega en la barra.", correct: true },
            { label: "Cuántos clientes entran al día a la cafetería.", correct: false },
            { label: "El precio promedio de las bebidas de la competencia.", correct: false },
          ],
          explanation: "Un ingeniero industrial decide con datos directos del proceso, no con suposiciones. El tiempo de espera del producto terminado revela cuellos de botella.",
        },
      ],
    },
    system: {
      duracion: "9 semestres aprox.",
      materias: "Investigación de operaciones, gestión de calidad, logística, estadística",
      salidas: "Operaciones, logística, mejora continua, gestión de proyectos",
    },
    roadmap: [
      "Fortalece tu estadística básica — será tu herramienta diaria",
      "Observa procesos cotidianos (como la fila del súper) y piensa cómo hacerlos más rápidos",
      "Investiga qué es la filosofía de 'Mejora Continua'",
    ],
    professor: {
      name: "Inga. Paola Recinos",
      role: "Catedrática de Investigación de Operaciones",
      initials: "PR",
      highlight: "Consultora de mejora de procesos manufactureros.",
      shortLine: "“Les enseño a ver problemas donde otros solo ven rutina.”",
      quote: "Ese cambio de mentalidad —cuestionar el proceso, no solo ejecutarlo— es lo que te vuelve indispensable en cualquier empresa.",
    },
  },
  {
    id: "construccion",
    name: "Ingeniería en la Construcción",
    short: "Construcción",
    icon: Building2,
    tag: "Le das forma a lo que perdura",
    blurb: "Conviertes un plano en una estructura real, segura y funcional, pensando en cargas, materiales y personas.",
    challenge: {
      title: "Prueba tu intuición estructural",
      subtitle: "Un ingeniero civil necesita prever cómo se comportan los pesos y las fuerzas.",
      steps: [
        {
          type: "choice",
          prompt: "Vas a diseñar una casa en un terreno inclinado. ¿Qué es lo absolutamente primordial antes de comprar materiales?",
          options: [
            { label: "Elegir el color de la pintura exterior.", correct: false },
            { label: "Estudiar la firmeza del suelo para saber si soportará los cimientos.", correct: true },
            { label: "Comprar los vidrios de las ventanas para aprovechar una oferta.", correct: false },
          ],
          explanation: "Toda estructura es tan fuerte como el suelo que la sostiene. Conocer el terreno es el paso 0 de cualquier proyecto de construcción.",
        },
        {
          type: "choice",
          prompt: "Para que un edificio alto resista los vientos fuertes y pequeños sismos, su estructura idealmente debe ser...",
          options: [
            { label: "Completamente rígida, para que no se mueva ni un milímetro.", correct: false },
            { label: "Hecha en su totalidad de cristal para que el viento pase de largo.", correct: false },
            { label: "Ligeramente flexible, para que pueda disipar y absorber la energía del movimiento.", correct: true },
          ],
          explanation: "La intuición nos dice que lo rígido es más fuerte, pero en la ingeniería estructural, cierta flexibilidad previene que los materiales se quiebren ante la presión.",
        },
      ],
    },
    system: {
      duracion: "9 semestres aprox.",
      materias: "Estática, resistencia de materiales, geotecnia, gestión de obra",
      salidas: "Diseño estructural, supervisión de obra, gestión de infraestructura",
    },
    roadmap: [
      "Repasa geometría y física básica (fuerzas y vectores)",
      "Observa puentes o edificios en tu ciudad y pregúntate por qué tienen esa forma",
      "Investiga qué hace un supervisor de obra en su día a día",
    ],
    professor: {
      name: "Ing. Diego Ramírez",
      role: "Catedrático de Estructuras",
      initials: "DR",
      highlight: "Supervisor de megaproyectos de infraestructura pública.",
      shortLine: "“Lo que dibujan en el papel, alguien lo va a caminar.”",
      quote: "Cada semestre les recuerdo lo mismo: esa responsabilidad —que algo real dependa de tu cálculo— hace especial esta carrera.",
    },
  },
];

const SUGGESTED_QUESTIONS = [
  "¿Es muy pesada la matemática?",
  "¿De qué voy a poder trabajar?",
  "¿Cómo es el primer año?",
];

const GENERAL_QUESTIONS = [
  "¿Qué modalidades de estudio hay?",
  "¿Cuál ingeniería me recomiendas?",
  "¿Cómo es el proceso de admisión?",
];
/* ------------------------------------------------------------------ */
/*  STYLES                                                            */
/* ------------------------------------------------------------------ */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    /* Reseteo agresivo para anular los límites de Vite */
    html, body, #root {
      margin: 0 !important;
      padding: 0 !important;
      width: 100%;
      max-width: none !important;
      background-color: #0F172A; /* NUEVO AZUL BASE */
      -webkit-font-smoothing: antialiased;
    }

    /* --- ESTILIZACIÓN DE LA BARRA DE DESPLAZAMIENTO (SCROLLBAR) --- */
    ::-webkit-scrollbar {
      width: 8px; /* Más delgada */
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent; /* Fondo transparente */
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15); /* Gris sutil semi-transparente */
      border-radius: 10px; /* Bordes redondeados */
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25); /* Un poco más claro al pasar el mouse */
    }

    .gal-root {
      --ink: #0F172A; /* NUEVO AZUL BASE */
      --ink-2: #1E293B; /* Ligeramente más claro para contrastes */
      --ink-3: #334155;
      --gold: #C89B3C;
      --gold-light: #E8C978;
      --paper: #F1F2EC;
      --paper-2: #FBFAF6;
      --white: #FFFFFF;
      --muted: #94A3B8;
      --good: #4C9A6A;
      --bad: #C0574A;
      font-family: 'Inter', sans-serif;
      
      background-color: var(--ink); /* Fondo uniforme */
      
      color: var(--white);
      min-height: 100vh;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      overflow-x: hidden;
    }
    
    .gal-root *, .gal-root *::before, .gal-root *::after { box-sizing: border-box; }
    .gal-display { font-family: 'Fraunces', serif; }

    .gal-shell { 
      background-color: var(--ink); /* Fondo uniforme */
      max-width: 960px; 
      margin: 0 auto; 
      padding: 28px 20px 60px; 
      position: relative; 
      min-height: 100vh;
      /* Eliminada la sombra (box-shadow) para unificar el fondo */
    }

    /* ---------- Orbit header ---------- */
    .gal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 34px; flex-wrap: wrap; gap: 16px; }
    .gal-logo { display: flex; align-items: center; gap: 14px; }

    /* Contenedor blanco para contrastar el texto negro del logo */
    .gal-logo-img-wrapper {
      background: var(--paper-2); 
      padding: 6px 14px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .gal-logo-img {
      height: 32px; 
      width: auto;
      display: block;
    }

    .gal-logo-text { font-family: 'Fraunces', serif; font-size: 16px; color: var(--muted); font-weight: 500; letter-spacing: 0.02em; }

    .gal-orbit { display: flex; align-items: center; gap: 4px; position: relative; }
    .gal-orbit-track { position: relative; display: flex; align-items: center; gap: 26px; padding: 10px 6px; }
    .gal-orbit-line {
      position: absolute; top: 50%; left: 16px; right: 16px; height: 1px;
      background: linear-gradient(90deg, rgba(200,155,60,0.15), rgba(200,155,60,0.55), rgba(200,155,60,0.15));
      transform: translateY(-50%); z-index: 0;
    }
    .gal-orbit-stop { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .gal-orbit-ring {
      width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(232, 201, 120, 0.25);
      display: flex; align-items: center; justify-content: center; transition: all 0.4s ease;
    }
    .gal-orbit-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(232, 201, 120, 0.35); transition: all 0.4s ease; }
    .gal-orbit-stop.active .gal-orbit-ring { border-color: var(--gold-light); box-shadow: 0 0 0 4px rgba(232,201,120,0.12); }
    .gal-orbit-stop.active .gal-orbit-dot { background: var(--gold-light); box-shadow: 0 0 10px var(--gold-light); }
    .gal-orbit-stop.done .gal-orbit-dot { background: var(--gold); }
    .gal-orbit-label { font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
    .gal-orbit-stop.active .gal-orbit-label { color: var(--gold-light); }

    /* ---------- Panels ---------- */
    .gal-panel { background: var(--paper); color: var(--ink); border-radius: 20px; padding: 36px; min-height: 420px; animation: gal-fade 0.45s ease; }
    @media (max-width: 620px) { .gal-panel { padding: 22px; border-radius: 16px; } .gal-shell { padding: 20px 14px 48px; } }
    @keyframes gal-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .gal-eyebrow {
      display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 10px;
    }
    .gal-h1 { font-family: 'Fraunces', serif; font-size: clamp(26px, 4vw, 36px); font-weight: 600; line-height: 1.15; margin: 0 0 10px; color: var(--ink); }
    .gal-sub { color: #5A6478; font-size: 15px; line-height: 1.55; margin: 0 0 26px; max-width: 58ch; }
    .gal-divider { border: none; border-top: 1px solid #E0DDD0; margin: 26px 0; }
    .gal-section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink); margin-bottom: 12px; }

    /* ---------- Buttons ---------- */
    .gal-btn {
      display: inline-flex; align-items: center; gap: 8px; background: var(--ink); color: var(--white);
      border: none; padding: 13px 22px; border-radius: 10px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s ease; font-family: 'Inter', sans-serif;
    }
    .gal-btn:hover { background: var(--ink-3); transform: translateY(-1px); }
    .gal-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .gal-btn.gold { background: var(--gold); color: var(--ink); }
    .gal-btn.gold:hover { background: var(--gold-light); }
    .gal-btn.ghost { background: transparent; color: var(--ink); border: 1px solid #D8D5C9; }
    .gal-btn.ghost:hover { border-color: var(--ink); background: rgba(11,21,38,0.03); }
    .gal-btn.on-dark { background: var(--gold); color: var(--ink); }
    .gal-btn.on-dark:hover { background: var(--gold-light); }

    /* ---------- Discover Panel (Integrated Chat) ---------- */
    .gal-discover-panel {
      background: var(--ink-2); /* Contenedor oscuro */
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px; overflow: hidden; position: relative;
      display: flex; flex-direction: column; gap: 20px;
    }
    .gal-discover-header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 36px 36px 0; align-items: stretch; }
    @media (max-width: 768px) { .gal-discover-header-grid { grid-template-columns: 1fr; gap: 20px; padding: 24px 24px 0; } }
    
    .gal-inline-chat {
      background: var(--ink); border: 1px solid var(--ink-3); border-radius: 16px;
      display: flex; flex-direction: column; 
      height: 520px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .gal-inline-chat-header {
      padding: 12px 16px; border-bottom: 1px solid var(--ink-3); display: flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 600; color: var(--gold-light); background: rgba(0,0,0,0.1); border-radius: 16px 16px 0 0;
    }
    .gal-inline-chat .gal-chat-window { height: auto; flex: 1; background: transparent; border: none; padding: 16px; margin: 0; overflow-y: auto; }
    
    /* SCROLLBAR CHAT */
    .gal-inline-chat .gal-chat-window::-webkit-scrollbar { width: 6px; }
    .gal-inline-chat .gal-chat-window::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    
    .gal-inline-chat .gal-msg { font-size: 13.5px; }
    .gal-inline-chat .gal-msg.bot { background: var(--ink-2); color: var(--white); }
    .gal-inline-chat .gal-msg.user { background: var(--gold); color: var(--ink); }
    
    /* Dark Mode Chips for Inline Chat */
    .gal-inline-chat-chips { padding: 0 16px 12px; display: flex; flex-wrap: wrap; gap: 8px; }
    .gal-inline-chat .gal-chip {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8);
      font-size: 12px; padding: 6px 12px;
    }
    .gal-inline-chat .gal-chip:hover { border-color: var(--gold-light); color: var(--gold-light); background: rgba(255,255,255,0.1); }
    
    .gal-inline-chat-foot { padding: 12px 16px 16px; display: flex; gap: 8px; }
    .gal-inline-chat-foot input {
      flex: 1; background: var(--ink-2); border: 1px solid var(--ink-3); color: var(--white);
      border-radius: 10px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 13.5px; outline: none;
    }
    .gal-inline-chat-foot input:focus { border-color: var(--gold); }
    .gal-inline-chat-foot button {
      background: var(--gold); color: var(--ink); border: none; border-radius: 10px; width: 42px;
      display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
    }
    .gal-inline-chat-foot button:hover:not(:disabled) { background: var(--gold-light); }
    .gal-inline-chat-foot button:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ---------- Scroller (Rail) ---------- */
    .gal-discover-body { display: flex; align-items: stretch; margin-top: 10px; }
    .gal-discover-rail { display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 10px 18px 10px 36px; flex-shrink: 0; }
    @media (max-width: 768px) { .gal-discover-rail { padding-left: 18px; } }
    .gal-rail-dot {
      width: 10px; height: 10px; border-radius: 50%; background: rgba(232,201,120,0.25);
      cursor: pointer; border: none; transition: all 0.3s ease; position: relative;
    }
    .gal-rail-dot.active { background: var(--gold-light); box-shadow: 0 0 0 4px rgba(232,201,120,0.15); transform: scale(1.15); }
    .gal-rail-line { width: 1px; flex: 1; background: rgba(232,201,120,0.15); }

    .gal-discover-scroller { flex: 1; height: 460px; overflow-y: auto; scroll-snap-type: y mandatory; scrollbar-width: thin; }
    
    /* SCROLLBAR SECCIÓN CARRERAS */
    .gal-discover-scroller::-webkit-scrollbar { width: 4px; }
    .gal-discover-scroller::-webkit-scrollbar-thumb { background: rgba(232,201,120,0.2); border-radius: 10px; }
    
    .gal-discover-section {
      min-height: 460px; scroll-snap-align: start; display: flex; flex-direction: column; justify-content: center;
      padding: 40px 44px 40px 10px; position: relative; opacity: 0.25; transform: translateY(14px) scale(0.985);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    @media (max-width: 768px) { .gal-discover-section { padding: 30px 24px 30px 10px; min-height: 440px; } }
    .gal-discover-section.in-view { opacity: 1; transform: translateY(0) scale(1); }
    
    .gal-discover-icon-bg { position: absolute; top: 50%; right: 40px; transform: translateY(-50%); opacity: 0.05; color: var(--white); z-index: 0; pointer-events: none; }
    .gal-discover-tag { color: var(--gold-light); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; position: relative; z-index: 1;}
    .gal-discover-title { font-family: 'Fraunces', serif; font-size: clamp(24px, 4vw, 34px); color: var(--white); margin: 0 0 12px; max-width: 20ch; position: relative; z-index: 1;}
    .gal-discover-blurb { color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6; max-width: 50ch; margin-bottom: 24px; position: relative; z-index: 1;}

    /* ---------- Challenge & Standard Chat ---------- */
    .gal-progress-dots { display: flex; gap: 6px; margin-bottom: 22px; }
    .gal-progress-dots span { width: 26px; height: 3px; border-radius: 2px; background: #DDD9CB; }
    .gal-progress-dots span.on { background: var(--gold); }

    .gal-options { display: flex; flex-direction: column; gap: 10px; margin: 16px 0; }
    .gal-option {
      text-align: left; background: var(--white); border: 1.5px solid #E4E1D6; border-radius: 10px;
      padding: 14px 16px; font-size: 14px; cursor: pointer; transition: all 0.15s ease; color: var(--ink);
    }
    .gal-option:hover { border-color: var(--ink); }
    .gal-option.correct { border-color: var(--good); background: #EEF7F1; }
    .gal-option.incorrect { border-color: var(--bad); background: #FBEEEC; }

    .gal-explain { background: var(--paper-2); border-left: 3px solid var(--gold); padding: 14px 16px; border-radius: 8px; font-size: 13.5px; line-height: 1.55; color: #4B5265; margin-top: 14px; }

    /* Standard Chat Window for Stage 3 */
    .gal-chat-window {
      background: var(--white); border: 1px solid #E4E1D6; border-radius: 14px; height: 360px;
      overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 14px;
    }
    
    /* SCROLLBAR CHAT CLARO */
    .gal-chat-window::-webkit-scrollbar { width: 6px; }
    .gal-chat-window::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
    
    .gal-msg { max-width: 82%; padding: 10px 14px; border-radius: 12px; font-size: 13.5px; line-height: 1.5; }
    .gal-msg.user { align-self: flex-end; background: var(--ink); color: var(--white); border-bottom-right-radius: 3px; }
    .gal-msg.bot { align-self: flex-start; background: var(--paper); color: var(--ink); border-bottom-left-radius: 3px; }
    .gal-msg.typing { display: flex; gap: 4px; align-items: center; }
    .gal-typing-dot { width: 5px; height: 5px; border-radius: 50%; background: #A9A390; animation: gal-blink 1.1s infinite ease-in-out; }
    .gal-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .gal-typing-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes gal-blink { 0%, 60%, 100% { opacity: 0.25; } 30% { opacity: 1; } }

    .gal-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .gal-chip {
      background: var(--white); border: 1px solid #E4E1D6; border-radius: 999px; padding: 7px 13px;
      font-size: 12.5px; cursor: pointer; color: #4B5265; transition: all 0.15s ease;
    }
    .gal-chip:hover { border-color: var(--gold); color: var(--ink); }

    .gal-input-row { display: flex; gap: 8px; }
    .gal-input-row input { flex: 1; border: 1.5px solid #D8D5C9; border-radius: 10px; padding: 12px 14px; font-size: 14px; outline: none; }
    .gal-input-row input:focus { border-color: var(--gold); }
    .gal-icon-btn { background: var(--ink); color: var(--white); border: none; border-radius: 10px; width: 46px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .gal-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }

    /* ---------- Result ---------- */
    .gal-result-score { font-family: 'Fraunces', serif; font-size: 56px; font-weight: 600; color: var(--ink); line-height: 1; }
    .gal-result-score span { color: var(--gold); }
    .gal-fact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0 26px; }
    @media (max-width: 620px) { .gal-fact-grid { grid-template-columns: 1fr; } }
    .gal-fact { background: var(--white); border: 1px solid #E4E1D6; border-radius: 10px; padding: 14px 16px; }
    .gal-fact-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gold); font-weight: 700; margin-bottom: 4px; }
    .gal-fact-value { font-size: 13.5px; color: var(--ink); line-height: 1.4; }

    /* ---------- Professor card ---------- */
    .gal-prof { background: var(--white); border: 1px solid #E4E1D6; border-radius: 14px; display: flex; gap: 14px; align-items: flex-start; }
    .gal-prof.compact { padding: 16px; margin-bottom: 22px; }
    .gal-prof.full { padding: 24px; margin: 0 0 24px; background: var(--ink); border: none; }
    .gal-prof-avatar {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; background: var(--ink); color: var(--gold-light);
      display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 600; font-size: 15px;
    }
    .gal-prof.full .gal-prof-avatar { background: var(--gold); color: var(--ink); width: 52px; height: 52px; font-size: 17px; }
    .gal-prof-name { font-weight: 700; font-size: 13.5px; color: var(--ink); }
    .gal-prof.full .gal-prof-name { color: var(--white); font-size: 15px; }
    .gal-prof-role { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
    .gal-prof.full .gal-prof-role { color: rgba(255,255,255,0.5); }
    .gal-prof-line { font-size: 13px; color: #4B5265; line-height: 1.5; font-style: italic; }
    .gal-prof.full .gal-prof-line { color: rgba(255,255,255,0.85); font-size: 14.5px; }

    /* ---------- Calculator ---------- */
    .gal-field { margin-bottom: 22px; }
    .gal-field-label { display: flex; justify-content: space-between; font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 8px; }
    .gal-slider { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: #DDD9CB; outline: none; }
    .gal-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--gold);
      cursor: pointer; border: 2px solid var(--white); box-shadow: 0 0 0 1px var(--gold);
    }
    .gal-roadmap { list-style: none; padding: 0; margin: 18px 0 26px; display: flex; flex-direction: column; gap: 10px; }
    .gal-roadmap li { display: flex; gap: 10px; align-items: flex-start; background: var(--white); border: 1px solid #E4E1D6; border-radius: 10px; padding: 12px 14px; font-size: 13.5px; line-height: 1.5; }
    .gal-roadmap li svg { flex-shrink: 0; margin-top: 1px; color: var(--good); }

    .gal-form-row { display: flex; gap: 10px; margin-bottom: 12px; }
    @media (max-width: 480px) { .gal-form-row { flex-direction: column; } }
    .gal-form-field { flex: 1; display: flex; align-items: center; gap: 8px; border: 1.5px solid #D8D5C9; border-radius: 10px; padding: 11px 14px; background: var(--white); }
    .gal-form-field svg { color: var(--muted); flex-shrink: 0; }
    .gal-form-field input { border: none; outline: none; flex: 1; font-size: 14px; }
    .gal-done { text-align: center; padding: 30px 10px; }
    .gal-done-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; color: var(--ink); }
    .gal-back-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .gal-footer-note { text-align: center; font-size: 11.5px; color: var(--muted); margin-top: 22px; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  ORBIT HEADER                                                      */
/* ------------------------------------------------------------------ */

function OrbitHeader({ stage }) {
  const stops = [
    { id: 1, label: "Descubre" },
    { id: 2, label: "Explorar" },
    { id: 3, label: "Preguntar" },
    { id: 4, label: "Prepararte" },
  ];

  return (
    // 1. Todo debe estar envuelto en un contenedor padre (ej. un div o fragmento <>)
    <div>
      {/* 2. El texto debe estar dentro de una etiqueta */}
      <h2>Descubre tu ingeniería</h2>

      {stops.map((s) => (
        // 3. Debes retornar un elemento JSX válido dentro del map y usar un "key"
        <div key={s.id} className={s.id === stage ? "done" : ""}>
          {s.label}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PROFESSOR CARD                                                    */
/* ------------------------------------------------------------------ */

function ProfessorCard({ professor, variant = "compact", label }) {
  if (variant === "full") {
    return (
      <div className="gal-prof full">
        <div style={{ flex: 1 }}>
          {label && <div className="gal-section-label" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</div>}
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div className="gal-prof-avatar">{professor.initials}</div>
            <div style={{ flex: 1 }}>
              <Quote size={18} style={{ color: "var(--gold)", opacity: 0.7, marginBottom: 8 }} />
              <div className="gal-prof-line">{professor.quote}</div>
              <div className="gal-prof-name" style={{ marginTop: 12 }}>{professor.name}</div>
              <div className="gal-prof-role">{professor.role}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="gal-prof compact">
      <div className="gal-prof-avatar">{professor.initials}</div>
      <div>
        <div className="gal-prof-line">{professor.shortLine}</div>
        <div className="gal-prof-name" style={{ marginTop: 8 }}>{professor.name}</div>
        <div className="gal-prof-role">{professor.role}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NUEVO GENERIC CHAT ENGINE (Apunta a tu Backend)                   */
/* ------------------------------------------------------------------ */

function useClaudeChat(systemPrompt, initialBotText) {
  const [messages, setMessages] = useState([{ role: "bot", text: initialBotText }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    const nextMessages = [...messages, { role: "user", text: q }];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const history = nextMessages.map((m) => ({ role: m.role, content: m.text }));
      
      // Apuntamos a la función Serverless de Vercel
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      
      const data = await response.json();
      
      // Verificamos si hubo un error en el backend
      if (data.error) throw new Error(data.error);
      
      setMessages((m) => [...m, { role: "bot", text: data.respuesta }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "bot", text: "Tuve un problema de conexión. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, loading, send, chatRef };
}

/* ------------------------------------------------------------------ */
/*  STAGE 1: DISCOVER (Integrated Chat + Scroller)                    */
/* ------------------------------------------------------------------ */

function DiscoverStage({ onPick, onSkipToChat }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRefs = useRef([]);
  const scrollerRef = useRef(null);

  const generalSystemPrompt = `Eres un asesor vocacional de Universidad Galileo. Ayudas a estudiantes a decidir qué ingeniería estudiar. Sé breve, amigable y directo. Responde en español (máximo 4 líneas).`;
  const chat = useClaudeChat(generalSystemPrompt, "¡Hola! Soy la IA de orientación de Galileo. Dime qué te gusta hacer o pregúntame sobre la universidad y te guiaré.");

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.idx);
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            if (entry.intersectionRatio > 0.5) setActiveIdx(idx);
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { root: scroller, threshold: [0.2, 0.5, 0.8] }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToIdx = (idx) => {
    const el = sectionRefs.current[idx];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="gal-discover-panel">
      {/* Top Section: Intro + Integrated Chat */}
      <div className="gal-discover-header-grid">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="gal-eyebrow"><Compass size={13} /> Tu Asesor Virtual</div>
          <h1 className="gal-h1" style={{ color: 'white' }}>Pregunta antes<br/>de elegir</h1>
          <p className="gal-sub" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
            Elegir carrera no tiene que ser un salto a ciegas. Empieza aclarando tus dudas en el chat, o desliza abajo para explorar las opciones.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-light)', fontSize: 13, fontWeight: 600 }}>
             <ChevronDown size={16} /> Ver ingenierías abajo
          </div>
        </div>

        {/* Inline Dark Chat */}
        <div className="gal-inline-chat">
          <div className="gal-inline-chat-header">
            <Sparkles size={16} /> Galileo Bot
          </div>
          <div className="gal-chat-window" ref={chat.chatRef}>
            {chat.messages.map((m, i) => (
              <div key={i} className={`gal-msg ${m.role}`}>{m.text}</div>
            ))}
            {chat.loading && (
              <div className="gal-msg bot typing">
                <span className="gal-typing-dot" /><span className="gal-typing-dot" /><span className="gal-typing-dot" />
              </div>
            )}
          </div>
          <div className="gal-inline-chat-chips">
            {GENERAL_QUESTIONS.map((q, i) => (
              <button key={i} className="gal-chip" onClick={() => chat.send(q)} disabled={chat.loading}>{q}</button>
            ))}
          </div>
          <div className="gal-inline-chat-foot">
            <input
              placeholder="Escribe tu duda aquí..."
              value={chat.input}
              onChange={(e) => chat.setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && chat.send()}
              disabled={chat.loading}
            />
            <button onClick={() => chat.send()} disabled={chat.loading || !chat.input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '10px 36px' }} />

      {/* Bottom Section: Scroller */}
      <div className="gal-discover-body">
        <div className="gal-discover-rail">
          {CAREERS.map((c, i) => (
            <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: i < CAREERS.length - 1 ? 1 : "none" }}>
              <button
                className={"gal-rail-dot " + (activeIdx === i ? "active" : "")}
                onClick={() => scrollToIdx(i)}
                aria-label={c.short}
                title={c.short}
              />
              {i < CAREERS.length - 1 && <div className="gal-rail-line" />}
            </div>
          ))}
        </div>

        <div className="gal-discover-scroller" ref={scrollerRef}>
          {CAREERS.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={c.id} className="gal-discover-section" data-idx={i} ref={(el) => (sectionRefs.current[i] = el)}>
                <Icon size={240} className="gal-discover-icon-bg" />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="gal-discover-tag">{c.tag}</div>
                  <h2 className="gal-discover-title">{c.name}</h2>
                  <p className="gal-discover-blurb">{c.blurb}</p>
                  
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="gal-btn on-dark" onClick={() => onPick(c)}>
                      Hacer el reto corto <ArrowRight size={16} />
                    </button>
                    <button 
                      className="gal-btn ghost" 
                      style={{ borderColor: 'rgba(232,201,120,0.3)', color: 'var(--gold-light)' }} 
                      onClick={() => onSkipToChat(c)}
                    >
                      <MessageCircle size={16} /> Ir al chat de esta carrera
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STAGE 2: EXPLORAR (Challenge)                                     */
/* ------------------------------------------------------------------ */

function Challenge({ career, onFinish }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const steps = career.challenge.steps;
  const step = steps[stepIdx];

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt.correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (stepIdx + 1 < steps.length) {
      setStepIdx((i) => i + 1);
      setSelected(null);
    } else {
      onFinish(correctCount, steps.length);
    }
  };

  return (
    <div className="gal-panel">
      <div className="gal-back-row">
        <div className="gal-eyebrow" style={{ marginBottom: 0 }}>
          {career.icon && <career.icon size={13} />} {career.short}
        </div>
        <div className="gal-progress-dots">
          {steps.map((_, i) => (<span key={i} className={i <= stepIdx ? "on" : ""} />))}
        </div>
      </div>
      <h1 className="gal-h1">{career.challenge.title}</h1>
      <p className="gal-sub">{career.challenge.subtitle}</p>

      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginTop: 10 }}>{step.prompt}</p>

      <div className="gal-options">
        {step.options.map((opt, i) => {
          let cls = "gal-option";
          if (selected) {
            if (opt.correct) cls += " correct";
            else if (opt === selected) cls += " incorrect";
          }
          return (
            <button key={i} className={cls} disabled={!!selected} onClick={() => handleSelect(opt)}>
              {opt.label}
            </button>
          );
        })}
      </div>

      {selected && (
        <>
          <div className="gal-explain">{step.explanation}</div>
          <div style={{ marginTop: 20 }}>
            <button className="gal-btn gold" onClick={handleNext}>
              {stepIdx + 1 < steps.length ? "Siguiente pregunta" : "Ver mi resultado"}
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChallengeResult({ career, score, total, onGoToChat }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="gal-panel">
      <div className="gal-eyebrow"><CheckCircle2 size={13} /> Resultado</div>
      <div className="gal-result-score">{score}/{total} <span>correctas</span></div>
      <p className="gal-sub" style={{ marginTop: 14 }}>
        {pct >= 50
          ? `Resolviste el reto igual que empieza a razonar cualquier estudiante de ${career.short} — usando la lógica para resolver un problema real.`
          : `No pasa nada si no acertaste — así se siente el primer contacto con ${career.short}. Aprender esta forma de pensar es justo de lo que trata la carrera.`}
      </p>

      <div className="gal-fact-grid">
        <div className="gal-fact"><div className="gal-fact-label">Duración</div><div className="gal-fact-value">{career.system.duracion}</div></div>
        <div className="gal-fact"><div className="gal-fact-label">Salidas laborales</div><div className="gal-fact-value">{career.system.salidas}</div></div>
        <div className="gal-fact" style={{ gridColumn: "1 / -1" }}><div className="gal-fact-label">Materias clave</div><div className="gal-fact-value">{career.system.materias}</div></div>
      </div>

      <div className="gal-section-label">Siguiente Paso: Habla con el asesor experto de {career.short}</div>
      <button className="gal-btn gold" onClick={onGoToChat}>
        <MessageCircle size={16} /> Resolver mis dudas específicas
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STAGE 3: PREGUNTAR (Career Chat)                                  */
/* ------------------------------------------------------------------ */

function ChatStage({ career, onContinue, onBackToDiscover }) {
  const systemPrompt = `Eres un asesor vocacional de Universidad Galileo, especializado en ${career.name}. Responde dudas de forma clara, amigable y muy breve (máximo 3-4 líneas).`;
  const chat = useClaudeChat(systemPrompt, `¡Hola! Soy experto en ${career.short}. Pregúntame lo que de verdad te preocupa sobre esta carrera — sin filtros.`);

  return (
    <div className="gal-panel">
      <div className="gal-back-row">
        <div className="gal-eyebrow" style={{ marginBottom: 0 }}><MessageCircle size={13} /> Asesor de {career.short}</div>
        <button className="gal-btn ghost" style={{ padding: '8px 12px', fontSize: 12 }} onClick={onBackToDiscover}>
           <RotateCcw size={14} /> Cambiar de carrera
        </button>
      </div>
      
      <h1 className="gal-h1">Pregunta lo que de verdad te ronda</h1>
      <p className="gal-sub">Sin formularios, sin espera. Respuestas directas sobre {career.short}.</p>

      <div className="gal-chat-window" ref={chat.chatRef}>
        {chat.messages.map((m, i) => (<div key={i} className={`gal-msg ${m.role}`}>{m.text}</div>))}
        {chat.loading && (
          <div className="gal-msg bot typing"><span className="gal-typing-dot" /><span className="gal-typing-dot" /><span className="gal-typing-dot" /></div>
        )}
      </div>

      <div className="gal-chips">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button key={i} className="gal-chip" onClick={() => chat.send(q)} disabled={chat.loading}>{q}</button>
        ))}
      </div>

      <div className="gal-input-row">
        <input
          placeholder="Escribe tu pregunta..."
          value={chat.input}
          onChange={(e) => chat.setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && chat.send()}
          disabled={chat.loading}
        />
        <button className="gal-icon-btn" onClick={() => chat.send()} disabled={chat.loading || !chat.input.trim()}>
          <Send size={17} />
        </button>
      </div>

      <hr className="gal-divider" />
      <div className="gal-section-label">Conoce a tu futuro catedrático</div>
      <ProfessorCard professor={career.professor} variant="compact" />

      <button className="gal-btn gold" onClick={onContinue}>
        Ya tengo claridad, arma mi plan <ArrowRight size={16} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STAGE 4: PREPARARTE (Calculator)                                  */
/* ------------------------------------------------------------------ */

function CalculatorStage({ career, onRestart }) {
  const [math, setMath] = useState(5);
  const [physics, setPhysics] = useState(5);
  const [hours, setHours] = useState(4);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const level = (v) => (v <= 3 ? "básico" : v <= 7 ? "intermedio" : "avanzado");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    // Aquí iría el guardado real. Por ahora simulamos éxito inmediato.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="gal-panel">
        <div className="gal-done">
          <div className="gal-done-icon"><CheckCircle2 size={28} /></div>
          <h1 className="gal-h1">Tu plan va en camino, {name.split(" ")[0]}</h1>
          <p className="gal-sub" style={{ margin: "0 auto 22px" }}>
            Te enviaríamos este plan de preparación para {career.short} a {email}, junto con información sobre admisiones.
          </p>
          <button className="gal-btn ghost" onClick={onRestart}><RotateCcw size={15} /> Explorar otra carrera</button>
        </div>
      </div>
    );
  }

  return (
    <div className="gal-panel">
      <div className="gal-eyebrow"><Calculator size={13} /> Tu plan personalizado</div>
      <h1 className="gal-h1">De aquí a estudiar {career.short}</h1>
      <p className="gal-sub">Cuéntanos dónde estás hoy y arma tu ruta de preparación antes de aplicar.</p>

      <div className="gal-field">
        <div className="gal-field-label">Nivel en matemática <span>{level(math)}</span></div>
        <input type="range" min="1" max="10" value={math} onChange={(e) => setMath(+e.target.value)} className="gal-slider" />
      </div>
      <div className="gal-field">
        <div className="gal-field-label">Nivel en física <span>{level(physics)}</span></div>
        <input type="range" min="1" max="10" value={physics} onChange={(e) => setPhysics(+e.target.value)} className="gal-slider" />
      </div>
      <div className="gal-field">
        <div className="gal-field-label">Horas por semana disponibles <span>{hours}h</span></div>
        <input type="range" min="1" max="15" value={hours} onChange={(e) => setHours(+e.target.value)} className="gal-slider" />
      </div>

      <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>Tu ruta de preparación:</p>
      <ul className="gal-roadmap">
        {career.roadmap.map((item, i) => (<li key={i}><CheckCircle2 size={15} /> {item}</li>))}
        <li><CheckCircle2 size={15} /> Con {hours}h/semana, podrías cubrir esta ruta en aprox. {Math.max(2, Math.round(20 / hours))} semanas.</li>
      </ul>

      <hr className="gal-divider" />
      <ProfessorCard professor={career.professor} variant="full" label={`Quien te enseñará ${career.short}`} />

      {!showForm ? (
        <button className="gal-btn gold" onClick={() => setShowForm(true)}>
          <Mail size={16} /> Enviarme este plan por correo
        </button>
      ) : (
        <>
          <div className="gal-form-row">
            <div className="gal-form-field"><User size={15} /><input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="gal-form-field"><Mail size={15} /><input placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          </div>
          <button className="gal-btn gold" onClick={handleSubmit} disabled={!name.trim() || !email.trim()}>
            Confirmar y recibir mi plan
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT APP                                                          */
/* ------------------------------------------------------------------ */

export default function GalileoLeadMagnet() {
  const [stage, setStage] = useState(1); 
  const [phase, setPhase] = useState("challenge"); 
  const [career, setCareer] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const restart = () => {
    setStage(1);
    setPhase("challenge");
    setCareer(null);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="gal-root">
      <GlobalStyles />
      <div className="gal-shell">
        <OrbitHeader stage={stage} />

        {stage === 1 && (
          <DiscoverStage
            onPick={(c) => { setCareer(c); setPhase("challenge"); setStage(2); }}
            onSkipToChat={(c) => { setCareer(c); setStage(3); }}
          />
        )}

        {stage === 2 && phase === "challenge" && career && (
          <Challenge career={career} onFinish={(correct, total) => { setScore({ correct, total }); setPhase("result"); }} />
        )}

        {stage === 2 && phase === "result" && career && (
          <ChallengeResult career={career} score={score.correct} total={score.total} onGoToChat={() => setStage(3)} />
        )}

        {stage === 3 && career && (
          <ChatStage career={career} onContinue={() => setStage(4)} onBackToDiscover={restart} />
        )}

        {stage === 4 && career && (
          <CalculatorStage career={career} onRestart={restart} />
        )}
      </div>
    </div>
  );
}