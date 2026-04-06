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
  Info,
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

// --- COMPONENTES DE ANÚNCIOS À PROVA DE ERROS ---
const SidebarAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const pushAd = () => {
      if (adRef.current && adRef.current.innerHTML === '') {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.log('AdSense Push Error:', err);
        }
      }
    };
    const timer = setTimeout(pushAd, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[300px] h-[250px] flex items-center justify-center overflow-hidden bg-slate-900/10 rounded-2xl border border-slate-800/30 shrink-0">
      {/* Dimensões rígidas bloqueiam o AdSense de esmagar o site */}
      <ins className="adsbygoogle"
           style={{ display: 'inline-block', width: '300px', height: '250px' }}
           ref={adRef}
           data-ad-client="ca-pub-3040128091952429"
           data-full-width-responsive="false"></ins>
    </div>
  );
};

const BottomAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const pushAd = () => {
      if (adRef.current && adRef.current.innerHTML === '') {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.log('AdSense Push Error:', err);
        }
      }
    };
    const timer = setTimeout(pushAd, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-[150px] flex items-center justify-center overflow-hidden bg-slate-900/10 rounded-3xl border border-slate-800/30 mt-8">
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%' }}
           ref={adRef}
           data-ad-client="ca-pub-3040128091952429"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

// --- DADOS DAS QUESTÕES (Exatamente 30 Questões) ---
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
      'b) A concentration "ideal" de oxigênio.',
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
      parts: [
        {
          text: `Você é Eliot, a Inteligência Artificial biotecnológica da escola ETX Academy. Regras obrigatórias:
          1. Baseie toda explicação no conteúdo oficial da norma regulamentadora NR 20.
          2. EVITE citar a FISPQ, a menos que seja estritamente necessário. O foco principal deve ser a NR 20.
          3. Se o assunto for gases, explique de forma MUITO SIMPLES: GLP (Gás Liquefeito de Petróleo) é o famoso "gás de cozinha", armazenado em estado líquido sob pressão. GNV (Gás Natural Veicular) é outro tipo de combustível que se mantém em estado gasoso sob altíssima pressão. Além disso, por curiosidade, existem outros combustíveis como o biometano, que também é um gás veicular.
          4. Seja amigável, direto e encorajador.`,
        },
      ],
    },
  };
  
  const delays = [1000, 2000, 4000];
  
  for (let i = 0; i < delays.length; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Falha na conexão`);
      }
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
    } catch (err) {
      if (i === delays.length - 1) {
        throw new Error("API Indisponível");
      }
      await new Promise((res) => setTimeout(res, delays[i]));
    }
  }
};

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function App() {
  const [step, setStep] = useState('intro');
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    nascimento: '',
    fezCurso: '',
    qualEscola: '',
  });
  const [aceitouTermos, setAceitouTermos] = useState(true);
  
  // --- COOKIES E PRIVACIDADE ---
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  // SMS Verification Firebase
  const [showVerification, setShowVerification] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [isSmsSending, setIsSmsSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Quiz States
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

  // Layout State for Ads
  const [isDesktop, setIsDesktop] = useState(true);

  // Feedback Instantâneo
  const [isAnswering, setIsAnswering] = useState(false);

  // Estados para o Tutor IA 
  const [tutorMsg, setTutorMsg] = useState(null);
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [displayedIntro, setDisplayedIntro] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingAudioRef = useRef(null);

  // Estado para Animação Flutuante
  const [feedbackOverlay, setFeedbackOverlay] = useState(null);

  const introCardRef = useRef(null);

  // --- Função para o Efeito Visual Interativo (Mouse Move/Tilt + Spotlight) ---
  const handleMouseMoveCard = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spotlight
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    // 3D Tilt super leve
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

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesConsent', 'true');
    setCookiesAccepted(true);
  };

  // --- Função para calcular a Data Atual (Bloqueio Calendário) ---
  const todayData = new Date();
  const maxDateString = `${todayData.getFullYear()}-${String(todayData.getMonth() + 1).padStart(2, '0')}-${String(todayData.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    document.title = 'ETX Academy | Desafio NR 20';
    // Forçar a cor de fundo no body de forma definitiva
    document.body.style.backgroundColor = '#020617';
    
    setIsDesktop(window.innerWidth >= 1280);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1280);
    window.addEventListener('resize', handleResize);

    // Verificar consentimento de cookies prévio
    const accepted = localStorage.getItem('cookiesConsent');
    if (accepted === 'true') {
      setCookiesAccepted(true);
    }

    // --- ADICIONA TAG DO GOOGLE ADSENSE (O AdSense cuida das próprias regras de LGPD) ---
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

  // --- INJEÇÃO DA GOOGLE TAG (ANALÍTICA E PIXELS) APENAS APÓS ACEITAR COOKIES ---
  useEffect(() => {
    if (cookiesAccepted) {
      let gtScript1 = document.querySelector('script[src*="G-R5R1WW3QRL"]');
      if (!gtScript1) {
        const gTagScript = document.createElement('script');
        gTagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-R5R1WW3QRL";
        gTagScript.async = true;
        document.head.appendChild(gTagScript);

        const gTagConfig = document.createElement('script');
        gTagConfig.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R5R1WW3QRL');
        `;
        document.head.appendChild(gTagConfig);
      }

      // --- META PIXEL CODE ---
      if (typeof window !== 'undefined' && !window.fbq) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', '878694709798769');
        window.fbq('track', 'PageView');

        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=878694709798769&ev=PageView&noscript=1" />`;
        document.head.appendChild(noscript);
      }
    }
  }, [cookiesAccepted]);

  // Proteção contra Refresh/Atualização (F5)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step === 'quiz' || step === 'result') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  // Efeito do Tutor IA Automático e Balão Animado
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
          if (typingAudioRef.current) {
            typingAudioRef.current.pause();
            typingAudioRef.current.currentTime = 0;
          }
        }
      }, 40);

      return () => {
        clearInterval(typingInterval);
        if (typingAudioRef.current) {
          typingAudioRef.current.pause();
        }
      };
    }
  }, [step]);

  // Inicializa o reCAPTCHA invisível
  useEffect(() => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
      }
    );
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Web OTP API (Leitura automática SMS)
  useEffect(() => {
    if (showVerification && 'OTPCredential' in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp) => {
          setInputCode(otp.code);
          playAudio('success');
        })
        .catch((err) => console.log('Web OTP ignorado', err));
      return () => ac.abort();
    }
  }, [showVerification]);

  // Timer do Reenvio
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Timer das Questões
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

  // Tecla Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'Enter' &&
        step === 'quiz' &&
        selectedOption !== null &&
        !isTimeOut &&
        !feedbackOverlay &&
        !isAnswering
      ) {
        e.preventDefault();
        triggerInstantFeedback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, selectedOption, currentQIndex, isTimeOut, feedbackOverlay, isAnswering]);

  // Máscara do WhatsApp + Outros inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'whatsapp') {
      let v = value.replace(/\D/g, '').substring(0, 11);
      let formatted = v;
      if (v.length > 2) formatted = `(${v.substring(0,2)}) ${v.substring(2)}`;
      if (v.length > 7) formatted = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
      setUserData((prev) => ({ ...prev, whatsapp: formatted }));
    } else if (name === 'nascimento') {
      // Se digitar 5 números no ano, zera para corrigir
      const yearPart = value.split('-')[0];
      if (yearPart && yearPart.length > 4) {
        setUserData((prev) => ({ ...prev, nascimento: '' }));
        return;
      }
      setUserData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!aceitouTermos) return;
    
    if (userData.whatsapp.replace(/\D/g, '').length !== 11) {
      alert("Por favor, digite um número de WhatsApp válido com 11 dígitos (DDD + 9 + Número).");
      return;
    }

    playAudio('click');
    setIsSmsSending(true);

    const justNumbers = userData.whatsapp.replace(/\D/g, '');
    const formattedPhone = `+55${justNumbers}`;

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      window.confirmationResult = confirmationResult;
      setIsSmsSending(false);
      setShowVerification(true);
      setResendTimer(60); 
    } catch (error) {
      console.error('Erro Firebase SMS:', error);
      alert('Erro do Firebase: ' + error.message + '\n\nVerifique se o domínio atual está na lista de autorizados.');
      setIsSmsSending(false);
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.render().then((widgetId) => grecaptcha.reset(widgetId)); } catch (e) {}
      }
    }
  };

  const handleResendSms = async () => {
    if (resendTimer > 0) return;
    playAudio('click');
    setIsSmsSending(true);

    const justNumbers = userData.whatsapp.replace(/\D/g, '');
    const formattedPhone = `+55${justNumbers}`;

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setIsSmsSending(false);
      setResendTimer(60);
    } catch (error) {
      alert('Erro do Firebase ao reenviar: ' + error.message);
      setIsSmsSending(false);
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.render().then((widgetId) => grecaptcha.reset(widgetId)); } catch (e) {}
      }
    }
  };

  const verifyCode = async () => {
    try {
      await window.confirmationResult.confirm(inputCode);
      playAudio('success');
      startQuizAfterValidation();
    } catch (error) {
      playAudio('timeout');
      alert('Código incorreto ou expirado. Verifique o SMS recebido e tente novamente.');
    }
  };

  const startQuizAfterValidation = async () => {
    setShowVerification(false);
    setIsSubmitting(true);

    const randomized = shuffleArray(QUESTIONS);
    setShuffledQuestions(randomized);
    setUserAnswers(Array(randomized.length).fill(null));

    const payloadInicio = {
      ...userData,
      tipo: 'cadastro',
      pontuacao: 'Iniciou',
      totalPerguntas: QUESTIONS.length,
      dataHora: new Date().toLocaleString('pt-BR'),
    };
    
    const payloadBoasVindas = {
      ...userData,
      tipo: 'boas_vindas',
      dataHora: new Date().toLocaleString('pt-BR'),
    };

    try {
      await fetch(GOOGLE_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payloadInicio) });
      await fetch(GOOGLE_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payloadBoasVindas) });
    } catch (error) {}

    setIsSubmitting(false);
    setStep('quiz');
    setTimeLeft(40);
    setIsTimeOut(false);
    setSelectedOption(null);
    playAudio('start_quiz');
  };

  const handleSelectOption = (index) => {
    if (isAnswering) return;
    playAudio('click');
    setSelectedOption(index);
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

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

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
    const finalScore = finalAnswers.reduce(
      (acc, ans, idx) => acc + (ans === shuffledQuestions[idx].correct ? 1 : 0),
      0
    );
    setScore(finalScore);

    const percentage = (finalScore / QUESTIONS.length) * 100;
    let feedbackType = '';
    let feedbackMessage = '';

    if (percentage >= 80) {
      feedbackType = 'high';
      feedbackMessage = 'Excelente pontuação!';
      playAudio('win_high');
    } else if (percentage >= 60) {
      feedbackType = 'mid';
      feedbackMessage = 'Boa pontuação!';
      playAudio('win_mid');
    } else {
      feedbackType = 'low';
      feedbackMessage = 'Não foi dessa vez!';
      playAudio('fail');
    }

    setFeedbackOverlay({ type: feedbackType, message: feedbackMessage });

    setTimeout(() => {
      setFeedbackOverlay(null);
      finishQuizAction(finalScore, finalAnswers);
    }, 3000);
  };

  const finishQuizAction = async (finalScore, finalAnswers) => {
    setStep('result');
    setIsSubmitting(true);

    const payload = {
      ...userData,
      tipo: 'conclusao',
      pontuacao: finalScore,
      totalPerguntas: QUESTIONS.length,
      dataHora: new Date().toLocaleString('pt-BR'),
    };

    try {
      await fetch(GOOGLE_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDetailedEmail = async () => {
    if (emailSent || isSendingEmail) return;
    playAudio('click');
    setIsSendingEmail(true);

    const payload = {
      tipo: 'send_summary_email',
      nome: userData.nome,
      email: userData.email,
      score: score,
      total: shuffledQuestions.length,
      resumo: shuffledQuestions.map((q, idx) => {
        const userAnswerIndex = userAnswers[idx];
        return {
          pergunta: q.text,
          suaResposta: userAnswerIndex !== null ? q.options[userAnswerIndex] : 'Não respondida (Tempo esgotado)',
          respostaCorreta: q.options[q.correct],
          isCorrect: userAnswerIndex === q.correct,
          explicacao: q.explanation,
        };
      }),
    };

    try {
      await fetch(GOOGLE_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });
      setEmailSent(true);
      alert('Sucesso! O resumo completo foi enviado para o seu e-mail.');
    } catch (error) {
      alert('Ocorreu um erro ao enviar o e-mail. Pode fazer o download em PDF.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const explainWrongAnswer = async (qIndex) => {
    setIsAiLoading((prev) => ({ ...prev, [qIndex]: true }));
    const question = shuffledQuestions[qIndex];
    const userAnswerStr = userAnswers[qIndex] !== null ? question.options[userAnswers[qIndex]] : 'Nenhuma (tempo esgotado)';
    
    const prompt = `O aluno errou a questão: "${question.text}". Ele respondeu: "${userAnswerStr}". A resposta correta era: "${question.options[question.correct]}". Como Eliot, IA da ETX Academy, explique de forma detalhada mas fácil de entender o porquê do erro, focando nas diretrizes da NR 20.`;

    try {
      const explanation = await callGeminiAPI(prompt, false);
      const isError = explanation.toLowerCase().includes('erro api');
      setAiExplanations((prev) => ({ ...prev, [qIndex]: { text: explanation, isError: isError } }));
    } catch (e) {
      const fallbackExplicacao = `A alternativa correta é: "${question.options[question.correct]}". ${question.explanation} (Dica do Eliot: Conforme a NR 20, seguir as medidas de segurança é vital para evitar acidentes com inflamáveis).`;
      setAiExplanations((prev) => ({ ...prev, [qIndex]: { text: fallbackExplicacao, isError: false } }));
    } finally {
      setIsAiLoading((prev) => ({ ...prev, [qIndex]: false }));
    }
  };

  const generateTutorMessage = async () => {
    setIsTutorLoading(true);
    const perc = Math.round((score / shuffledQuestions.length) * 100);
    const prompt = `O aluno acabou de concluir o Desafio da NR 20 e teve um aproveitamento de ${perc}%. Vá DIRETO AO PONTO (não faça apresentações). Faça um elogio caloroso a ele, valorizando o seu conhecimento, e afirme claramente que ele tem direito a 10% de desconto nos cursos profissionalizantes da ETX Academy (válido  por 7 dias úteis após realizado esse teste, e só o desconto só é valido para novas matrículas, não vale para matrículas ativas). Lembre-o de que a ETX Academy é a escola mais procurada por empresas e pessoas que realmente querem um aprendizado de qualidade em Ji-Paraná e região. Seja encorajador. Mesmo se ele tiver errado alguma questão, dê uma palavra de incentivo.`;
    
    try {
      const explanation = await callGeminiAPI(prompt, true);
      setTutorMsg(explanation);
    } catch(e) {
      setTutorMsg("Parabéns pela conclusão do Desafio da NR 20! O seu esforço é muito valorizado. A ETX Academy é a escola mais procurada de Ji-Paraná e região por quem busca aprendizado de qualidade. Pela sua dedicação, você tem direito a 10% de desconto nos nossos cursos profissionalizantes (válido por 7 dias úteis)! Continue se capacitando.");
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const percResult = Math.round((score / QUESTIONS.length) * 100) || 0;
  const shareText = `Acabei de acertar ${percResult}% no Desafio Avaliativo de NR20 da ETX Academy! Duvido você bater minha nota. Faça o teste aqui: https://quiz-frentista-etx-academy.vercel.app`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#00FF00] selection:text-[#020617] relative w-full print:bg-white print:text-black">
      <div id="recaptcha-container"></div>

      <style>
        {`
          body, html {
            background-color: #020617 !important;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          @keyframes floatUp {
            0% { transform: translateY(110vh) rotate(0deg) scale(1); opacity: 1; }
            100% { transform: translateY(-20vh) rotate(360deg) scale(1.5); opacity: 0; }
          }
          .confetti-piece {
            position: fixed;
            animation: floatUp 3s ease-out forwards;
            z-index: 100;
            font-size: 2.5rem;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
          }
          @media print {
            body { background: white !important; color: black !important; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
            .print-container { max-width: 100% !important; padding: 0 !important; border: none !important; box-shadow: none !important; background: transparent !important; }
            h1, h2, h3, h4 { color: #0f172a !important; font-family: sans-serif; }
            p, span, div { color: #334155 !important; }
            .print-header { display: flex !important; margin-bottom: 40px; }
            .print-banner { border: 4px solid #00FF00 !important; background: white !important; color: black !important; border-radius: 16px; padding: 30px; text-align: center; }
            .watermark-text {
              position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 110px; font-weight: 900; color: rgba(0, 255, 0, 0.08) !important;
              z-index: -10; pointer-events: none;
            }
          }
        `}
      </style>

      {/* AVISO DE COOKIES/PRIVACIDADE FLUTUANTE NO RODAPÉ */}
      {!cookiesAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-[999] bg-[#020617] border-t border-slate-800 p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] no-print">
          <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto w-full text-center">
            <button
              onClick={handleAcceptCookies}
              className="w-full md:w-2/3 lg:w-1/2 bg-[#00FFFF] hover:bg-[#00e6e6] text-[#020617] font-black px-8 py-4 sm:py-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 text-xl sm:text-2xl"
            >
              Aceitar e Continuar
            </button>
            <p className="text-white font-bold text-[10px] sm:text-sm tracking-wider uppercase whitespace-normal sm:whitespace-nowrap">
              Para navegar no site e participar do quiz você precisa aceitar os termos.
            </p>
            <p className="text-slate-400 text-[9px] sm:text-[11px] leading-snug max-w-5xl">
              Utilizamos cookies e tecnologias semelhantes (como o Meta/Google Pixel e outros) para melhorar a sua experiência, analisar o tráfego do site e personalizar anúncios. Ao continuar a usar o nosso site, você concorda com a recolha do IP do dispositivo usado para acesso e dados de localização aproximada para estes fins analíticos e publicitários, de acordo com as diretrizes da LGPD.
            </p>
          </div>
        </div>
      )}

      {/* OVERLAY DE FEEDBACK ANIMADO E SUSPENSO (VIBRANTE) */}
      {feedbackOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 pointer-events-none">
          <div className={`p-10 rounded-3xl border-4 flex flex-col items-center text-center mx-4 animate-in zoom-in duration-500 transform scale-110 shadow-[0_0_80px_rgba(0,0,0,0.6)] ${
            feedbackOverlay.type === 'high' ? 'bg-[#00FF00]/10 border-[#00FF00] shadow-[0_0_100px_rgba(0,255,0,0.3)]' :
            feedbackOverlay.type === 'mid' ? 'bg-[#00AAFF]/10 border-[#00AAFF] shadow-[0_0_100px_rgba(0,170,255,0.3)]' :
            'bg-red-500/10 border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.3)]'
          }`}>
             {feedbackOverlay.type === 'high' && <span className="text-7xl mb-6 animate-bounce">🎉🎆</span>}
             {feedbackOverlay.type === 'mid' && <span className="text-7xl mb-6 animate-pulse">👍✨</span>}
             {feedbackOverlay.type === 'low' && <span className="text-7xl mb-6 animate-ping">😅❌</span>}
             <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${
               feedbackOverlay.type === 'high' ? 'text-[#00FF00]' :
               feedbackOverlay.type === 'mid' ? 'text-[#00AAFF]' :
               'text-red-500'
             }`}>
               {feedbackOverlay.message}
             </h2>
          </div>
          
          {feedbackOverlay.type === 'high' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(35)].map((_, i) => (
                <span key={i} className="confetti-piece" style={{
                  left: `${Math.random() * 100}vw`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  fontSize: `${Math.random() * 2 + 1}rem`
                }}>
                  {['🎉', '🎊', '🎆', '✨', '🏆'][Math.floor(Math.random() * 5)]}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <header className="no-print w-full p-6 bg-[#020617] border-b border-slate-800 shadow-lg flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-transparent opacity-80"></div>
        <div className="z-10 text-center">
          <h1 className="text-5xl font-black tracking-tighter">
            <span className="text-[#00AAFF]">ET</span><span className="text-[#00AAFF]">X</span> <span className="text-slate-100">ACADEMY</span>
          </h1>
          <p className="text-[#00AAFF] text-sm font-bold mt-2 uppercase tracking-[0.2em]">
            Sorte é estar preparado quando a oportunidade vem!
          </p>
        </div>
      </header>

      {/* ESTRUTURA RESPONSIVA CORRIGIDA DEFINITIVAMENTE: O Centro ocupa todo o espaço possível flex-1 max-w-full */}
      <main className="flex-grow flex flex-col xl:flex-row items-center xl:items-start justify-center p-4 sm:p-6 lg:p-8 print:p-0 gap-6 xl:gap-10 w-full max-w-[1400px] mx-auto">
        
        {/* ESPAÇO PARA ANÚNCIO - ESQUERDA */}
        <aside className="hidden xl:flex flex-col gap-6 w-[300px] shrink-0 sticky top-8 no-print">
          <SidebarAd />
          <SidebarAd />
        </aside>

        {/* COLUNA CENTRAL: COM FLEX-1 E MAX-W-4XL PARA GARANTIR LARGURA TOTAL NO CENTRO */}
        <div className="w-full flex-1 max-w-4xl print-container flex flex-col gap-6 min-w-0">

          {step === 'intro' && (
            <div
              onMouseMove={handleMouseMoveCard}
              onMouseLeave={handleMouseLeaveCard}
              style={{ transform: 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))', transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
              className="no-print w-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl text-center animate-in fade-in zoom-in relative overflow-hidden group"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 170, 255, 0.08), transparent 40%)',
                }}
              />

              <div className="w-28 h-28 bg-[#00FF00]/10 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_30px_rgba(0,255,0,0.15)]">
                <Fuel className="w-14 h-14 text-[#00FF00]" />
                <Sparkles className="w-8 h-8 text-[#00AAFF] absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h2 className="text-4xl font-black mb-6 relative z-10 text-white tracking-tight">
                Desafio NR 20
              </h2>

              <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed relative z-10 font-medium">
                <strong className="text-[#00AAFF] text-2xl block mb-3 font-black">
                  Teste os seus conhecimentos sobre inflamáveis e segurança <br className="hidden md:block"/>
                  <span className="text-[#00FF00] font-black">(NR20 para Frentistas).</span>
                </strong>
                Ao final, terá uma revisão guiada pela nossa{' '}
                <span className="text-[#00AAFF] font-bold">
                  Inteligência Artificial
                </span>
                .
              </p>

              <button
                onClick={() => {
                  playAudio('click');
                  setStep('form');
                }}
                className="bg-gradient-to-r from-[#00FF00] to-[#00AAFF] hover:from-[#00e600] hover:to-[#0099e6] text-[#020617] font-black text-xl py-5 px-12 rounded-full transition-all transform hover:scale-105 flex items-center justify-center mx-auto gap-3 relative z-10 shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:shadow-[0_0_40px_rgba(0,170,255,0.6)]"
              >
                Começar o Desafio <Play className="w-6 h-6 fill-current" />
              </button>
            </div>
          )}

          {step === 'form' && (
            <div 
              className="no-print w-full bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-8 relative overflow-hidden flex flex-col"
            >
              
              {/* BOTÃO DE VOLTAR - TELA DE CREDENCIAIS */}
              <div className="flex justify-start mb-6 relative z-10 w-full">
                <button
                  type="button"
                  onClick={() => {
                    playAudio('click');
                    if (window.confirm("Os dados serão perdidos caso voltar. Deseja mesmo voltar?")) {
                      setUserData({ nome: '', email: '', whatsapp: '', nascimento: '', fezCurso: '', qualEscola: '' });
                      setStep('intro');
                    }
                  }}
                  className="text-[#00AAFF] hover:text-white flex items-center gap-2 font-bold transition-all text-sm bg-[#00AAFF]/10 hover:bg-[#00AAFF]/30 px-4 py-2 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar para o Início
                </button>
              </div>

              {showVerification && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-md animate-in fade-in zoom-in-95">
                  <div className="bg-slate-900 p-10 rounded-3xl border-2 border-[#00AAFF]/50 shadow-[0_0_60px_rgba(0,170,255,0.2)] max-w-sm w-full text-center m-4 relative overflow-hidden">
                    <div className="w-20 h-20 bg-[#00AAFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-10 h-10 text-[#00AAFF]" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">
                      Código de Segurança
                    </h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                      A ETX Academy enviou um SMS oficial para o número <br />
                      <strong className="text-white text-lg mt-1 block">
                        {userData.whatsapp}
                      </strong>
                    </p>

                    <input
                      type="text"
                      maxLength={6}
                      value={inputCode}
                      onChange={(e) =>
                        setInputCode(e.target.value.replace(/\D/g, ''))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (inputCode.length === 6) {
                            verifyCode();
                          }
                        }
                      }}
                      autoComplete="one-time-code"
                      className="w-full bg-[#020617] border-2 border-slate-700 text-center text-4xl font-bold tracking-[0.3em] p-5 rounded-2xl text-[#00FF00] mb-6 focus:border-[#00FF00] focus:shadow-[0_0_15px_rgba(0,255,0,0.2)] outline-none transition-all"
                      placeholder="000000"
                    />

                    <div className="mb-8 flex justify-center">
                      {resendTimer > 0 ? (
                        <p className="text-xs text-slate-400">
                          Pode reenviar o SMS em <span className="font-bold text-[#00FF00]">{resendTimer}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendSms}
                          disabled={isSmsSending}
                          className="text-[#00AAFF] text-xs font-bold hover:text-white transition-colors underline decoration-dotted disabled:opacity-50"
                        >
                          {isSmsSending ? 'Carregando...' : 'Não recebeu o código? Reenviar SMS agora'}
                        </button>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowVerification(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all relative z-10"
                      >
                        Voltar
                      </button>
                      <button
                        type="button"
                        onClick={verifyCode}
                        disabled={inputCode.length !== 6}
                        className="flex-1 bg-[#00AAFF] hover:bg-[#0088cc] text-[#020617] font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,170,255,0.4)] relative z-10"
                      >
                        Validar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-3xl font-black mb-8 text-center border-b border-slate-800 pb-6 text-white relative z-10">
                Credenciais de Acesso
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#00AAFF]" /> Nome Completo
                    </label>
                    <input
                      required
                      name="nome"
                      value={userData.nome}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 text-white focus:border-[#00AAFF] focus:ring-1 focus:ring-[#00AAFF] outline-none transition-all"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#00AAFF]" /> E-mail
                    </label>
                    <input
                      required
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      type="email"
                      className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 text-white focus:border-[#00AAFF] focus:ring-1 focus:ring-[#00AAFF] outline-none transition-all"
                      placeholder="joao@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#00AAFF]" /> WhatsApp (com DDD)
                    </label>
                    <input
                      required
                      name="whatsapp"
                      value={userData.whatsapp}
                      onChange={handleInputChange}
                      type="tel"
                      className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 text-white focus:border-[#00AAFF] focus:ring-1 focus:ring-[#00AAFF] outline-none transition-all"
                      placeholder="(69) 90000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00AAFF]" /> Data de Nascimento
                    </label>
                    <input
                      required
                      name="nascimento"
                      value={userData.nascimento}
                      onChange={handleInputChange}
                      type="date"
                      min="1900-01-01"
                      max={maxDateString}
                      className="w-full bg-[#020617] border border-slate-700 rounded-xl p-4 text-white focus:border-[#00AAFF] focus:ring-1 focus:ring-[#00AAFF] outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="p-6 bg-[#020617]/50 rounded-2xl border border-slate-800 space-y-4 mt-2">
                  <label className="text-base font-bold text-white block">
                    Já fez o curso de Frentista anteriormente?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group/radio">
                      <input
                        type="radio"
                        name="fezCurso"
                        value="Sim"
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#00FF00] bg-[#020617] border-slate-600 focus:ring-[#00FF00]"
                        required
                      />
                      <span className="font-medium text-slate-300 group-hover/radio:text-white transition-colors">Sim</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group/radio">
                      <input
                        type="radio"
                        name="fezCurso"
                        value="Não"
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#00FF00] bg-[#020617] border-slate-600 focus:ring-[#00FF00]"
                        required
                      />
                      <span className="font-medium text-slate-300 group-hover/radio:text-white transition-colors">Não</span>
                    </label>
                  </div>
                  {userData.fezCurso === 'Sim' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-3">
                      <input
                        required
                        name="qualEscola"
                        value={userData.qualEscola}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-[#00FF00] outline-none transition-all"
                        placeholder="Nome da instituição de ensino"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-start gap-4 p-5 bg-[#00AAFF]/5 rounded-2xl border border-[#00AAFF]/20 hover:border-[#00AAFF]/50 transition-colors cursor-pointer" onClick={() => setAceitouTermos(!aceitouTermos)}>
                  <input
                    type="checkbox"
                    id="termos"
                    required
                    checked={aceitouTermos}
                    onChange={(e) => setAceitouTermos(e.target.checked)}
                    className="mt-1 w-6 h-6 cursor-pointer text-[#00AAFF] bg-[#020617] border-slate-600 rounded focus:ring-[#00AAFF] flex-shrink-0"
                  />
                  <label
                    htmlFor="termos"
                    className="text-sm text-slate-400 leading-relaxed cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <strong className="text-[#00AAFF] block mb-1 uppercase tracking-wide text-xs font-black">
                      Aceito os termos
                    </strong>
                    Autorizo o uso dos meus dados e envio de
                    e-mail/mensagens/ligações referentes a este quiz e
                    oportunidades oferecidas pela ETX Academy e seu grupo corporativo.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSmsSending || !aceitouTermos || userData.whatsapp.replace(/\D/g, '').length !== 11}
                  className="w-full bg-gradient-to-r from-[#00FF00] to-[#00AAFF] hover:from-[#00e600] hover:to-[#0099e6] text-[#020617] font-black py-5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-[0_0_20px_rgba(0,255,0,0.2)]"
                >
                  {isSmsSending ? (
                    'Carregando...'
                  ) : isSubmitting ? (
                    'Registrando...'
                  ) : userData.whatsapp.length > 0 && userData.whatsapp.replace(/\D/g, '').length !== 11 ? (
                    'Preencha o WhatsApp com 11 dígitos'
                  ) : (
                    <>
                      Iniciar Teste <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'quiz' && (
            <div 
              className="no-print w-full bg-slate-900/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
            >
              {isTimeOut && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300">
                  <div className="bg-slate-900 p-10 rounded-3xl border-2 border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.3)] flex flex-col items-center text-center mx-4 animate-in zoom-in-50 duration-500 relative z-50 w-full max-w-md">
                    <AlertCircle className="w-24 h-24 text-red-500 mb-6 animate-bounce" />
                    <h3 className="text-4xl font-black text-white mb-4">
                      Tempo Esgotado!
                    </h3>
                    <p className="text-slate-400 mb-10 text-lg font-medium">
                      Não conseguiu responder a tempo.
                    </p>
                    <button
                      onClick={handleTimeOutNext}
                      className="w-full bg-red-500 hover:bg-red-600 text-white flex justify-center items-center gap-2 py-4 px-8 rounded-xl font-black text-lg transition-all shadow-lg"
                    >
                      {currentQIndex < shuffledQuestions.length - 1
                        ? 'Avançar para a próxima'
                        : 'Finalizar Teste'}{' '}
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}

              <div className="absolute top-0 left-0 w-full h-2 bg-[#020617] rounded-t-3xl overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00FF00] to-[#00AAFF] transition-all duration-500 ease-out"
                  style={{
                    width: `${
                      ((currentQIndex + 1) / shuffledQuestions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-6 mb-10 mt-6 border-b border-slate-800 pb-6 relative z-10 w-full">
                <div className="flex-1 pr-0 sm:pr-4">
                  <span className="text-[#00AAFF] font-black tracking-[0.2em] text-xs uppercase mb-3 block">
                    Questão {currentQIndex + 1} de {shuffledQuestions.length}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                    {shuffledQuestions[currentQIndex].text}
                  </h3>
                </div>
                <div
                  className={`shrink-0 flex items-center gap-2 font-mono text-2xl sm:text-3xl px-5 py-3 rounded-xl font-black border-2 transition-colors ${
                    timeLeft <= 5
                      ? 'bg-red-500/10 text-red-500 border-red-500/50 animate-pulse'
                      : 'bg-[#020617] border-slate-800 text-[#00FF00]'
                  }`}
                >
                  <Clock className="w-6 h-6" /> 00:
                  {timeLeft.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="space-y-4 relative z-10 w-full">
                {shuffledQuestions[currentQIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAns = shuffledQuestions[currentQIndex].correct === idx;
                  
                  let btnDynamicClasses = '';
                  
                  if (isAnswering) {
                    if (isSelected) {
                       if (isCorrectAns) {
                         btnDynamicClasses = 'bg-[#00FF00]/80 border-[#00FF00] text-black shadow-[0_0_20px_#00FF00] animate-pulse';
                       } else {
                         // Oculta a correta e mostra só a errada a vermelho
                         btnDynamicClasses = 'bg-red-600/80 border-red-500 text-white shadow-[0_0_20px_red]';
                       }
                    } else {
                       // Oculta as outras para não dar a dica da correta
                       btnDynamicClasses = 'opacity-30 border-slate-800 bg-[#020617] text-slate-500';
                    }
                  } else {
                    btnDynamicClasses = isSelected
                      ? 'bg-[#00AAFF]/10 border-[#00AAFF] shadow-[0_0_20px_rgba(0,170,255,0.2)] text-white'
                      : 'hover:border-[#00AAFF]/50 hover:bg-[#00AAFF]/5 hover:shadow-[0_0_15px_rgba(0,170,255,0.3)] bg-[#020617] border-slate-800 text-slate-300';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswering}
                      className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 group/btn ${btnDynamicClasses}`}
                    >
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full border-2 mt-1 sm:mt-0.5 flex items-center justify-center transition-colors
                          ${
                            isAnswering && isSelected ? (isCorrectAns ? 'border-black bg-black' : 'border-white bg-white') :
                            isSelected
                              ? 'border-[#00AAFF] bg-[#00AAFF]'
                              : 'border-slate-600 group-hover/btn:border-[#00AAFF]/50'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isAnswering && isSelected ? (isCorrectAns ? 'bg-[#00FF00]' : 'bg-red-500') : 'bg-white'}`} />
                        )}
                      </div>
                      <span
                        className={`text-base sm:text-lg md:text-xl font-medium leading-snug
                        ${
                          isSelected || (isAnswering && isSelected && isCorrectAns)
                            ? 'font-bold'
                            : ''
                        }
                      `}
                      >
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row justify-between items-center sm:h-16 relative z-10 w-full gap-4">
                <span className="text-slate-500 text-sm hidden md:flex items-center gap-2 font-medium">
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">ENTER</span> para confirmar
                </span>
                {selectedOption !== null && !isAnswering && (
                  <button
                    onClick={triggerInstantFeedback}
                    className="w-full sm:w-auto bg-[#00FF00] hover:bg-[#00e600] text-[#020617] flex items-center justify-center gap-3 py-4 px-10 rounded-xl font-black transition-all animate-in slide-in-from-right-8 shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] hover:scale-105 ml-auto text-lg"
                  >
                    Avançar <ChevronRight className="w-6 h-6" />
                  </button>
                )}
                {isAnswering && (
                  <div className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 text-[#00FF00] font-bold py-4">
                    Avançando...
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'result' && (
            <div 
              className="no-print w-full bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl animate-in zoom-in relative overflow-hidden group"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
              />
              <div className="text-center mb-10 border-b border-slate-800 pb-10 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
                  Seu Resultado: <span className="text-[#00FF00]">{score}</span> de {shuffledQuestions.length}
                </h2>
                <div className="text-base text-[#00AAFF] flex items-center justify-center gap-2 mb-10 font-bold tracking-widest uppercase">
                  {isSubmitting ? (
                    <span className="animate-pulse">
                      Enviando nota para o sistema...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" /> Prova concluída!
                    </>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-5 w-full mx-auto">
                  <button
                    onClick={() => {
                      playAudio('click');
                      setStep('summary');
                    }}
                    className="w-full md:w-auto bg-gradient-to-r from-[#00FF00] to-[#00AAFF] hover:from-[#00e600] hover:to-[#0099e6] text-[#020617] font-black text-lg py-5 px-10 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.3)] flex items-center justify-center gap-3 transform hover:scale-105 transition-all"
                  >
                    <FileText className="w-6 h-6" /> Ver Resumo e PDF
                  </button>

                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playAudio('click')}
                    className="w-full md:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-lg py-5 px-10 rounded-2xl shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-3 transform hover:scale-105 transition-all no-underline"
                  >
                    <Share2 className="w-6 h-6" /> Desafie um Amigo!
                  </a>

                  <button
                    onClick={requestDetailedEmail}
                    disabled={emailSent || isSendingEmail}
                    className={`w-full md:w-auto text-white font-black text-lg py-5 px-10 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all border-2
                      ${
                        emailSent
                          ? 'bg-slate-800 border-[#00FF00] text-[#00FF00]'
                          : 'bg-[#020617] border-slate-700 hover:border-[#00AAFF] hover:bg-slate-800'
                      }
                      disabled:opacity-100 disabled:cursor-not-allowed`}
                  >
                    {emailSent ? <CheckCircle className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                    {isSendingEmail
                      ? 'Enviando...'
                      : emailSent
                      ? 'E-mail Enviado!'
                      : 'Receber no E-mail'}
                  </button>
                </div>
              </div>

              {/* TUTOR IA DA ETX */}
              <div className="mb-10 relative z-10">
                <div className="flex items-center gap-4 mb-6 bg-[#00FF00]/10 p-5 rounded-2xl border border-[#00FF00]/20">
                  <div className="w-14 h-14 bg-[#00FF00]/20 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="w-8 h-8 text-[#00FF00]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Tutor IA da ETX</h3>
                    <p className="text-slate-400 font-medium">
                      Mensagem especial de conclusão do seu desafio.
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#020617] p-6 md:p-8 rounded-3xl border border-slate-800 shadow-inner flex flex-col items-start w-full">
                  
                  {/* BALÃO DE FALA ANIMADO (Apresentação) */}
                  <div className="relative bg-[#00AAFF]/10 border border-[#00AAFF]/40 text-[#00AAFF] p-4 md:p-5 rounded-3xl rounded-tl-none w-full shadow-md mb-6 animate-in zoom-in fade-in duration-700 origin-top-left">
                    <div className="absolute top-0 left-[-12px] w-0 h-0 border-t-[14px] border-t-[#00AAFF]/10 border-l-[12px] border-l-transparent"></div>
                    <p className="font-bold text-lg md:text-xl font-mono leading-relaxed min-h-[1.5rem]">
                      {displayedIntro}
                      <span className={`${isTyping ? 'animate-pulse' : 'hidden'}`}>_</span>
                    </p>
                  </div>

                  {/* MENSAGEM PRINCIPAL DO TUTOR IA */}
                  {tutorMsg ? (
                    <div className="text-base md:text-lg p-6 rounded-2xl w-full shadow-sm bg-slate-800/40 border border-slate-700 text-slate-200 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
                      {tutorMsg}
                    </div>
                  ) : (
                    <div className="w-full flex justify-center py-6">
                      <span className="text-[#00AAFF] font-bold animate-pulse flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> A gerar mensagem personalizada...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* REVISÃO DE ERROS */}
              {score < shuffledQuestions.length && (
                <div className="mb-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6 bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20">
                    <div className="w-14 h-14 bg-rose-500/20 rounded-full flex items-center justify-center shrink-0">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Revisão de Erros</h3>
                      <p className="text-slate-400 font-medium">
                        Descubra o motivo de cada erro com a IA.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {shuffledQuestions.map((q, idx) => {
                      if (userAnswers[idx] === q.correct) return null;

                      const aiData = aiExplanations[idx];

                      return (
                        <div
                          key={idx}
                          className="bg-[#020617] border border-slate-800 rounded-3xl p-6 md:p-8"
                        >
                          <p className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                            <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-md uppercase tracking-widest font-black">Errou</span>
                            Questão {idx + 1}
                          </p>
                          <p className="text-slate-400 mb-6">{q.text}</p>

                          {aiData ? (
                            <div className="bg-[#00AAFF]/10 border-l-4 border-[#00AAFF] p-5 text-base text-[#00AAFF] font-medium rounded-r-xl">
                              {aiData.text}
                            </div>
                          ) : (
                            <div className="flex flex-col items-start gap-4">
                              <button
                                onClick={() => explainWrongAnswer(idx)}
                                disabled={isAiLoading[idx]}
                                className="text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-6 py-3 rounded-xl flex items-center gap-2 font-bold"
                              >
                                {isAiLoading[idx]
                                  ? 'Pensando...'
                                  : 'Explicar erro com IA'}{' '}
                                <Sparkles className="w-4 h-4 text-[#00AAFF]" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BANNER PROMOCIONAL NA TELA DE RESULTADOS */}
              <div className="mt-12 bg-[#020617] text-white p-8 md:p-12 rounded-[2.5rem] text-center border-4 border-[#00FF00] shadow-[0_0_40px_rgba(0,255,0,0.15)] relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Fuel className="w-40 h-40 text-[#00FF00]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight relative z-10 leading-tight">
                  <span className="text-[#00AAFF]">ET</span><span className="text-[#00AAFF]">X</span> <span className="text-[#00FF00]">ACADEMY</span> <br/><span className="text-white text-xl md:text-2xl font-bold">A ESCOLA MAIS PROCURADA DA REGIÃO</span>
                </h2>
                <p className="text-lg font-medium mb-6 text-slate-300 relative z-10">
                  ENTRE EM CONTATO E RESERVE SUA VAGA. <br/>VOCÊ TEM GARANTIDO{' '}
                  <strong className="text-[#00AAFF] text-2xl font-black block mt-2 mb-2">
                    10% DE DESCONTO <span className="text-lg block">(Válido por 7 dias úteis)</span>
                  </strong>{' '}
                  NOS NOSSOS CURSOS PROFISSIONALIZANTES POR TER PARTICIPADO DESTE QUIZ.
                </p>
                <a
                  href="https://wa.me/5569981197373?text=Ol%C3%A1%21%20Acabei%20de%20realizar%20o%20Desafio%20Avaliativo%20da%20NR%2020%20e%20gostaria%20de%20saber%20em%20quais%20cursos%20posso%20aplicar%20o%20meu%20benef%C3%ADcio%20de%2010%25%20de%20desconto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex bg-gradient-to-r from-[#00FF00] to-[#00AAFF] hover:scale-105 transition-transform text-[#020617] font-black text-xl md:text-3xl px-8 py-5 rounded-2xl items-center justify-center gap-4 relative z-10 shadow-[0_0_30px_rgba(0,255,0,0.3)] no-underline"
                >
                  <Phone className="w-10 h-10 fill-current" /> (69) 9 8119-7373
                </a>
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="bg-white w-full text-slate-900 p-6 sm:p-8 md:p-14 rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in">
              <div className="watermark-text">ETX ACADEMY</div>

              <div className="no-print fixed bottom-6 right-6 md:top-6 md:bottom-auto flex gap-4 z-50">
                <button
                  onClick={() => setStep('result')}
                  className="bg-slate-900 text-white px-6 py-4 rounded-full font-black shadow-xl flex items-center gap-3 hover:bg-slate-800 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Voltar
                </button>
                <button
                  onClick={handlePrintPDF}
                  className="bg-[#00FF00] text-[#020617] px-8 py-4 rounded-full font-black shadow-[0_0_20px_rgba(0,255,0,0.4)] flex items-center gap-3 hover:bg-[#00e600] transition-all transform hover:scale-105"
                >
                  <Download className="w-6 h-6" /> Imprimir / Salvar PDF
                </button>
              </div>

              <div className="print-header hidden print:flex flex-col items-center text-center mb-10 pb-6 border-b-4 border-[#00FF00]">
                {/* LOGO PARA O PDF: Substitua a URL abaixo pelo link público da sua logo hospedada */}
                <img src="https://via.placeholder.com/300x100.png?text=COLE+SUA+LOGO+AQUI" alt="Logo ETX Academy" className="h-20 mb-4 object-contain" />
                <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ color: '#0f172a' }}>
                  <span className="text-[#00AAFF]">ETX</span> <span className="text-slate-900">ACADEMY</span>
                </h1>
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-2">
                  Sorte é estar preparado quando a oportunidade vem!
                </p>
                <h2 className="text-2xl font-black mt-8 text-[#00AAFF]">
                  Resumo Oficial: NR 20 para Frentistas
                </h2>
                <div className="text-lg mt-4 text-slate-700 flex justify-center gap-8">
                  <p>
                    Aluno(a): <strong className="text-black">{userData.nome}</strong>
                  </p>
                  <p>
                    Acertos:{' '}
                    <strong className="text-[#00AAFF]">
                      {score} de {shuffledQuestions.length}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="no-print text-center mb-12 pb-8 border-b-2 border-slate-100">
                 <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                    <span className="text-[#00AAFF]">ET</span><span className="text-[#00AAFF]">X</span> <span className="text-slate-900">ACADEMY</span>
                  </h1>
                <h2 className="text-2xl font-black text-slate-900 mt-6 mb-2">
                  Seu Resumo Oficial
                </h2>
                <p className="text-slate-500 font-medium text-lg">
                  Material de consulta didático elaborado pela ETX Academy.
                </p>
              </div>

              <div className="space-y-8 relative z-10 w-full">
                <h3 className="text-3xl font-black text-slate-900 border-b-2 border-slate-100 pb-4 mb-8">
                  Revisão do Gabarito
                </h3>
                {shuffledQuestions.map((q, idx) => {
                  const userAnswerIndex = userAnswers[idx];
                  const userAnswerText =
                    userAnswerIndex !== null
                      ? q.options[userAnswerIndex]
                      : 'Não respondida (Tempo esgotado)';
                  const isCorrect = userAnswerIndex === q.correct;

                  return (
                    <div
                      key={idx}
                      className="break-inside-avoid bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-b print:bg-transparent print:p-4"
                    >
                      <h4 className="font-bold text-xl text-slate-900 mb-6 leading-relaxed">
                        <span className="text-[#00AAFF] font-black mr-2">{idx + 1}.</span>{' '}
                        {q.text}
                      </h4>

                      <div className="flex flex-col gap-4 mb-6">
                        <div
                          className={`p-5 rounded-2xl font-semibold border-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : 'bg-rose-50 border-rose-400 text-rose-900'
                          }`}
                        >
                          <span className="block text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                            {isCorrect ? 'Você acertou:' : 'Sua Resposta:'}
                          </span>
                          <span className="text-lg">{userAnswerText}</span>
                        </div>

                        {!isCorrect && (
                          <div className="p-5 rounded-2xl font-semibold bg-emerald-50 border-2 border-emerald-400 text-emerald-900">
                            <span className="block text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                              Resposta Correta:
                            </span>
                            <span className="text-lg">{q.options[q.correct]}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-slate-800 text-base leading-relaxed pl-5 border-l-4 border-[#00AAFF] bg-[#00AAFF]/5 p-5 rounded-r-2xl font-medium">
                        <strong className="text-[#00AAFF] block mb-2 font-black uppercase tracking-wider text-sm">
                          Explicação Técnica
                        </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="page-break mt-16 bg-[#020617] text-white print-banner p-8 sm:p-12 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Fuel className="w-48 h-48 text-[#00FF00]" />
                </div>
                
                <div className="absolute bottom-0 left-0 p-6 opacity-10 transform scale-x-[-1]">
                  <Fuel className="w-48 h-48 text-[#00AAFF]" />
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase tracking-tight relative z-10 leading-tight">
                  <span className="text-[#00AAFF] print:text-green-700">ET</span><span className="text-[#00AAFF] print:text-blue-700">X</span> <span className="text-[#00FF00] print:text-green-700">ACADEMY</span> <br/><span className="text-white text-2xl md:text-3xl font-bold">A ESCOLA MAIS PROCURADA DA REGIÃO</span>
                </h2>

                <p className="text-lg md:text-2xl font-medium mb-8 leading-relaxed text-slate-300 print:text-slate-800 relative z-10">
                  ENTRE EM CONTATO E RESERVE SUA VAGA. <br/>VOCÊ TEM GARANTIDO{' '}
                  <strong className="text-[#00AAFF] print:text-blue-700 text-3xl font-black block mt-2 mb-2">
                    10% DE DESCONTO <span className="text-lg block">(Válido por 7 dias úteis)</span>
                  </strong>{' '}
                  NOS NOSSOS CURSOS PROFISSIONALIZANTES POR TER PARTICIPADO DESTE QUIZ.
                </p>

                <p className="text-base font-bold mb-10 text-slate-400 print:text-slate-600 relative z-10">
                  GUARDE SEU RESUMO E APRESENTE NA ETX PARA GARANTIR SEU DESCONTO (Até 7 dias úteis).
                </p>

                <a
                  href="https://wa.me/5569981197373?text=Ol%C3%A1%21%20Acabei%20de%20realizar%20o%20Desafio%20Avaliativo%20da%20NR%2020%20e%20gostaria%20de%20saber%20em%20quais%20cursos%20posso%20aplicar%20o%20meu%20benef%C3%ADcio%20de%2010%25%20de%20desconto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex bg-gradient-to-r from-[#00FF00] to-[#00AAFF] hover:scale-105 transition-transform print:bg-none print:border-4 print:border-black text-[#020617] print:text-black font-black text-2xl md:text-4xl px-10 py-6 rounded-2xl items-center justify-center gap-4 relative z-10 shadow-[0_0_30px_rgba(0,255,0,0.3)] no-underline"
                >
                  <Phone className="w-10 h-10 fill-current" /> (69) 9 8119-7373
                </a>
              </div>
            </div>
          )}

          {/* ANÚNCIO RODAPÉ CENTRAL */}
          <div className="w-full min-h-[150px] border-2 border-dashed border-slate-800/10 rounded-3xl no-print mt-6 overflow-hidden bg-transparent relative z-10 flex items-center justify-center">
            <BottomAd />
          </div>
        </div>

        {/* ESPAÇO PARA ANÚNCIO - DIREITA */}
        <aside className="hidden xl:flex flex-col gap-6 w-[300px] shrink-0 sticky top-8 no-print">
          <SidebarAd />
          <SidebarAd />
        </aside>
      </main>

      <footer className="no-print w-full py-6 bg-[#020617] border-t border-slate-800 text-center mt-auto relative z-20">
        <p className="text-slate-500 text-sm font-medium px-4">
          ETX Academy - Ji-Paraná - RO - Contato/WhatsApp: (69) 9 8119-7373 - Todos os direitos reservados - 2026
        </p>
      </footer>
    </div>
  );
}