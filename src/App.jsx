import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Fuel,
  User,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Bot,
  ArrowLeft,
  MessageSquare,
  FileText,
  Download,
  Share2,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

// --- CONFIGURAÇÕES ---
const GOOGLE_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbxYS_NIxHmASVpUJVGos-5d14FHs0w08f4YE_XBd9BktfmJ5HkNU60y6iFfxLxh8WtA/exec';

const firebaseConfig = {
  apiKey: 'AIzaSyC4KvrWHEdQtyCOyOGdCf07SxFIdgTugY8',
  authDomain: 'etx-academy-nr20.firebaseapp.com',
  projectId: 'etx-academy-nr20',
  storageBucket: 'etx-academy-nr20.firebasestorage.app',
  messagingSenderId: '221608796726',
  appId: '1:221608796726:web:452bcf299ecbcebec76e97',
  measurementId: 'G-CGFB4L35YZ',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

// Efeitos Sonoros
const SOUNDS = {
  click: 'https://actions.google.com/sounds/v1/ui/button_click.ogg',
  start_quiz: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg',
  correct_ans: 'https://actions.google.com/sounds/v1/cartoon/magic_chime_bell.ogg',
  wrong_ans: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  timeout: 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg',
  win_high: 'https://actions.google.com/sounds/v1/crowds/crowd_cheer_and_applause.ogg',
  win_mid: 'https://actions.google.com/sounds/v1/cartoon/drum_roll.ogg',
  fail: 'https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_bump.ogg',
  typing: 'https://actions.google.com/sounds/v1/office/keyboard_typing_fast.ogg'
};

const playAudio = (type) => {
  try {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.6;
    audio.play().catch((e) => console.log('Bloqueio de autoplay', e));
  } catch (err) {}
};

// --- COMPONENTE DE ANÚNCIOS GOOGLE ADSENSE ---
const AdBanner = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const pushAd = () => {
      if (adRef.current && adRef.current.innerHTML === '') {
        if (adRef.current.clientWidth > 0) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.log('AdSense Push Error:', err);
          }
        }
      }
    };
    const timer = setTimeout(pushAd, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-900/10">
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%', minHeight: '100px' }}
           ref={adRef}
           data-ad-client="ca-pub-3040128091952429"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

// --- QUESTÕES ---
const QUESTIONS = [
  {
    id: 1,
    text: 'Qual é o principal objetivo da NR 20?',
    options: [
      'a) Regular o uso de extintores em empresas.',
      'b) Garantir a segurança e saúde dos trabalhadores que lidam com inflamáveis e combustíveis.',
      'c) Normatizar o uso de equipamentos elétricos.',
      'd) Definir o funcionamento das lojas de conveniência.',
    ],
    correct: 1,
    explanation:
      'A NR 20 trata especificamente de inflamáveis e combustíveis, visando proteger a integridade física dos trabalhadores nestes ambientes de alto risco, como postos de serviços.',
  },
  {
    id: 2,
    text: 'A análise de risco prevista na NR 20 deve ser feita por:',
    options: [
      'a) Qualquer frentista com experiência.',
      'b) Um engenheiro ou técnico em segurança do trabalho capacitado.',
      'c) O gerente do posto de combustíveis.',
      'd) O Corpo de Bombeiros local.',
    ],
    correct: 1,
    explanation:
      'Devido à complexidade dos riscos de explosão e incêndio, apenas profissionais qualificados (engenheiros ou técnicos de segurança) possuem o conhecimento técnico exigido por lei para mapear essas ameaças.',
  },
  {
    id: 3,
    text: 'O curso básico da NR 20 para frentistas tem duração mínima de:',
    options: ['a) 4 horas', 'b) 6 horas', 'c) 8 horas', 'd) 16 horas'],
    correct: 2,
    explanation:
      'A norma estabelece uma carga horária mínima de 8 horas (curso básico) para os frentistas, garantindo que recebam as instruções vitais de segurança e emergência.',
  },
  {
    id: 4,
    text: 'O ponto de fulgor é:',
    options: [
      'a) A temperatura máxima que um líquido pode atingir antes de evaporar.',
      'b) A menor temperatura na qual o combustível libera vapores inflamáveis.',
      'c) O ponto onde o combustível entra em combustão espontânea.',
      'd) A temperatura ideal de armazenamento.',
    ],
    correct: 1,
    explanation:
      'É um conceito crucial: é a temperatura mais baixa em que um líquido libera vapores suficientes para formar uma mistura que pode pegar fogo. Abaixo dessa temperatura, ele não inflama com uma faísca.',
  },
  {
    id: 5,
    text: 'O GLP (Gás Liquefeito de Petróleo) é composto principalmente por:',
    options: [
      'a) Metano e etano',
      'b) Propano e butano',
      'c) Oxigênio e hidrogênio',
      'd) Gás carbônico e metano',
    ],
    correct: 1,
    explanation:
      'O GLP (Gás de cozinha) é uma mistura, sendo os principais o Propano e o Butano. Um detalhe importante: ele é mais pesado que o ar e se acumula próximo ao chão em caso de vazamentos.',
  },
  {
    id: 6,
    text: 'A diferença entre GLP e GNV é que:',
    options: [
      'a) Ambos são gases permanentes à mesma pressão.',
      'b) O GLP é armazenado em alta pressão, enquanto o GNV é liquefeito.',
      'c) O GLP é liquefeito em baixa pressão, enquanto o GNV é comprimido a altas pressões.',
      'd) Não há diferença entre eles.',
    ],
    correct: 2,
    explanation:
      'Essa diferença é vital para evitar acidentes: o GLP fica líquido sob baixa pressão no cilindro, enquanto o GNV (Gás Natural Veicular) permanece como gás, mas é armazenado sob altíssima pressão (aprox. 200 atm).',
  },
  {
    id: 7,
    text: 'O EPC (Equipamento de Proteção Coletiva) tem como principal função:',
    options: [
      'a) Proteger individualmente o trabalhador.',
      'b) Ser utilizado apenas em emergências.',
      'c) Proteger um grupo de pessoas e o ambiente de trabalho.',
      'd) Substituir o uso de EPIs.',
    ],
    correct: 2,
    explanation:
      'EPCs são medidas físicas no ambiente (como piso antiderrapante, exaustores e sinalização) projetadas para proteger todos os trabalhadores e clientes do posto simultaneamente.',
  },
  {
    id: 8,
    text: 'Qual das opções abaixo é um exemplo de EPI?',
    options: [
      'a) Piso antiderrapante',
      'b) Exaustor de gases',
      'c) Óculos de proteção',
      'd) Corrimão de segurança',
    ],
    correct: 2,
    explanation:
      'EPI significa Equipamento de Proteção INDIVIDUAL. Os óculos, as luvas e as botas protegem especificamente o trabalhador que os está vestindo.',
  },
  {
    id: 9,
    text: 'O uso de EPI é obrigatório quando:',
    options: [
      'a) O EPC for insuficiente para eliminar ou reduzir os riscos.',
      'b) O trabalhador desejar utilizá-lo.',
      'c) Não houver supervisão no local de trabalho.',
      'd) O empregador não disponibilizar EPC.',
    ],
    correct: 0,
    explanation:
      'A lei determina que a prioridade é sempre o EPC (que protege todos). O EPI torna-se obrigatório como barreira final quando as medidas coletivas não conseguem eliminar 100% os riscos.',
  },
  {
    id: 10,
    text: 'As fontes de ignição que podem iniciar incêndios incluem:',
    options: [
      'a) Água fria e superfícies lisas.',
      'b) Eletricidade estática, faíscas e chamas abertas.',
      'c) Ventilação e limpeza.',
      'd) Luz solar e piso úmido.',
    ],
    correct: 1,
    explanation:
      "Para o fogo ocorrer, precisamos do 'triângulo do fogo': Combustível, Oxigênio e Calor (ignição). Até mesmo a eletricidade estática acumulada no corpo ou faíscas do motor do carro podem ser essa fonte letal de calor.",
  },
  {
    id: 11,
    text: 'Em caso de vazamento grande de produto inflamável, o procedimento correto é:',
    options: [
      'a) Lavar o local com pouca água.',
      'b) Afastar curiosos, eliminar fontes de ignição e avisar as autoridades competentes.',
      'c) Ligar o ventilador para dissipar os gases.',
      'd) Esperar o gás evaporar naturalmente.',
    ],
    correct: 1,
    explanation:
      'Em grandes vazamentos, a nuvem de gás cria um risco iminente de explosão em massa. A ação deve ser evacuar a área, isolar fontes de calor e chamar os Bombeiros imediatamente.',
  },
  {
    id: 12,
    text: 'Em caso de acidente com vítima inconsciente que não respira, deve-se:',
    options: [
      'a) Deitar a vítima e aguardar socorro sem fazer nada.',
      'b) Provocar o vômito imediatamente.',
      'c) Realizar respiração artificial e chamar o SAMU ou Bombeiros.',
      'd) Dar água à vítima.',
    ],
    correct: 2,
    explanation:
      'Sem respiração, o cérebro sofre danos irreversíveis em minutos. Acionar o resgate e iniciar imediatamente as manobras de reanimação (como a RCP) salva vidas.',
  },
  {
    id: 13,
    text: 'Qual é a função principal do Plano de Resposta a Emergências exigido pela NR 20?',
    options: [
      'a) Aumentar a produtividade do posto de combustíveis.',
      'b) Registrar o número de funcionários treinados.',
      'c) Determinar procedimentos e ações a serem adotadas em caso de acidente.',
      'd) Controlar o estoque de combustíveis e lubrificantes.',
    ],
    correct: 2,
    explanation:
      'O Plano existe para evitar o pânico. Ele é um manual prático que padroniza exatamente quem faz o quê no exato momento em que um sinistro ocorre.',
  },
  {
    id: 14,
    text: 'As instalações de inflamáveis devem ser armazenadas:',
    options: [
      'a) Próximas a prédios e fontes de calor.',
      'b) Em áreas isoladas, ventiladas e sinalizadas.',
      'c) Dentro de escritórios administrativos.',
      'd) Ao lado de áreas de convivência dos funcionários.',
    ],
    correct: 1,
    explanation:
      'A ventilação natural dissipa os vapores perigosos e o isolamento garante que, caso haja um incêndio, ele não se propague rapidamente para escritórios ou vizinhanças.',
  },
  {
    id: 15,
    text: 'Qual o tipo de curso exigido para trabalhadores da manutenção e inspeção em postos de combustíveis?',
    options: [
      'a) Curso básico de 8 horas.',
      'b) Curso intermediário de 16 horas.',
      'c) Curso de integração de 4 horas.',
      'd) Curso avançado de 40 horas.',
    ],
    correct: 1,
    explanation:
      'Como o pessoal da manutenção atua diretamente com partes críticas, internas e abertas dos equipamentos (tanques, bombas), eles necessitam de um treinamento mais robusto de 16 horas.',
  },
  {
    id: 16,
    text: 'Os extintores de PQS de 50 kg são indicados para:',
    options: [
      'a) Somente incêndios elétricos.',
      'b) Somente incêndios em madeira e papel.',
      'c) Incêndios das classes A, B e C.',
      'd) Exclusivamente incêndios com líquidos inflamáveis.',
    ],
    correct: 2,
    explanation:
      'O Pó Químico Seco (PQS) age abafando e interrompendo a queima. Ele é excelente em postos pois combate líquidos (Classe B) e áreas energizadas (Classe C) de forma segura.',
  },
  {
    id: 17,
    text: 'Em caso de emergência de grande porte, é correto afirmar que:',
    options: [
      'a) Pode ser controlada apenas pela brigada local.',
      'b) Exige intervenção do Corpo de Bombeiros.',
      'c) Não há risco para pessoas ou meio ambiente.',
      'd) Deve ser ignorada até que a gerência chegue.',
    ],
    correct: 1,
    explanation:
      'Grandes acidentes saem do controle rapidamente. A brigada local faz a contenção inicial, mas o combate real com espuma pesada e equipamentos isolantes exige os Bombeiros Militares.',
  },
  {
    id: 18,
    text: 'Os líquidos combustíveis são aqueles com ponto de fulgor:',
    options: [
      'a) Inferior a 21°C.',
      'b) Entre 4°C e 21°C.',
      'c) Igual ou superior a 60°C e inferior a 93°C',
      'd) Acima de 100°C.',
    ],
    correct: 2,
    explanation:
      'A norma separa inflamáveis (que geram vapor fácil) de combustíveis (que precisam de mais calor para vaporizar, como o Diesel). Combustíveis têm ponto de fulgor entre 60°C e 93,3°C.',
  },
  {
    id: 19,
    text: 'Qual é o primeiro procedimento ao identificar um pequeno vazamento de produto inflamável?',
    options: [
      'a) Jogar pó químico seco imediatamente.',
      'b) Isolar a área e lavar com grande quantidade de água.',
      'c) Acender uma chama para queimar o vapor.',
      'd) Tentar recolher o líquido com panos.',
    ],
    correct: 1,
    explanation:
      'Conforme protocolos base, em pequenos derrames lava-se (ou usa-se material absorvente/areia) com o local previamente isolado, evitando que alguém inicie uma centelha perto.',
  },
  {
    id: 20,
    text: 'A Brigada de Emergência tem a função de:',
    options: [
      'a) Apenas verificar os equipamentos de segurança uma vez por ano.',
      'b) Atuar somente em treinamentos teóricos.',
      'c) Responder rapidamente a situações de emergência e apoiar o Corpo de Bombeiros.',
      'd) Organizar eventos e palestras sobre meio ambiente.',
    ],
    correct: 2,
    explanation:
      'Os brigadistas são os guardiões da pista. Sua função é ação rápida: acionar alarmes, combater princípios de fogo e evacuar pessoas até a chegada do socorro oficial.',
  },
  {
    id: 21,
    text: 'Entre os items abaixo, qual NÃO é considerado um Equipamento de Proteção Coletiva (EPC)?',
    options: [
      'a) Corrimão e guarda-corpos.',
      'b) Piso antiderrapante.',
      'c) Armário antichamas.',
      'd) Capacete de segurança.',
    ],
    correct: 3,
    explanation:
      'O capacete é o clássico exemplo de Equipamento de Proteção Individual (EPI), pois protege unicamente o crânio do próprio funcionário que o está utilizando.',
  },
  {
    id: 22,
    text: 'Qual é a frequência recomendada para o curso de atualização (reciclagem) da maioria dos frentistas?',
    options: [
      'a) Anualmente.',
      'b) A cada dois anos.',
      'c) A cada três anos.',
      'd) A cada cinco anos.',
    ],
    correct: 2,
    explanation:
      'Segundo a apostila (pág. 2), a maioria dos frentistas deve retornar para reciclagem (curso de 4 horas) a cada três anos.',
  },
  {
    id: 23,
    text: 'Qual a duração mínima do curso de integração para quem trabalha em lojas de conveniência ou escritórios de postos?',
    options: ['a) 2 horas', 'b) 4 horas', 'c) 8 horas', 'd) 16 horas'],
    correct: 1,
    explanation:
      'Trabalhadores de conveniência ou escritório devem realizar o curso de integração com carga horária mínima de 4 horas (pág. 2).',
  },
  {
    id: 24,
    text: 'Como são classificadas as instalações dos "Postos de serviço com inflamáveis e/ou líquidos combustíveis"?',
    options: ['a) Classe I', 'b) Classe II', 'c) Classe III', 'd) Classe Especial'],
    correct: 0,
    explanation:
      'Os postos de serviço enquadram-se na Classe I conforme a atividade prevista na norma (pág. 6).',
  },
  {
    id: 25,
    text: 'O que representa o LII (Limite Inferior de Inflamabilidade)?',
    options: [
      'a) A máxima concentração de gás para queimar.',
      'b) A concentração "ideal" de oxigênio.',
      'c) A mínima concentração de gás no ar capaz de provocar a combustão com fonte de ignição.',
      'd) A temperatura de congelamento do combustível.',
    ],
    correct: 2,
    explanation:
      'O LII é o limite mínimo abaixo do qual a mistura é "pobre" e não queima (pág. 8).',
  },
  {
    id: 26,
    text: 'Qual a temperatura de combustão típica de sólidos combustíveis que necessitam ser aquecidos?',
    options: ['a) Abaixo de 0°C.', 'b) Entre 4°C e 21°C.', 'c) Aproximadamente 60°C.', 'd) Acima de 100°C.'],
    correct: 3,
    explanation:
      'Sólidos combustíveis geralmente têm sua temperatura de combustão acima dos 100°C (pág. 9).',
  },
  {
    id: 27,
    text: 'Qual substância é adicionada ao GLP para que ele tenha o odor característico e permita detectar vazamentos?',
    options: ['a) Propano puro.', 'b) Butano.', 'c) Mercaptana.', 'd) Metano.'],
    correct: 2,
    explanation:
      'A mercaptana é o agente que dá o cheiro ao GLP, já que o propano e butano são incolores e inodoros (pág. 10).',
  },
  {
    id: 28,
    text: 'Em salas de manipulação ou armazenamento de inflamáveis, qual deve ser a resistência mínima ao fogo da construção?',
    options: ['a) 15 minutos.', 'b) 30 minutos.', 'c) 60 minutos.', 'd) 120 minutos.'],
    correct: 3,
    explanation:
      'A construção deve ter resistência ao fogo de 120 minutos para garantir a segurança estrutural (pág. 19).',
  },
  {
    id: 29,
    text: 'Em caso de contato de produtos químicos com os olhos, qual o tempo mínimo de lavagem recomendado?',
    options: ['a) 2 minutos.', 'b) 5 minutos.', 'c) 10 minutos.', 'd) 15 minutos.'],
    correct: 3,
    explanation:
      'Deve-se lavar com água em abundância por no mínimo 15 minutos (pág. 30).',
  },
  {
    id: 30,
    text: 'Qual o procedimento correto de primeiros socorros em caso de ingestão de combustível?',
    options: [
      'a) Provocar o vômito imediatamente.',
      'b) Não provocar vômitos.',
      'c) Dar leite gelado à vítima.',
      'd) Realizar lavagem gástrica manual.',
    ],
    correct: 1,
    explanation:
      'Em caso de ingestão, as orientações de primeiros socorros proíbem provocar vômitos devido ao risco de aspiração pulmonar (pág. 30).',
  },
];

// --- FUNÇÃO INTEGRAÇÃO GEMINI API ---
const callGeminiAPI = async (prompt, isTutorMsg = false) => {
  const apiKey = 'AIzaSyBUQUCeNuWCYXvpZRgtgEpbkNkflIExKsI';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [{ text: `Você é Eliot, a Inteligência Artificial biotecnológica da escola ETX Academy. Regras: 1. Baseie-se na NR 20. 2. Evite a FISPQ a menos que crucial. 3. Explique GLP (gás de cozinha, líquido sob pressão) e GNV (gás veicular, gasoso alta pressão) de forma simples. 4. Cite biometano e outros combustíveis veiculares por curiosidade. 5. Seja amigável.` }],
    },
  };
  const delays = [1000, 2000, 4000];
  for (let i = 0; i < delays.length; i++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`Falha`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      if (i === delays.length - 1) throw new Error("API Indisponível");
      await new Promise((res) => setTimeout(res, delays[i]));
    }
  }
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function App() {
  const [step, setStep] = useState('intro');
  const [userData, setUserData] = useState({ nome: '', email: '', whatsapp: '', nascimento: '', fezCurso: '', qualEscola: '' });
  const [aceitouTermos, setAceitouTermos] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [isSmsSending, setIsSmsSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40); 
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [aiExplanations, setAiExplanations] = useState({});
  const [isAiLoading, setIsAiLoading] = useState({});
  const [isDesktop, setIsDesktop] = useState(true);
  const [isAnswering, setIsAnswering] = useState(false);
  const [tutorMsg, setTutorMsg] = useState(null);
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [displayedIntro, setDisplayedIntro] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackOverlay, setFeedbackOverlay] = useState(null);
  const typingAudioRef = useRef(null);
  const introCardRef = useRef(null);

  const handleMouseMoveCard = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -2; 
    const rotateY = ((x - centerX) / centerX) * 2;
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeaveCard = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--rotate-x', `0deg`);
    card.style.setProperty('--rotate-y', `0deg`);
  };

  const todayData = new Date();
  const maxDateString = `${todayData.getFullYear()}-${String(todayData.getMonth() + 1).padStart(2, '0')}-${String(todayData.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    document.title = 'ETX Academy | Desafio NR 20';
    setIsDesktop(window.innerWidth >= 1280);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1280);
    window.addEventListener('resize', handleResize);

    // --- INJEÇÃO DA GOOGLE TAG (G-R5R1WW3QRL) ---
    const gtScript1 = document.createElement('script');
    gtScript1.src = "https://www.googletagmanager.com/gtag/js?id=G-R5R1WW3QRL";
    gtScript1.async = true;
    document.head.appendChild(gtScript1);

    const gtScript2 = document.createElement('script');
    gtScript2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-R5R1WW3QRL');
    `;
    document.head.appendChild(gtScript2);

    // --- ADICIONA TAG DO GOOGLE ADSENSE ---
    let adsenseMeta = document.querySelector('meta[name="google-adsense-account"]');
    if (!adsenseMeta) {
      adsenseMeta = document.createElement('meta');
      adsenseMeta.name = "google-adsense-account";
      adsenseMeta.content = "ca-pub-3040128091952429";
      document.head.appendChild(adsenseMeta);
    }

    let adsenseScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (!adsenseScript) {
      adsenseScript = document.createElement('script');
      adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3040128091952429";
      adsenseScript.async = true;
      adsenseScript.crossOrigin = "anonymous";
      document.head.appendChild(adsenseScript);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (step === 'result') {
      generateTutorMessage();
      const fullIntro = "Oi, eu sou o Eliot, a inteligência Artificial biotecnológica da ETX Academy!";
      setIsTyping(true);
      setDisplayedIntro("");
      let charIndex = 0;
      typingAudioRef.current = new Audio(SOUNDS.typing);
      typingAudioRef.current.loop = true;
      typingAudioRef.current.volume = 0.5;
      typingAudioRef.current.play().catch(e => console.log('Audio typing bloqueado', e));
      const typingInterval = setInterval(() => {
        setDisplayedIntro(fullIntro.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex >= fullIntro.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
          if (typingAudioRef.current) { typingAudioRef.current.pause(); typingAudioRef.current.currentTime = 0; }
        }
      }, 40);
      return () => { clearInterval(typingInterval); if (typingAudioRef.current) typingAudioRef.current.pause(); };
    }
  }, [step]);

  useEffect(() => {
    let timer;
    if (step === 'quiz' && !isTimeOut && timeLeft > 0 && !feedbackOverlay && !isAnswering) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'quiz' && !isTimeOut && !feedbackOverlay && !isAnswering) {
      playAudio('timeout');
      setIsTimeOut(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, step, isTimeOut, feedbackOverlay, isAnswering]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'whatsapp') {
      let v = value.replace(/\D/g, '').substring(0, 11);
      let formatted = v;
      if (v.length > 2) formatted = `(${v.substring(0,2)}) ${v.substring(2)}`;
      if (v.length > 7) formatted = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
      setUserData((prev) => ({ ...prev, whatsapp: formatted }));
    } else if (name === 'nascimento') {
      const yearPart = value.split('-')[0];
      if (yearPart && yearPart.length > 4) { setUserData((prev) => ({ ...prev, nascimento: '' })); return; }
      setUserData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!aceitouTermos) return;
    if (userData.whatsapp.replace(/\D/g, '').length !== 11) { alert("Use 11 dígitos no WhatsApp."); return; }
    playAudio('click');
    setIsSmsSending(true);
    const justNumbers = userData.whatsapp.replace(/\D/g, '');
    const formattedPhone = `+55${justNumbers}`;
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsSmsSending(false);
      setShowVerification(true);
      setResendTimer(60); 
    } catch (error) {
      alert('Erro Firebase: ' + error.message);
      setIsSmsSending(false);
      if (window.recaptchaVerifier) { try { window.recaptchaVerifier.render().then((widgetId) => grecaptcha.reset(widgetId)); } catch (e) {} }
    }
  };

  const verifyCode = async () => {
    try {
      await window.confirmationResult.confirm(inputCode);
      playAudio('start_quiz');
      startQuizAfterValidation();
    } catch (error) {
      playAudio('timeout');
      alert('Código incorreto.');
    }
  };

  const startQuizAfterValidation = async () => {
    setShowVerification(false);
    setIsSubmitting(true);
    const randomized = shuffleArray(QUESTIONS);
    setShuffledQuestions(randomized);
    setUserAnswers(Array(randomized.length).fill(null));
    const payloadInicio = { ...userData, tipo: 'cadastro', pontuacao: 'Iniciou', totalPerguntas: QUESTIONS.length, dataHora: new Date().toLocaleString('pt-BR') };
    const payloadBoasVindas = { ...userData, tipo: 'boas_vindas', dataHora: new Date().toLocaleString('pt-BR') };
    try {
      await fetch(GOOGLE_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payloadInicio) });
      await fetch(GOOGLE_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payloadBoasVindas) });
    } catch (error) {}
    setIsSubmitting(false);
    setStep('quiz');
    setTimeLeft(40);
    setIsTimeOut(false);
    setSelectedOption(null);
  };

  const triggerInstantFeedback = () => {
    if (isAnswering) return;
    setIsAnswering(true);
    const isCorrect = selectedOption === shuffledQuestions[currentQIndex].correct;
    if (isCorrect) playAudio('correct_ans');
    else playAudio('wrong_ans');
    setTimeout(() => {
      setIsAnswering(false);
      const newAnswers = [...userAnswers];
      newAnswers[currentQIndex] = selectedOption;
      setUserAnswers(newAnswers);
      if (isCorrect) { setScore((prev) => prev + 1); }
      if (currentQIndex < shuffledQuestions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
        setTimeLeft(40);
        setIsTimeOut(false);
      } else {
        processQuizFinish(newAnswers);
      }
    }, 500); 
  };

  const handleTimeOutNext = () => {
    playAudio('click');
    const newAnswers = [...userAnswers];
    newAnswers[currentQIndex] = null;
    setUserAnswers(newAnswers);
    if (currentQIndex < shuffledQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(40);
      setIsTimeOut(false);
    } else {
      processQuizFinish(newAnswers);
    }
  };

  const processQuizFinish = (finalAnswers) => {
    const finalScore = finalAnswers.reduce((acc, ans, idx) => acc + (ans === shuffledQuestions[idx].correct ? 1 : 0), 0);
    setScore(finalScore);
    const percentage = (finalScore / QUESTIONS.length) * 100;
    if (percentage >= 80) { setFeedbackOverlay({ type: 'high', message: 'EXCELENTE PONTUAÇÃO!' }); playAudio('win_high'); }
    else if (percentage >= 60) { setFeedbackOverlay({ type: 'mid', message: 'BOA PONTUAÇÃO!' }); playAudio('win_mid'); }
    else { setFeedbackOverlay({ type: 'low', message: 'PODE MELHORAR!' }); playAudio('fail'); }
    setTimeout(() => { setFeedbackOverlay(null); setStep('result'); finishQuizAction(finalScore, finalAnswers); }, 3000);
  };

  const finishQuizAction = async (finalScore) => {
    setIsSubmitting(true);
    const payload = { ...userData, tipo: 'conclusao', pontuacao: finalScore, totalPerguntas: QUESTIONS.length, dataHora: new Date().toLocaleString('pt-BR') };
    try { await fetch(GOOGLE_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) }); } catch (error) {}
    setIsSubmitting(false);
  };

  const requestDetailedEmail = async () => {
    if (emailSent || isSendingEmail) return;
    playAudio('click');
    setIsSendingEmail(true);
    const payload = { tipo: 'send_summary_email', nome: userData.nome, email: userData.email, score: score, total: shuffledQuestions.length, resumo: shuffledQuestions.map((q, idx) => ({ pergunta: q.text, suaResposta: userAnswers[idx] !== null ? q.options[userAnswers[idx]] : 'N/A', respostaCorreta: q.options[q.correct], isCorrect: userAnswers[idx] === q.correct, explicacao: q.explanation })) };
    try { await fetch(GOOGLE_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) }); setEmailSent(true); alert('E-mail enviado!'); } catch (error) { alert('Erro no envio.'); }
    setIsSendingEmail(false);
  };

  const explainWrongAnswer = async (qIndex) => {
    setIsAiLoading((prev) => ({ ...prev, [qIndex]: true }));
    const question = shuffledQuestions[qIndex];
    const prompt = `Questão: "${question.text}". Correta: "${question.options[question.correct]}". Explique o erro.`;
    try {
      const explanation = await callGeminiAPI(prompt, false);
      setAiExplanations((prev) => ({ ...prev, [qIndex]: { text: explanation } }));
    } catch (e) {
      setAiExplanations((prev) => ({ ...prev, [qIndex]: { text: `A correta era: ${question.options[question.correct]}. ${question.explanation}` } }));
    } finally { setIsAiLoading((prev) => ({ ...prev, [qIndex]: false })); }
  };

  const generateTutorMessage = async () => {
    setIsTutorLoading(true);
    const perc = Math.round((score / shuffledQuestions.length) * 100);
    const prompt = `Resultado: ${perc}%. Dê parabéns e fale dos 10% de desconto por 7 dias úteis para novas matrículas.`;
    try {
      const explanation = await callGeminiAPI(prompt, true);
      setTutorMsg(explanation);
    } catch(e) {
      setTutorMsg("Parabéns pela conclusão! Use seu desconto de 10% em até 7 dias úteis para novas matrículas na ETX Academy.");
    } finally { setIsTutorLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans selection:bg-[#00FF00] selection:text-[#020617] relative w-full overflow-x-hidden print:bg-white print:text-black">
      <div id="recaptcha-container"></div>
      <style>{`
        body, html { background-color: #020617 !important; margin: 0; padding: 0; width: 100%; height: 100%; } 
        @keyframes floatUp { 0% { transform: translateY(110vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; } } 
        .confetti-piece { position: fixed; animation: floatUp 3s ease-out forwards; z-index: 100; font-size: 2.5rem; } 
        @media print { .no-print { display: none !important; } .print-container { max-width: 100% !important; padding: 0 !important; } }
      `}</style>

      {feedbackOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="p-10 rounded-3xl border-4 flex flex-col items-center text-center mx-4 animate-in zoom-in duration-500 bg-slate-900 border-[#00FF00]">
             <h2 className="text-4xl md:text-5xl font-black uppercase text-[#00FF00]">{feedbackOverlay.message}</h2>
          </div>
        </div>
      )}

      <header className="no-print w-full p-6 bg-[#020617] border-b border-slate-800 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter"><span className="text-[#00AAFF]">ETX</span> <span className="text-slate-100">ACADEMY</span></h1>
          <p className="text-[#00AAFF] text-sm font-bold mt-2 uppercase tracking-[0.2em]">Sorte é estar preparado!</p>
        </div>
      </header>

      {/* GRELHA PRINCIPAL: Centro forçado a expandir e ser LARGO, barras só no Desktop */}
      <main className="flex-grow w-full max-w-[1700px] mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_300px] gap-6 xl:gap-10 items-start">
        
        {/* ESPAÇO PARA ANÚNCIO - ESQUERDA */}
        <aside className="hidden xl:flex flex-col gap-6 w-full no-print">
          <div className="w-full h-[300px] border-2 border-dashed border-slate-800/10 rounded-2xl overflow-hidden bg-slate-900/5">{isDesktop && <AdBanner />}</div>
          <div className="w-full h-[300px] border-2 border-dashed border-slate-800/10 rounded-2xl overflow-hidden bg-slate-900/5">{isDesktop && <AdBanner />}</div>
          <div className="w-full h-[300px] border-2 border-dashed border-slate-800/10 rounded-2xl overflow-hidden bg-slate-900/5">{isDesktop && <AdBanner />}</div>
        </aside>

        {/* COLUNA CENTRAL: PRIORIDADE TOTAL DE LARGURA */}
        <div className="w-full flex flex-col gap-6 min-w-0">
          
          {/* ANÚNCIO TOPO CENTRAL */}
          <div className="w-full min-h-[90px] border-2 border-dashed border-slate-800/10 rounded-2xl no-print overflow-hidden bg-slate-900/5"><AdBanner /></div>

          {step === 'intro' && (
            <div onMouseMove={handleMouseMoveCard} onMouseLeave={handleMouseLeaveCard} style={{ transform: 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))' }} className="no-print w-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl text-center animate-in fade-in">
              <div className="w-28 h-28 bg-[#00FF00]/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,255,0,0.15)]"><Fuel className="w-14 h-14 text-[#00FF00]" /></div>
              <h2 className="text-4xl font-black mb-6 text-white tracking-tight">Desafio NR 20</h2>
              <p className="text-slate-300 mb-10 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
                <strong className="text-[#00AAFF]">Teste os seus conhecimentos sobre inflamáveis e segurança <br/> <span className="text-[#00FF00]">(NR20 para Frentistas).</span></strong>
              </p>
              <button onClick={() => { playAudio('click'); setStep('form'); }} className="bg-gradient-to-r from-[#00FF00] to-[#00AAFF] text-[#020617] font-black text-2xl py-6 px-16 rounded-full transform hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,0,0.3)]">Começar o Desafio <Play className="w-7 h-7 inline ml-2" /></button>
            </div>
          )}

          {step === 'form' && (
            <div className="no-print w-full bg-slate-900/80 p-6 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-8">
              <button onClick={() => { playAudio('click'); if (window.confirm("Os dados serão perdidos. Voltar?")) setStep('intro'); }} className="text-[#00AAFF] mb-8 flex items-center gap-2 font-bold bg-[#00AAFF]/10 px-6 py-3 rounded-xl hover:bg-[#00AAFF]/20 transition-all"><ArrowLeft className="w-4 h-4" /> Voltar para o Início</button>
              
              {showVerification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-md">
                  <div className="bg-slate-900 p-10 rounded-3xl border-2 border-[#00AAFF]/50 text-center m-4 max-w-md w-full shadow-2xl animate-in zoom-in">
                    <h3 className="text-3xl font-black text-white mb-4">Código de Segurança</h3>
                    <p className="text-slate-400 mb-8 text-lg">A ETX Academy enviou um SMS oficial para o número: <strong className="text-white block mt-2 text-xl">{userData.whatsapp}</strong></p>
                    <input type="text" maxLength={6} value={inputCode} onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => { if (e.key === 'Enter' && inputCode.length === 6) verifyCode(); }} className="w-full bg-[#020617] border-2 border-slate-700 text-center text-5xl font-bold p-6 rounded-2xl text-[#00FF00] mb-8 outline-none focus:border-[#00AAFF] transition-all" placeholder="000000" />
                    <div className="flex gap-4">
                        <button onClick={() => setShowVerification(false)} className="flex-1 bg-slate-800 text-white font-bold py-5 rounded-xl">Voltar</button>
                        <button onClick={verifyCode} disabled={inputCode.length !== 6} className="flex-1 bg-[#00AAFF] text-[#020617] font-black py-5 rounded-xl disabled:opacity-50">Validar</button>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-4xl font-black mb-10 text-center text-white border-b border-slate-800 pb-6">Credenciais de Acesso</h2>
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3"><label className="text-base font-bold text-slate-300">Nome Completo</label><input required name="nome" value={userData.nome} onChange={handleInputChange} type="text" className="w-full bg-[#020617] border border-slate-700 rounded-2xl p-5 text-lg text-white outline-none focus:border-[#00AAFF] transition-all" placeholder="Seu nome" /></div>
                  <div className="space-y-3"><label className="text-base font-bold text-slate-300">E-mail</label><input required name="email" value={userData.email} onChange={handleInputChange} type="email" className="w-full bg-[#020617] border border-slate-700 rounded-2xl p-5 text-lg text-white outline-none focus:border-[#00AAFF] transition-all" placeholder="email@exemplo.com" /></div>
                  <div className="space-y-3"><label className="text-base font-bold text-slate-300">WhatsApp</label><input required name="whatsapp" value={userData.whatsapp} onChange={handleInputChange} type="tel" className="w-full bg-[#020617] border border-slate-700 rounded-2xl p-5 text-lg text-white outline-none focus:border-[#00AAFF] transition-all" placeholder="(69) 90000-0000" /></div>
                  <div className="space-y-3"><label className="text-base font-bold text-slate-300">Data de Nascimento</label><input required name="nascimento" value={userData.nascimento} onChange={handleInputChange} type="date" max={maxDateString} className="w-full bg-[#020617] border border-slate-700 rounded-2xl p-5 text-lg text-white outline-none focus:border-[#00AAFF] transition-all [color-scheme:dark]" /></div>
                </div>
                <div className="p-8 bg-[#020617]/50 rounded-3xl border border-slate-800">
                  <label className="text-lg font-bold text-white mb-6 block">Já fez o curso de Frentista anteriormente?</label>
                  <div className="flex gap-10"><label className="flex items-center gap-3 cursor-pointer text-xl"><input type="radio" name="fezCurso" value="Sim" className="w-6 h-6" onChange={handleInputChange} required /> Sim</label><label className="flex items-center gap-3 cursor-pointer text-xl"><input type="radio" name="fezCurso" value="Não" className="w-6 h-6" onChange={handleInputChange} required /> Não</label></div>
                </div>
                <div className="mt-8 flex items-start gap-4 p-6 bg-[#00AAFF]/5 rounded-2xl border border-[#00AAFF]/20">
                  <input type="checkbox" id="termos" required checked={aceitouTermos} onChange={(e) => setAceitouTermos(e.target.checked)} className="w-6 h-6 mt-1 cursor-pointer" />
                  <label htmlFor="termos" className="text-sm text-slate-400 leading-relaxed cursor-pointer font-medium">Autorizo o uso dos meus dados para fins de comunicação da ETX Academy conforme o desafio solicitado.</label>
                </div>
                <button type="submit" disabled={isSubmitting || isSmsSending} className="w-full bg-gradient-to-r from-[#00FF00] to-[#00AAFF] text-[#020617] font-black py-6 rounded-2xl text-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95">{isSmsSending ? 'Carregando...' : 'Iniciar Teste'}</button>
              </form>
            </div>
          )}

          {step === 'quiz' && (
            <div className="no-print w-full bg-slate-900/80 p-6 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 border-b border-slate-800 pb-8">
                <div className="w-full">
                  <span className="text-[#00AAFF] font-black text-sm uppercase mb-4 block tracking-widest">Questão {currentQIndex + 1} de {shuffledQuestions.length}</span>
                  <h3 className="text-2xl sm:text-4xl font-bold text-white leading-tight">{shuffledQuestions[currentQIndex].text}</h3>
                </div>
                <div className={`shrink-0 flex items-center gap-3 font-mono text-3xl sm:text-4xl px-6 py-4 rounded-2xl font-black border-2 ${timeLeft <= 10 ? 'text-red-500 border-red-500 animate-pulse' : 'text-[#00FF00] border-slate-800 bg-[#020617]'}`}><Clock className="w-8 h-8" /> 00:{timeLeft.toString().padStart(2, '0')}</div>
              </div>
              <div className="space-y-5 w-full">
                {shuffledQuestions[currentQIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = shuffledQuestions[currentQIndex].correct === idx;
                  let bg = isAnswering ? (isSelected ? (isCorrect ? 'bg-[#00FF00]/80' : 'bg-red-600') : 'opacity-30') : (isSelected ? 'bg-[#00AAFF]/20 border-[#00AAFF]' : 'bg-[#020617] border-slate-800 hover:border-[#00AAFF]/40');
                  return ( <button key={idx} onClick={() => handleSelectOption(idx)} disabled={isAnswering} className={`w-full text-left p-6 sm:p-8 rounded-3xl border-2 transition-all flex items-center gap-5 ${bg}`}><div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-[#00AAFF]' : 'border-slate-600'}`}>{isSelected && <div className="w-3 h-3 rounded-full bg-white"/>}</div><span className="text-xl sm:text-2xl font-medium leading-relaxed">{opt}</span></button> );
                })}
              </div>
              <div className="mt-12 flex justify-end">
                {selectedOption !== null && !isAnswering && <button onClick={triggerInstantFeedback} className="w-full sm:w-auto bg-[#00FF00] text-[#020617] py-5 px-16 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-all">Avançar <ChevronRight className="inline ml-2" /></button>}
                {isAnswering && <div className="text-[#00FF00] font-black text-xl py-5">Próxima questão...</div>}
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="no-print w-full bg-slate-900/80 p-8 sm:p-14 rounded-[3rem] border border-slate-800 shadow-2xl animate-in zoom-in">
              <div className="text-center mb-12 border-b border-slate-800 pb-12">
                <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tighter">Seu Resultado: <span className="text-[#00FF00]">{score}</span> <span className="text-2xl opacity-50">de</span> {shuffledQuestions.length}</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                  <button onClick={() => setStep('summary')} className="w-full sm:w-auto bg-gradient-to-r from-[#00FF00] to-[#00AAFF] text-[#020617] font-black text-xl py-6 px-12 rounded-3xl shadow-xl hover:scale-105 transition-all"><FileText className="inline mr-2" /> Ver Resumo Detalhado</button>
                  <button onClick={requestDetailedEmail} disabled={emailSent} className="w-full sm:w-auto bg-[#020617] border-2 border-slate-700 text-white font-black text-xl py-6 px-12 rounded-3xl hover:bg-slate-800 transition-all">{emailSent ? <><CheckCircle className="inline mr-2" /> E-mail Enviado</> : <><Mail className="inline mr-2" /> Receber no E-mail</>}</button>
                </div>
              </div>
              
              <div className="bg-[#020617] p-8 sm:p-10 rounded-[2.5rem] border border-slate-800 shadow-inner">
                <div className="flex items-center gap-5 mb-8"><Bot className="w-12 h-12 text-[#00FF00]" /><h3 className="text-3xl font-black text-white">Eliot IA da ETX</h3></div>
                <div className="relative bg-[#00AAFF]/10 p-8 rounded-3xl rounded-tl-none mb-8 text-[#00AAFF] text-xl font-bold leading-relaxed">{displayedIntro}</div>
                {tutorMsg && <div className="p-8 rounded-3xl bg-slate-800/40 text-slate-200 text-lg sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700">{tutorMsg}</div>}
              </div>

              <div className="mt-14 bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] border-4 border-[#00FF00] text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,255,0,0.15)]">
                <div className="relative z-10">
                  <h2 className="text-4xl sm:text-5xl font-black mb-8 text-[#00FF00] uppercase tracking-tight">10% DE DESCONTO <br/><span className="text-white text-xl md:text-2xl mt-4 block font-bold opacity-80">(Válido por 7 dias úteis)</span></h2>
                  <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">Apresente seu resultado na ETX Academy para garantir seu benefício exclusivo em cursos profissionalizantes.</p>
                  <a href="https://wa.me/5569981197373" target="_blank" className="inline-flex items-center gap-4 bg-gradient-to-r from-[#00FF00] to-[#00AAFF] text-[#020617] font-black text-3xl px-12 py-7 rounded-3xl no-underline hover:scale-105 transition-transform"><MessageSquare /> Falar com Consultor</a>
                </div>
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="bg-white w-full text-slate-900 p-8 sm:p-14 rounded-[3rem] shadow-2xl relative animate-in fade-in">
              <div className="watermark-text opacity-5 select-none pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black rotate-[-45deg]">ETX ACADEMY</div>
              <div className="no-print fixed bottom-10 right-10 flex gap-6 z-50"><button onClick={() => setStep('result')} className="bg-slate-900 text-white px-8 py-5 rounded-full font-black text-xl shadow-2xl">Voltar</button><button onClick={handlePrintPDF} className="bg-[#00FF00] text-[#020617] px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(0,255,0,0.4)] hover:scale-105 transition-all"><Download className="inline mr-2" /> Salvar PDF</button></div>
              <div className="print-header hidden print:flex flex-col items-center text-center mb-14 pb-8 border-b-8 border-[#00FF00]"><h1 className="text-6xl font-black tracking-tighter text-[#0f172a]"><span className="text-[#00AAFF]">ETX</span> ACADEMY</h1><h2 className="text-3xl font-bold mt-10 text-slate-600 uppercase tracking-widest">Resumo Oficial Avaliativo: NR 20</h2><div className="text-2xl mt-6 font-bold flex gap-12 text-slate-800"><span>Aluno: <strong className="text-black uppercase underline decoration-4 decoration-[#00AAFF]">{userData.nome}</strong></span><span>Acertos: <strong className="text-[#00AAFF]">{score} de 30</strong></span></div></div>
              <div className="space-y-10 relative z-10 w-full">
                <h3 className="text-4xl font-black text-slate-900 mb-10 border-b-4 border-slate-100 pb-4">Revisão do Gabarito:</h3>
                {shuffledQuestions.map((q, idx) => (<div key={idx} className="p-10 rounded-[2.5rem] border border-slate-200 bg-slate-50 break-inside-avoid shadow-sm"><h4 className="font-bold text-2xl mb-8 leading-snug"><span className="text-[#00AAFF] font-black mr-2">{idx + 1}.</span> {q.text}</h4><div className={`p-6 rounded-2xl mb-6 font-bold text-xl border-2 ${userAnswers[idx] === q.correct ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-rose-50 border-rose-400 text-rose-900'}`}>{userAnswers[idx] !== null ? q.options[userAnswers[idx]] : 'Questão não respondida'}</div><div className="p-8 bg-[#00AAFF]/5 border-l-8 border-[#00AAFF] text-lg leading-relaxed rounded-r-2xl text-slate-700"><strong>Explicação Técnica:</strong> {q.explanation}</div></div>))}
              </div>
            </div>
          )}

          {/* ANÚNCIO RODAPÉ CENTRAL */}
          <div className="w-full min-h-[250px] border-2 border-dashed border-slate-800/10 rounded-3xl no-print mt-10 overflow-hidden bg-slate-900/5"><AdBanner /></div>
        </div>

        {/* ESPAÇO PARA ANÚNCIO - DIREITA */}
        <aside className="hidden xl:flex flex-col gap-6 w-full no-print">
          <div className="w-full h-[300px] border-2 border-dashed border-slate-800/10 rounded-2xl overflow-hidden bg-slate-900/5">{isDesktop && <AdBanner />}</div>
          <div className="w-full h-[300px] border-2 border-dashed border-slate-800/10 rounded-2xl overflow-hidden bg-slate-900/5">{isDesktop && <AdBanner />}</div>
          <div className="w-full h-[300px] border-2 border-dashed border-slate-800/10 rounded-2xl overflow-hidden bg-slate-900/5">{isDesktop && <AdBanner />}</div>
        </aside>
      </main>

      <footer className="no-print w-full py-10 bg-[#020617] border-t border-slate-800 text-center mt-auto"><p className="text-slate-500 text-base font-bold">ETX Academy - Ji-Paraná - RO - Contato/WhatsApp: (69) 9 8119-7373 - Todos os direitos reservados - 2026</p></footer>
    </div>
  );
}