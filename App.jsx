import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  School,
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
  ShieldCheck,
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
  confirm: 'https://actions.google.com/sounds/v1/ui/pop_up_open.ogg',
  timeout: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  success: 'https://actions.google.com/sounds/v1/cartoon/magic_chime_bell.ogg',
};

const playAudio = (type) => {
  try {
    const audio = new Audio(SOUNDS[type]);
    audio.play().catch((e) => console.log('Bloqueio de autoplay', e));
  } catch (err) {}
};

// --- DADOS DAS QUESTÕES ---
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
      'A norma separa inflamáveis (que geram vapor fácil) de combustíveis (que precisam de mais calor para gerar vapor, como o Diesel). Combustíveis têm ponto de fulgor entre 60°C e 93,3°C.',
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
    text: 'Entre os itens abaixo, qual NÃO é considerado um Equipamento de Proteção Coletiva (EPC)?',
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

// --- FUNÇÃO INTEGRAÇÃO GEMINI API (MUITO MELHORADA PARA DEBUG) ---
const callGeminiAPI = async (prompt) => {
  const apiKey = 'AIzaSyBUQUCeNuWCYXvpZRgtgEpbkNkflIExKsI';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [
        {
          text: 'Você é um instrutor especialista em Segurança do Trabalho e NR 20 da escola ETX Academy. Seja encorajador, didático e direto. Mantenha as explicações curtas (máximo 2 parágrafos).',
        },
      ],
    },
  };
  
  const delays = [1000, 2000, 4000];
  let lastErrorMessage = '';
  
  for (let i = 0; i < delays.length; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        lastErrorMessage = errorData.error?.message || `Erro HTTP: ${response.status}`;
        throw new Error(lastErrorMessage);
      }
      
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro na geração da resposta pela IA.'
      );
    } catch (err) {
      lastErrorMessage = err.message;
      if (i === delays.length - 1) {
        // Retorna a mensagem de erro exata do Google para o ecrã do aluno, ajudando a identificar o problema
        return `Erro de Ligação IA do Google: "${lastErrorMessage}". Por favor, tenta novamente ou verifica as permissões da chave.`;
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

  // SMS Verification Firebase
  const [showVerification, setShowVerification] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [isSmsSending, setIsSmsSending] = useState(false);

  // Quiz
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [aiExplanations, setAiExplanations] = useState({});
  const [isAiLoading, setIsAiLoading] = useState({});

  const introCardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!introCardRef.current) return;
    const rect = introCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    introCardRef.current.style.setProperty('--mouse-x', `${x}px`);
    introCardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    document.title = 'ETX Academy | Desafio NR 20';
  }, []);

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

  // Inicializa o reCAPTCHA invisível do Firebase de forma segura para o React
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
        callback: (response) => {
          // reCAPTCHA resolvido
        },
      }
    );

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Web OTP API - Leitura Automática de SMS no Android
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
        .catch((err) => {
          console.log('Web OTP falhou ou ignorado', err);
        });
      return () => ac.abort();
    }
  }, [showVerification]);

  // Timer
  useEffect(() => {
    let timer;
    if (step === 'quiz' && !isTimeOut && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'quiz' && !isTimeOut) {
      playAudio('timeout');
      setIsTimeOut(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, step, isTimeOut]);

  // Capturar tecla ENTER
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'Enter' &&
        step === 'quiz' &&
        selectedOption !== null &&
        !isTimeOut
      ) {
        e.preventDefault();
        nextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, selectedOption, currentQIndex, isTimeOut]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // ENVIAR SMS REAL VIA FIREBASE
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!aceitouTermos) return;
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
    } catch (error) {
      console.error('Erro Firebase SMS:', error);
      alert(
        'Erro do Firebase: ' +
          error.message +
          '\n\nVerifique se o domínio atual está na lista de autorizados do Firebase Console.'
      );
      setIsSmsSending(false);

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.render().then((widgetId) => {
            grecaptcha.reset(widgetId);
          });
        } catch (e) {}
      }
    }
  };

  // VALIDAÇÃO DO CÓDIGO SMS COM FIREBASE
  const verifyCode = async () => {
    try {
      await window.confirmationResult.confirm(inputCode);
      playAudio('success');
      startQuizAfterValidation();
    } catch (error) {
      playAudio('timeout');
      alert(
        'Código incorreto ou expirado. Verifique o SMS recebido e tente novamente.'
      );
    }
  };

  const startQuizAfterValidation = async () => {
    setShowVerification(false);
    setIsSubmitting(true);

    const randomized = shuffleArray(QUESTIONS);
    setShuffledQuestions(randomized);
    setUserAnswers(Array(randomized.length).fill(null));

    const payload = {
      ...userData,
      tipo: 'cadastro',
      pontuacao: 'Iniciou',
      totalPerguntas: QUESTIONS.length,
      dataHora: new Date().toLocaleString('pt-BR'),
    };

    try {
      await fetch(GOOGLE_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {}

    setIsSubmitting(false);
    setStep('quiz');
    setTimeLeft(20);
    setIsTimeOut(false);
    setSelectedOption(null);
  };

  const handleSelectOption = (index) => {
    playAudio('click');
    setSelectedOption(index);
  };

  const nextQuestion = () => {
    playAudio('confirm');
    const newAnswers = [...userAnswers];
    newAnswers[currentQIndex] = selectedOption;
    setUserAnswers(newAnswers);

    if (selectedOption === shuffledQuestions[currentQIndex].correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQIndex < shuffledQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(20);
      setIsTimeOut(false);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const handleTimeOutNext = () => {
    playAudio('click');
    const newAnswers = [...userAnswers];
    newAnswers[currentQIndex] = null;
    setUserAnswers(newAnswers);

    if (currentQIndex < shuffledQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(20);
      setIsTimeOut(false);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers = userAnswers) => {
    playAudio('success');
    setStep('result');
    setIsSubmitting(true);

    const finalScore = finalAnswers.reduce(
      (acc, ans, idx) => acc + (ans === shuffledQuestions[idx].correct ? 1 : 0),
      0
    );
    setScore(finalScore);

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
        headers: { 'Content-Type': 'application/json' },
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
          suaResposta:
            userAnswerIndex !== null
              ? q.options[userAnswerIndex]
              : 'Não respondida (Tempo esgotado)',
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setEmailSent(true);
      alert('Sucesso! O resumo completo foi enviado para o teu e-mail.');
    } catch (error) {
      alert('Ocorreu um erro ao enviar o e-mail. Podes baixar o PDF.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const explainWrongAnswer = async (qIndex) => {
    setIsAiLoading((prev) => ({ ...prev, [qIndex]: true }));
    const question = shuffledQuestions[qIndex];
    const userAnswerStr =
      userAnswers[qIndex] !== null
        ? question.options[userAnswers[qIndex]]
        : 'Nenhuma (tempo esgotado)';
    const prompt = `O aluno respondeu à questão: "${
      question.text
    }". Ele escolheu: "${userAnswerStr}". A resposta correta era: "${
      question.options[question.correct]
    }". Explique o motivo do erro baseando-se na NR 20.`;

    const explanation = await callGeminiAPI(prompt);
    
    // Agora verifica se a palavra 'Erro' está na string gerada pela API
    const isError = explanation.toLowerCase().includes('erro');

    setAiExplanations((prev) => ({
      ...prev,
      [qIndex]: { text: explanation, isError: isError },
    }));
    setIsAiLoading((prev) => ({ ...prev, [qIndex]: false }));
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white flex flex-col relative print:bg-white print:text-black">
      {/* Contêiner Invisível obrigatório do Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <style>
        {`
          @media print {
            body { background: white !important; color: black !important; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
            .print-container { max-width: 100% !important; padding: 0 !important; border: none !important; box-shadow: none !important; background: transparent !important; }
            h1, h2, h3 { color: #0f172a !important; font-family: sans-serif; }
            p, span, div { color: #334155 !important; }
            .print-header { border-bottom: 2px solid #10b981 !important; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
            .print-banner { border: 4px solid #10b981 !important; background: white !important; color: black !important; border-radius: 16px; padding: 30px; text-align: center; }
            .watermark-text {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 110px;
              font-weight: 900;
              color: rgba(16, 185, 129, 0.08) !important;
              white-space: nowrap;
              z-index: -10;
              pointer-events: none;
              user-select: none;
              font-family: Arial, sans-serif;
            }
          }
        `}
      </style>

      <header className="no-print w-full p-6 bg-slate-950 border-b border-teal-900/50 shadow-lg flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950"></div>
        <div className="z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
            ETX <span className="text-slate-100">ACADEMY</span>
          </h1>
          <p className="text-amber-400 text-sm font-medium mt-1 uppercase tracking-widest">
            Sorte é estar preparado quando a oportunidade vem!
          </p>
        </div>
      </header>

      {/* LAYOUT RESPONSIVO COM ANÚNCIOS INVISÍVEIS QUANDO VAZIOS */}
      <main className="flex-grow flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 print:p-0 gap-8 w-full max-w-[1500px] mx-auto">
        {/* ANÚNCIO DESKTOP - ESQUERDA */}
        <aside className="hidden lg:flex flex-col w-[300px] sticky top-8 no-print">
          {/* O TEU SCRIPT DE PUBLICIDADE 300x600 ENTRA AQUI */}
        </aside>

        {/* CONTAINER CENTRAL DA APLICAÇÃO */}
        <div className="w-full max-w-3xl print-container flex flex-col gap-6">
          {/* ANÚNCIO MOBILE - TOPO (Apenas em ecrãs pequenos) */}
          <div className="lg:hidden w-full no-print">
            {/* O TEU SCRIPT DE PUBLICIDADE MOBILE TOPO ENTRA AQUI */}
          </div>

          {step === 'intro' && (
            <div
              ref={introCardRef}
              onMouseMove={handleMouseMove}
              className="no-print bg-slate-800/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-slate-700 shadow-2xl text-center animate-in fade-in zoom-in relative overflow-hidden group"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(20, 184, 166, 0.15), transparent 40%)',
                }}
              />

              <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110">
                <School className="w-12 h-12 text-teal-400" />
                <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold mb-4 relative z-10">
                Desafio Avaliativo NR 20
              </h2>

              <p className="text-slate-300 mb-8 max-w-lg mx-auto text-lg leading-relaxed relative z-10">
                <strong className="text-teal-400 text-xl block mb-2">
                  Teste os seus conhecimentos sobre inflamáveis e segurança
                  (NR20 para Frentistas).
                </strong>
                Ao final, terá uma revisão guiada pela nossa{' '}
                <span className="text-amber-400 font-bold">
                  Inteligência Artificial
                </span>
                .
              </p>

              <button
                onClick={() => {
                  playAudio('click');
                  setStep('form');
                }}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 flex items-center justify-center mx-auto gap-2 relative z-10 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]"
              >
                Começar o Desafio <Play className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'form' && (
            <div className="no-print bg-slate-800/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-slate-700 shadow-2xl animate-in slide-in-from-bottom-8 relative overflow-hidden">
              {showVerification && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm animate-in fade-in zoom-in-95">
                  <div className="bg-slate-800 p-8 rounded-2xl border-2 border-teal-500/50 shadow-[0_0_50px_rgba(20,184,166,0.2)] max-w-sm w-full text-center m-4 relative overflow-hidden">
                    <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Código de Segurança
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      O Google enviou um SMS oficial para o número <br />
                      <strong className="text-white text-base">
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
                      autoComplete="one-time-code"
                      className="w-full bg-slate-950 border-2 border-slate-600 text-center text-4xl tracking-[0.2em] p-4 rounded-xl text-white mb-6 focus:border-teal-500 outline-none transition-colors"
                      placeholder="000000"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowVerification(false)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
                      >
                        Voltar
                      </button>
                      <button
                        type="button"
                        onClick={verifyCode}
                        disabled={inputCode.length !== 6}
                        className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Validar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-6 text-center border-b border-slate-700 pb-4">
                Credenciais
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                      <User className="w-4 h-4" /> Nome Completo
                    </label>
                    <input
                      required
                      name="nome"
                      value={userData.nome}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> E-mail
                    </label>
                    <input
                      required
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      type="email"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                      placeholder="joao@email.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> WhatsApp (com DDD)
                    </label>
                    <input
                      required
                      name="whatsapp"
                      value={userData.whatsapp}
                      onChange={handleInputChange}
                      type="tel"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                      placeholder="(69) 90000-0000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Data de Nascimento
                    </label>
                    <input
                      required
                      name="nascimento"
                      value={userData.nascimento}
                      onChange={handleInputChange}
                      type="date"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-4">
                  <label className="text-sm font-medium text-slate-300 block">
                    Já fez o curso de Frentista anteriormente?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fezCurso"
                        value="Sim"
                        onChange={handleInputChange}
                        className="text-teal-500 bg-slate-800"
                        required
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fezCurso"
                        value="Não"
                        onChange={handleInputChange}
                        className="text-teal-500 bg-slate-800"
                        required
                      />
                      <span>Não</span>
                    </label>
                  </div>
                  {userData.fezCurso === 'Sim' && (
                    <div className="space-y-1 animate-in fade-in pt-2">
                      <input
                        required
                        name="qualEscola"
                        value={userData.qualEscola}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                        placeholder="Nome da instituição"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50 hover:border-teal-900 transition-colors">
                  <input
                    type="checkbox"
                    id="termos"
                    required
                    checked={aceitouTermos}
                    onChange={(e) => setAceitouTermos(e.target.checked)}
                    className="mt-1 w-5 h-5 cursor-pointer text-teal-500 bg-slate-800 border-slate-600 rounded focus:ring-teal-500 flex-shrink-0"
                  />
                  <label
                    htmlFor="termos"
                    className="text-[12px] text-slate-400 leading-tight cursor-pointer"
                  >
                    <strong className="text-slate-200 block mb-1 uppercase tracking-wide text-[11px]">
                      Aceito os termos
                    </strong>
                    Autorizo o uso dos meus dados e envio de
                    e-mail/mensagens/ligações referentes a este quiz e
                    oportunidades oferecidas pela ETX Academy e seu grupo
                    corporativo.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSmsSending || !aceitouTermos}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSmsSending ? (
                    'Conectando ao Google SMS...'
                  ) : isSubmitting ? (
                    'A Registar...'
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
            <div className="no-print bg-slate-800/80 backdrop-blur-xl p-6 md:p-10 rounded-2xl border border-slate-700 shadow-2xl relative">
              {isTimeOut && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                  <div className="bg-slate-800 p-8 rounded-2xl border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)] flex flex-col items-center text-center mx-4 animate-in zoom-in-50 duration-500">
                    <AlertCircle className="w-20 h-20 text-red-500 mb-4 animate-bounce" />
                    <h3 className="text-3xl font-black text-white mb-2">
                      Tempo Esgotado!
                    </h3>
                    <p className="text-slate-400 mb-8 text-lg">
                      Não conseguiste responder a tempo.
                    </p>
                    <button
                      onClick={handleTimeOutNext}
                      className="bg-teal-500 hover:bg-teal-400 text-white flex items-center gap-2 py-4 px-10 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                    >
                      {currentQIndex < shuffledQuestions.length - 1
                        ? 'Avançar para a próxima'
                        : 'Finalizar Teste'}{' '}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQIndex + 1) / shuffledQuestions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-end mb-8 mt-4 border-b border-slate-700 pb-4">
                <div>
                  <span className="text-teal-400 font-bold tracking-widest text-sm uppercase">
                    Questão {currentQIndex + 1} de {shuffledQuestions.length}
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold mt-2 leading-relaxed">
                    {shuffledQuestions[currentQIndex].text}
                  </h3>
                </div>
                <div
                  className={`flex items-center gap-2 font-mono text-2xl px-4 py-2 rounded-lg font-bold border ${
                    timeLeft <= 5
                      ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Clock className="w-5 h-5" /> 00:
                  {timeLeft.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="space-y-3">
                {shuffledQuestions[currentQIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-200 flex items-start gap-3
                        ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            : 'hover:border-blue-500 hover:bg-blue-900/20 bg-slate-900/50 border-slate-700'
                        }
                      `}
                    >
                      <div
                        className={`w-6 h-6 shrink-0 rounded-full border-2 mt-0.5 flex items-center justify-center 
                          ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-slate-500'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-base md:text-lg 
                        ${
                          isSelected
                            ? 'text-blue-400 font-bold'
                            : 'text-slate-300'
                        }
                      `}
                      >
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between items-center h-14">
                <span className="text-slate-500 text-sm hidden md:inline-block">
                  {selectedOption !== null
                    ? 'Pressiona ENTER para avançar'
                    : ''}
                </span>
                {selectedOption !== null && (
                  <button
                    onClick={nextQuestion}
                    className="bg-teal-500 hover:bg-teal-400 text-white flex items-center gap-2 py-3 px-8 rounded-lg font-bold transition-all animate-in slide-in-from-right-4 shadow-lg ml-auto"
                  >
                    {currentQIndex < shuffledQuestions.length - 1
                      ? 'Avançar'
                      : 'Finalizar Teste'}{' '}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="no-print bg-slate-800/80 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in">
              <div className="text-center mb-8 border-b border-slate-700 pb-8">
                <h2 className="text-3xl font-bold mb-4">
                  O Teu Resultado: {score} de {shuffledQuestions.length}
                </h2>
                <div className="text-sm text-teal-400 flex items-center justify-center gap-2 mb-6">
                  {isSubmitting ? (
                    <span className="animate-pulse">
                      A enviar nota para o sistema...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Prova concluída e
                      registada!
                    </>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => {
                      playAudio('click');
                      setStep('summary');
                    }}
                    className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3 transform hover:scale-105 transition-all"
                  >
                    <FileText className="w-6 h-6" /> Ver Resumo e Salvar PDF
                  </button>

                  <button
                    onClick={requestDetailedEmail}
                    disabled={emailSent || isSendingEmail}
                    className={`w-full md:w-auto text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all
                      ${
                        emailSent
                          ? 'bg-emerald-600'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }
                      disabled:opacity-100 disabled:cursor-not-allowed`}
                  >
                    <Mail className="w-6 h-6" />
                    {isSendingEmail
                      ? 'A Enviar...'
                      : emailSent
                      ? 'E-mail Enviado com Sucesso!'
                      : 'Receber PDF por E-mail'}
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                  <Bot className="w-8 h-8 text-indigo-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Revisão IA</h3>
                    <p className="text-sm text-slate-400">
                      Descobre o motivo dos teus erros.
                    </p>
                  </div>
                </div>
                {score === shuffledQuestions.length ? (
                  <p className="text-emerald-400 text-center font-bold">
                    Excelente, acertaste tudo!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {shuffledQuestions.map((q, idx) => {
                      if (userAnswers[idx] === q.correct) return null;

                      const aiData = aiExplanations[idx];

                      return (
                        <div
                          key={idx}
                          className="bg-slate-900/50 border border-red-900/30 rounded-xl p-5"
                        >
                          <p className="font-semibold text-slate-200 mb-2">
                            Questão {idx + 1} (Erraste)
                          </p>

                          {aiData && !aiData.isError ? (
                            <div className="bg-indigo-900/20 border-l-4 border-indigo-500 p-3 text-sm text-indigo-100">
                              {aiData.text}
                            </div>
                          ) : (
                            <div className="flex flex-col items-start gap-3">
                              {aiData?.isError && (
                                <p className="text-red-400 text-sm font-medium">
                                  {aiData.text}
                                </p>
                              )}
                              <button
                                onClick={() => explainWrongAnswer(idx)}
                                disabled={isAiLoading[idx]}
                                className="text-sm bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded flex items-center gap-2"
                              >
                                {isAiLoading[idx]
                                  ? 'A pensar...'
                                  : aiData?.isError
                                  ? 'Tentar Novamente'
                                  : 'Explicar com IA'}{' '}
                                <Sparkles className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="bg-white text-slate-900 p-8 md:p-14 rounded-2xl shadow-2xl relative overflow-hidden animate-in fade-in">
              <div className="watermark-text">ETX ACADEMY</div>

              <div className="no-print fixed bottom-6 right-6 md:top-6 md:bottom-auto flex gap-4 z-50">
                <button
                  onClick={() => setStep('result')}
                  className="bg-slate-800 text-white px-5 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-slate-700 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Voltar
                </button>
                <button
                  onClick={handlePrintPDF}
                  className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-teal-500 transition-all transform hover:scale-105"
                >
                  <Download className="w-5 h-5" /> Imprimir / Salvar PDF
                </button>
              </div>

              <div className="print-header hidden print:block text-center mb-10 pb-6 border-b-2 border-teal-600">
                <h1 className="text-4xl font-black uppercase text-teal-800 tracking-wider">
                  ETX Academy
                </h1>
                <p className="text-slate-500 font-medium">
                  Sorte é estar preparado quando a oportunidade vem!
                </p>
                <h2 className="text-xl font-bold mt-4 text-slate-800">
                  Resumo Oficial: NR 20 para Frentistas
                </h2>
                <div className="text-sm mt-2 text-slate-600">
                  <p>
                    Aluno(a): <strong>{userData.nome}</strong>
                  </p>
                  <p>
                    Acertos:{' '}
                    <strong>
                      {score} de {shuffledQuestions.length}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="no-print text-center mb-10">
                <h1 className="text-3xl font-black text-slate-800">
                  O Teu Resumo Oficial
                </h1>
                <p className="text-slate-500">
                  Material de consulta didático elaborado pela ETX Academy.
                </p>
              </div>

              <div className="space-y-8 relative z-10">
                <h3 className="text-2xl font-bold text-teal-700 border-b pb-2">
                  Revisão do Gabarito e Explicações
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
                      className="break-inside-avoid bg-white/90 p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-b print:bg-transparent"
                    >
                      <h4 className="font-bold text-lg text-slate-800 mb-4">
                        <span className="text-teal-600">{idx + 1}.</span>{' '}
                        {q.text}
                      </h4>

                      <div className="flex flex-col gap-3 mb-5">
                        <div
                          className={`p-4 rounded-lg font-medium border ${
                            isCorrect
                              ? 'bg-emerald-100 border-emerald-200 text-emerald-900'
                              : 'bg-red-100 border-red-200 text-red-900'
                          }`}
                        >
                          <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                            {isCorrect ? 'Acertaste:' : 'A Tua Resposta:'}
                          </span>
                          {userAnswerText}
                        </div>

                        {!isCorrect && (
                          <div className="p-4 rounded-lg font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
                            <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                              Resposta Correta:
                            </span>
                            {q.options[q.correct]}
                          </div>
                        )}
                      </div>

                      <div className="text-slate-700 text-base leading-relaxed pl-4 border-l-4 border-amber-400 bg-amber-50/50 p-3 rounded-r-lg">
                        <strong className="text-amber-800 block mb-1">
                          Por que esta é a resposta?
                        </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="page-break mt-12 bg-slate-900 text-white print-banner p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <School className="w-32 h-32 text-teal-300" />
                </div>

                <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-wide text-teal-400 print:text-teal-700 relative z-10">
                  ETX ACADEMY - ESCOLA MAIS PROCURADA DA REGIÃO PARA
                  TREINAMENTOS E NRs
                </h2>

                <p className="text-lg md:text-xl font-medium mb-6 leading-relaxed text-slate-300 print:text-slate-800 relative z-10">
                  ENTRA EM CONTACTO E RESERVA A TUA VAGA, TENS GARANTIDO{' '}
                  <strong className="text-amber-400 print:text-amber-600 text-2xl">
                    10% DE DESCONTO
                  </strong>{' '}
                  NOS NOSSOS CURSOS PROFISSIONALIZANTES POR TERES PARTICIPADO
                  NESTE QUIZ.
                </p>

                <p className="text-lg font-bold mb-8 text-white print:text-slate-900 relative z-10">
                  GUARDA O TEU RESUMO E APRESENTA NA ETX PARA GARANTIR O TEU
                  DESCONTO (Até 7 dias úteis).
                </p>

                <a
                  href="https://wa.me/5569981197373?text=Ol%C3%A1%21%20Acabei%20de%20realizar%20o%20Desafio%20Avaliativo%20da%20NR%2020%20e%20gostaria%20de%20saber%20em%20quais%20cursos%20posso%20aplicar%20o%20meu%20benef%C3%ADcio%20de%2010%25%20de%20desconto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex bg-teal-500 hover:bg-teal-400 transition-colors print:bg-teal-100 print:border-2 print:border-teal-500 text-slate-900 print:text-teal-900 font-black text-xl md:text-3xl px-8 py-4 rounded-xl items-center justify-center gap-4 relative z-10 shadow-lg no-underline"
                >
                  <Phone className="w-8 h-8" /> WHATSAPP: (69) 9 8119-7373
                </a>
                <p className="text-sm text-slate-400 print:text-slate-600 mt-4 relative z-10 font-medium">
                  * Consultar diretrizes e regras com a secretaria da ETX.
                </p>
              </div>
            </div>
          )}

          {/* ANÚNCIO MOBILE - BASE */}
          <div className="lg:hidden w-full no-print">
            {/* O TEU SCRIPT DE PUBLICIDADE MOBILE BASE ENTRA AQUI */}
          </div>
        </div>

        {/* ANÚNCIO DESKTOP - DIREITA */}
        <aside className="hidden lg:flex flex-col gap-6 w-[300px] sticky top-8 no-print">
          <div className="w-full">
            {/* O TEU SCRIPT DE PUBLICIDADE 300x250 ENTRA AQUI */}
          </div>
          <div className="w-full">
            {/* O TEU SCRIPT DE PUBLICIDADE 300x250 (2) ENTRA AQUI */}
          </div>
        </aside>
      </main>
    </div>
  );
}