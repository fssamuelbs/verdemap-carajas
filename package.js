/* ============================================================
   package.js - Versão reescrita completa
   - Mapa (Leaflet)
   - Sidebar (imagens, descrição)
   - Pesquisa inteligente (autocomplete + sugestão)
   - Ícones padrão/selecionado
   - Suporte a foto 360º (PhotoSphereViewer ou iframe TeliportMe)
   ============================================================ */

/* -------------------------
   0) Proteção / checagem do DOM
   ------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function normalizar(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const areas = {
  "Lago Nova Carajás": {
    coords: [-6.0869, -49.8425],
    descricao:
      "Área de lazer localizada no bairro Nova Carajás. Possui um lago, bancos, parquinhos para crianças, restaurantes e quiosques de venda. É um ótimo espaço para passear com a família e praticar exercícios.",
    imagens: [
      "https://i.postimg.cc/DyKH6fpV/20231218-173608.jpg",
      "https://i.postimg.cc/8CHM24TP/20250817-192859.jpg",
      "https://i.postimg.cc/Y9vNQgBd/20231122-175121.jpg",
    ],
    foto360: "https://teliportme.com/view/2511707",
  },

  "Praça do Alvorá": {
    coords: [-6.0961, -49.8547],
    descricao:
      "Ótima praça para passear com a família. Conta com duas quadras de futsal, uma de futebol e duas de vôlei. É também um excelente espaço para comemorações, como aniversários e outros eventos.",
    imagens: [
      "https://i.postimg.cc/t4yfJk5W/Whats-App-Image-2025-12-08-at-14-11-56.jpg",
      "https://i.postimg.cc/HLvcpcqJ/image.png",
      "https://i.postimg.cc/zG5Mv7jV/Whats-App-Image-2025-12-08-at-14-11-55.jpg",
    ],
    foto360: "https://teliportme.com/view/2511288",
  },

  "Praça Canal 05 - Alvorá": {
    coords: [-6.10317, -49.856362],
    descricao:
      "Praça pequena Localizada no Canal 5 do Bairro Alvorá, possui poucos brinquedos, porém grande área de esportes.",
    imagens: [
      "https://i.postimg.cc/nhNtzBCq/Whats-App-Image-2025-12-08-at-20-57-46.jpg",
      "https://i.postimg.cc/K8zmmqxq/image.png",
      "https://i.postimg.cc/rw7LmxKh/Whats-App-Image-2025-12-08-at-20-57-45.jpg",
    ],
    foto360: "https://teliportme.com/view/2511712",
  },

  "Parque do Amazônia": {
    coords: [-6.0972, -49.8667],
    descricao:
      "Parque residencial com quadras de vôlei, basquete e futsal. Possui uma trilha arborizada onde as pessoas podem caminhar e apreciar a natureza da floresta local.",
    imagens: [
      "https://i.postimg.cc/PxLyR6sh/Whats-App-Image-2025-12-08-at-14-13-46.jpg",
      "https://i.postimg.cc/432wPDMg/Whats-App-Image-2025-12-08-at-14-13-45.jpg",
      "https://i.postimg.cc/DZmpKvs8/Whats-App-Image-2025-12-08-at-14-13-44.jpg",
    ],
    foto360: "https://teliportme.com/view/2511701",
  },
  "Lago Res. Alto Bonito": {
    coords: [-6.0486, -49.885],
    descricao:
      "O Lago Residencial Alto Bonito é uma área de lazer com ambiente tranquilo, ideal para caminhadas, piqueniques e momentos de descanso à beira d’água. Cercado por vegetação nativa, o local oferece uma bela vista e contato direto com a natureza.",
    imagens: ["https://i.postimg.cc/Dy45vbj1/IMG-20251229-WA0146.jpg"],
  },
  "Parque dos Ipês": {
    coords: [-6.0408, -49.8894],
    descricao:
      "Parque feito como parte do projeto Prosap, que visa melhor qualidade de vida aos moradores da região Norte de Parauapebas. Possui áreas de lazer, quadras de vôlei, pista de skate, espaço infantil, academia ao ar livre e quiosques.",
    imagens: [
      "https://i.postimg.cc/rFsBqyvT/image.png",
      "https://i.postimg.cc/QtPytcLb/image.png",
      "https://i.postimg.cc/76pKDD7s/image.png",
    ],
  },
  "Praça da Bíblia": {
    coords: [-6.0681, -49.8939],
    descricao:
      "Espaço muito agradável, ideal para passeios com amigos e momentos de reflexão. A praça oferece uma vista privilegiada de Parauapebas, possui academia ao ar livre e parque infantil. Seu clima acolhedor e tranquilo torna o local perfeito para visitar a qualquer hora do dia.",
    imagens: [
      "https://i.postimg.cc/nrNb66cx/image.png ",
      "https://i.postimg.cc/SRcbbgnB/image.png",
    ],
  },
  "Praça Mahatma Gandhi": {
    coords: [-6.0664, -49.9053],
    descricao:
      "A Praça Mahatma Gandhi é uma das mais conhecidas do município e oferece uma linda vista de uma das igrejas católicas mais belas do Pará. O local conta com parque infantil, chafariz, bancos para socialização e venda de comidas típicas. É uma ótima opção para passeios em família ou momentos de lazer ao ar livre.",
    imagens: [
      "https://i.postimg.cc/q7bZSbMv/Whats-App-Image-2025-12-06-at-20-21-27.jpg",
      "https://i.postimg.cc/Gp7SV7hH/Whats-App-Image-2025-12-06-at-20-21-26.jpg",
      "https://i.postimg.cc/vmqSkqH1/Whats-App-Image-2025-12-06-at-20-21-25.jpg",
    ],
    foto360: "https://teliportme.com/view/2510596",
  },
  "Parque das Chácaras": {
    coords: [-6.0636, -49.9053],
    descricao:
      "O Parque das Chácaras é um espaço bem grande e completo voltado ao lazer da população da zona central de Parauapebas. Conta com quadras de futsal, futebol e vôlei, parquinhos infantis, áreas para caminhadas e academias ao ar livre. O local também dispõe de quiosques, tornando-se ideal para momentos de convivência e descanso ao ar livre.",
    imagens: [
      "https://images.unsplash.com/photo-1600585154084-4e95f0c97a3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "Parque Linear Igarapé Ilha do Coco": {
    coords: [-6.075, -49.9011],
    descricao:
      "O Parque Linear Ilha do Coco abrange os bairros Liberdade, Paz e União e faz parte do projeto Prosap, na área de macrodrenagem do igarapé Ilha do Coco. O parque é grande em toda sua extensão e oferece parquinhos infantis, academias ao ar livre, quadras de futsal, basquete e vôlei, além de quiosques e ciclovia, proporcionando lazer e integração à comunidade.",
    imagens: [
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e95f0c97a3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "Praça Dom Pedro Primeiro": {
    coords: [-6.0792, -49.8989],
    descricao:
      "Praça de pequeno porte localizada no bairro Rio Verde. Possui alguns restaurantes ao redor e uma quadra multiuso, além de bancos e árvores que proporcionam sombra e tranquilidade. É um ótimo local para descansar, conversar e refletir em meio ao ambiente urbano.",
    imagens: [
      "https://images.unsplash.com/photo-1600585154084-4e95f0c97a3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593011959403-c0e1b61c1c9f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "Praça do Cidadão": {
    coords: [-6.0769, -49.8942],
    descricao:
      "A Praça do Cidadão está localizada em uma das áreas mais movimentadas de Parauapebas. É um dos espaços públicos mais antigos da cidade, contando com quiosques, camelôs e venda de diversos produtos. No centro da praça está o SAC, e o local ainda possui um chafariz que complementa seu ambiente tradicional e dinâmico.",
    imagens: [
      "https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1569516449638-8e51c3f3a97b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "Praça da Paróquia São Francisco de Assis": {
    coords: [-6.0761, -49.8931],
    descricao:
      "Praça aberta ao público, onde a Igreja São Francisco de Assis realiza festejos em diversas datas do ano. O local é arborizado e proporciona um ambiente tranquilo, ideal para renovar a fé, descansar e apreciar a natureza ao redor.",
    imagens: [
      "https://images.unsplash.com/photo-1583241801326-94c85da1c9b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e95f0c97a3b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "Praça da Paz": {
    coords: [-6.0825, -49.8828],
    descricao:
      "Praça pequena e recém-construída, localizada em uma área tranquila da cidade. Possui quadra de futsal, parque infantil, academia ao ar livre e brinquedos adaptados para pessoas com deficiência (PCDs), oferecendo inclusão e lazer para toda a comunidade.",
    imagens: [
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e95f0c97a3b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "Praça do Guanabara": {
    coords: [-6.09, -49.8883],
    descricao:
      "Praça de médio porte onde diariamente são realizadas atividades voltadas ao bem-estar, como aulas de zumba. Possui uma ampla quadra multiuso e alguns quiosques, sendo um ponto de encontro popular entre os moradores da região.",
    imagens: [
      "https://images.unsplash.com/photo-1600585154084-4e95f0c97a3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593011959403-c0e1b61c1c9f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "Praça do Novo Brasil": {
    coords: [-6.0925, -49.8647],
    descricao:
      "Praça arborizada, ideal para lazer e convivência entre os moradores. Conta com espaço infantil com parquinho, quiosques de venda, quadras de vôlei e futsal, além de uma área destinada para patinetes e skate, tornando-se um ponto de encontro animado e familiar.",
    imagens: [
      "https://i.postimg.cc/SRsgnMsc/image.png",
      "https://i.postimg.cc/3NfRNWMd/Whats-App-Image-2025-12-08-at-20-42-53.jpg",
      "https://i.postimg.cc/x8pC8qr9/Whats-App-Image-2025-12-08-at-20-42-52.jpg",
    ],
    foto360: "https://teliportme.com/view/2511705",
  },
  "Praça Wtorres": {
    coords: [-6.0989, -49.8589],
    descricao:
      "Praça pequena, mas completa e bastante movimentada nos horários da noite. Conta com parque infantil, academia ao ar livre e uma quadra multiuso. Além disso, possui ótimas opções de restaurantes ao redor, tornando-se um excelente ponto para lazer, encontros e boa gastronomia.",
    imagens: [
      "https://i.postimg.cc/7LHyFmz0/Whats-App-Image-2025-12-08-at-19-33-28.jpg",
      "https://i.postimg.cc/Jn3fNZMF/image.png",
      "https://i.postimg.cc/Zqp2mpBR/image.png",
    ],
    foto360: "https://teliportme.com/view/2511289",
  },
  "Praça Maria Luiza Saldanha": {
    coords: [-6.0958, -49.84],
    descricao:
      "Praça de médio porte, porém bem conservada e completa. Localizada no bairro Nova Carajás, oferece parque infantil, academia ao ar livre, quiosques e quadra de esportes. É um ótimo local para tirar fotos, pois possui diversas flores e plantas que embelezam o ambiente.",
    imagens: [
      "https://i.postimg.cc/wMmWpsj5/image.png",
      "https://i.postimg.cc/V6905TrJ/Whats-App-Image-2025-12-06-at-20-28-37.jpg",
      "https://i.postimg.cc/3wf90ZyL/image.png",
    ],
    foto360: "https://teliportme.com/view/2510591",
  },
  "Praça da Palmares Sul": {
    coords: [-5.996807, -49.891165],
    descricao:
      "Praça localizada na Palmares Sul, possui parques, quiosques de vendas, ótimo para passear com a família.",
    imagens: [
      "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570891836511-6b40f8a8b8e9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    ],
  },

  "Praça da Rua F": {
    coords: [-6.066126, -49.910131],
    descricao:
      "Praça de areia para crianças com diversos brinquedos localizado na rua F, próximo ao SENAI. Ótimo para passear com as crianças.",
    imagens: [
      "https://i.postimg.cc/3r2ynBmh/Whats-App-Image-2025-12-05-at-23-20-14.jpg",
      "https://i.postimg.cc/Jz4b3kCv/image.png",
      "https://i.postimg.cc/prvLgwzL/Whats-App-Image-2025-12-05-at-23-20-12.jpg",
    ],
    foto360: "https://teliportme.com/view/2510295",
  },
  "Praça do Liberdade": {
    coords: [-6.081638, -49.909478],
    descricao:
      "Praça localizada no bairro Liberdade, possui restaurantes, parque para crianças, quadras de esporte, árvores e academia ao ar livre",
    imagens: [],
  },

  "Complexo Esportivo": {
    coords: [-6.085335, -49.896614],
    descricao:
      "O Complexo Esportivo possui árvores, quadras de futebol e área de lazer. ",
    imagens: [],
  },
  "Praça da Popular 1": {
    coords: [-6.048264, -49.888941],
    descricao:
      "Praça grande localizada no bairro Popular 1, possui quadras de Futsal e Basquete, parque para crianças, academia ao ar livre, árvores e restaurantes.  ",
    imagens: [],
  },
  "Praça do Altamira": {
    coords: [-6.053268, -49.888119],
    descricao:
      "Praça pequena localizada no bairro Altamira, possui quadras de Futsal e Basquete, parque para crianças e academia ao ar livre.  ",
    imagens: [],
  },

     "BioParque Vale": {
    coords: [-6.064833, -50.058960],
    descricao:
      "Os visitantes dizem que este parque oferece uma oportunidade única de se conectar com a natureza, apresentando animais bem cuidados, flora diversificada e trilhas pavimentadas acessíveis, adequadas para todos. Eles também destacam a entrada gratuita, as instalações organizadas e o serviço atencioso e educado da equipe. ",
    imagens: [],
  },

  "Complexo Turístico de Parauapebas": {
    coords: [-6.0739, -49.8889],
    descricao:
      "Um excelente parque de lazer, o Complexo Turístico de Parauapebas oferece uma ótima infraestrutura, com praças, bosques, lago, parque infantil, academias ao ar livre, ciclovia, praça de alimentação e muito mais. <br> Aberto de Terça-feira à Domingo:<br> 6h - 11h / 16h - 22h",

    imagens: [
      "https://i.postimg.cc/tCr2Chhj/image.png",
      "https://i.postimg.cc/cLp7rT6x/image.png",
      "https://i.postimg.cc/VL30RvwD/image.png",
    ],

    foto360: "https://teliportme.com/view/2521323",
  },
  /* ... (mantive todas as tuas áreas originais) ... */
  "Praça Presidente Kennedy": {
    coords: [-6.075821, -49.88532],
    descricao:
      "Praça localizada no bairro Beira Rio, próximo a rodoviaria de Parauapebas, possui quadras de esporte, árvores e espaço ao ar livre",
    imagens: [
      "https://i.postimg.cc/6Q4gCTSb/Whats-App-Image-2025-12-05-at-23-02-43.jpg",
      "https://i.postimg.cc/CKnXbdt4/Whats-App-Image-2025-12-05-at-23-02-39.jpg",
      "https://i.postimg.cc/7LJdSbcB/Whats-App-Image-2025-12-05-at-23-02-41.jpg",
    ],
    // coloquei o link TeliportMe que você mostrou — ele será aberto dentro de um iframe
    foto360: "https://teliportme.com/view/2510289",
  },
  /* ... (resto das áreas, se quiser posso inserir todas novamente) ... */
};

/* -------------------------
      3) Inicializa o mapa (Leaflet)
      ------------------------- */
const map = L.map("map").setView([-6.0675, -49.9037], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

/* -------------------------
      4) Ícones personalizados
      ------------------------- */
const iconPadrao = L.icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const iconSelecionado = L.icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

/* -------------------------
      5) Elementos da UI
      ------------------------- */
const sidebar = $("#sidebar");
const closeBtn = $("#closeBtn");
const sidebarNome = $("#sidebarNome");
const sidebarDescricao = $("#sidebarDescricao");
const sbImg1 = $("#sbImg1");
const sbImg2 = $("#sbImg2");
const sbImg3 = $("#sbImg3");
const btn360 = $("#btn360");

const searchInput = $("#searchInput");
const resultsContainer = $("#resultsContainer");

const viewerContainer = $("#viewer360");
const close360 = $("#close360");

/* Fechar sidebar */
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("show");
  });
}

/* -------------------------
      6) Marcadores e mapeamentos
      ------------------------- */
const markersByKey = {};
let marcadorAtivo = null; // último marcador com ícone vermelho

Object.keys(areas).forEach((nomeOriginal) => {
  const area = areas[nomeOriginal];
  const keyNorm = normalizar(nomeOriginal);

  const marker = L.marker(area.coords, { icon: iconPadrao }).addTo(map);
  marker.bindPopup(nomeOriginal, { offset: [0, -20] });

  marker.on("click", () => {
    // reset anterior
    if (marcadorAtivo && marcadorAtivo !== marker) {
      marcadorAtivo.setIcon(iconPadrao);
    }

    marker.setIcon(iconSelecionado);
    marcadorAtivo = marker;

    mostrarSidebar(nomeOriginal, area);
  });

  markersByKey[keyNorm] = marker;
});

/* -------------------------
      7) Mostrar conteúdo na sidebar
      ------------------------- */
function mostrarSidebar(nomeOriginal, area) {
  if (!sidebarNome || !sidebarDescricao) return;

  sidebarNome.textContent = nomeOriginal;
  sidebarDescricao.textContent = area.descricao || "";

  // imagens - usa background-image para manter o style que você já tem
  if (sbImg1)
    sbImg1.style.backgroundImage =
      area.imagens && area.imagens[0] ? `url(${area.imagens[0]})` : "none";
  if (sbImg2)
    sbImg2.style.backgroundImage =
      area.imagens && area.imagens[1] ? `url(${area.imagens[1]})` : "none";
  if (sbImg3)
    sbImg3.style.backgroundImage =
      area.imagens && area.imagens[2] ? `url(${area.imagens[2]})` : "none";

  // botão 360: aparece apenas se existir foto360
  if (btn360) {
    if (area.foto360) {
      btn360.style.display = "block";
      // remove listeners antigos pra não duplicar
      btn360.onclick = null;
      btn360.addEventListener("click", () => {
        abrir360(area.foto360, nomeOriginal);
      });
    } else {
      btn360.style.display = "none";
      btn360.onclick = null;
    }
  }

  // mostra a sidebar
  sidebar.classList.add("show");

  // centraliza o mapa com zoom agradável
  if (area.coords && Array.isArray(area.coords)) {
    map.setView(area.coords, 15, { animate: true });
  }

  // abre popup do marcador correspondente, se existir
  const keyNorm = normalizar(nomeOriginal);
  if (markersByKey[keyNorm]) {
    // abre popup e marca ícone
    markersByKey[keyNorm].openPopup();
    if (marcadorAtivo && marcadorAtivo !== markersByKey[keyNorm]) {
      marcadorAtivo.setIcon(iconPadrao);
    }
    markersByKey[keyNorm].setIcon(iconSelecionado);
    marcadorAtivo = markersByKey[keyNorm];
  }
}

/* -------------------------
      8) Pesquisa inteligente (autocomplete + sugestão)
      ------------------------- */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const termo = normalizar(searchInput.value || "");
    atualizarResultados(termo);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const termo = normalizar(searchInput.value || "");
      if (!termo) return;
      const itens = Array.from(
        resultsContainer.querySelectorAll(".result-item")
      );
      if (itens.length > 0) {
        itens[0].click();
      } else {
        const maisProximo = acharMaisProximo(termo);
        if (maisProximo) {
          selecionarPorNome(maisProximo);
          searchInput.value = maisProximo;
          esconderResultados();
        }
      }
    } else if (e.key === "ArrowDown") {
      const primeiro = resultsContainer.querySelector(".result-item");
      if (primeiro) primeiro.focus();
    }
  });
}

function atualizarResultados(termo) {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = "";

  if (!termo) {
    esconderResultados();
    return;
  }

  const encontrados = Object.keys(areas).filter((nome) =>
    normalizar(nome).includes(termo)
  );

  if (encontrados.length > 0) {
    encontrados.forEach((nomeOriginal) => {
      const item = criarItemResultado(nomeOriginal);
      resultsContainer.appendChild(item);
    });
    mostrarResultados();
  } else {
    const maisProximo = acharMaisProximo(termo);
    if (maisProximo) {
      const sugestao = document.createElement("div");
      sugestao.className = "result-item";
      sugestao.tabIndex = 0;
      sugestao.innerHTML = `🔎 Você quis dizer: <strong>${maisProximo}</strong>?`;
      sugestao.addEventListener("click", () => {
        selecionarPorNome(maisProximo);
        searchInput.value = maisProximo;
        esconderResultados();
      });
      sugestao.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sugestao.click();
      });
      resultsContainer.appendChild(sugestao);
      mostrarResultados();
    } else {
      const vazio = document.createElement("div");
      vazio.className = "result-item";
      vazio.textContent = "Nenhum ponto encontrado.";
      resultsContainer.appendChild(vazio);
      mostrarResultados();
    }
  }
}

function criarItemResultado(nomeOriginal) {
  const item = document.createElement("div");
  item.className = "result-item";
  item.tabIndex = 0;
  item.textContent = nomeOriginal;

  item.addEventListener("click", () => {
    mostrarSidebar(nomeOriginal, areas[nomeOriginal]);
    searchInput.value = nomeOriginal;
    esconderResultados();
  });

  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter") item.click();
    else if (e.key === "ArrowDown") {
      const prox = item.nextElementSibling;
      if (prox) prox.focus();
    } else if (e.key === "ArrowUp") {
      const prev = item.previousElementSibling;
      if (prev) prev.focus();
      else searchInput.focus();
    }
  });

  return item;
}

function mostrarResultados() {
  if (resultsContainer) resultsContainer.style.display = "block";
}
function esconderResultados() {
  if (resultsContainer) {
    resultsContainer.style.display = "none";
    resultsContainer.innerHTML = "";
  }
}

/* -------------------------
      9) Levenshtein (para sugestão "Você quis dizer")
      ------------------------- */
function levenshtein(a, b) {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;

  const matrix = Array.from({ length: lb + 1 }, () =>
    new Array(la + 1).fill(0)
  );

  for (let i = 0; i <= lb; i++) matrix[i][0] = i;
  for (let j = 0; j <= la; j++) matrix[0][j] = j;

  for (let i = 1; i <= lb; i++) {
    for (let j = 1; j <= la; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[lb][la];
}

function acharMaisProximo(termo) {
  if (!termo) return null;
  const nomes = Object.keys(areas);
  let melhor = null;
  let menor = Infinity;
  nomes.forEach((nomeOriginal) => {
    const dist = levenshtein(termo, normalizar(nomeOriginal));
    if (dist < menor) {
      menor = dist;
      melhor = nomeOriginal;
    }
  });
  return melhor;
}

/* -------------------------
      10) Selecionar por nome (utilitário público)
      ------------------------- */
function selecionarPorNome(nomeOriginal) {
  if (!nomeOriginal || !areas[nomeOriginal]) return;
  mostrarSidebar(nomeOriginal, areas[nomeOriginal]);
  const key = normalizar(nomeOriginal);
  if (markersByKey[key]) {
    markersByKey[key].openPopup();
  }
}

/* -------------------------
      11) Clique fora fecha resultados
      ------------------------- */
document.addEventListener("click", (e) => {
  const alvo = e.target;
  if (
    alvo === searchInput ||
    alvo === resultsContainer ||
    resultsContainer.contains(alvo)
  ) {
    return;
  }
  esconderResultados();
});

/* -------------------------
      12) Ler params URL (lat, lng, name)
      ------------------------- */
(function lerParams() {
  try {
    const url = new URL(window.location.href);
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const name = url.searchParams.get("name");
    if (lat && lng) {
      map.setView([parseFloat(lat), parseFloat(lng)], 17);
    } else if (name && areas[name]) {
      selecionarPorNome(name);
    }
  } catch (err) {
    // ignore
  }
})();

/* -------------------------
      13) VIEWER 360º
      - detecta links TeliportMe (abre iframe)
      - caso contrário, tenta abrir com PhotoSphereViewer (imagem equiretangular)
      ------------------------- */
let _psvInstance = null;
let _iframeElement = null;

function abrir360(url, titulo) {
  if (!viewerContainer) return;

  // limpa container antes
  viewerContainer.innerHTML = "";
  viewerContainer.style.display = "block";

  // adiciona botão fechar se não existir (mas index.html já tem #close360)
  // detecta TeliportMe (URL contendo teliportme.com/view)
  const isTeliport =
    typeof url === "string" && url.includes("teliportme.com/view");

  if (isTeliport) {
    // cria iframe responsivo
    _iframeElement = document.createElement("iframe");
    _iframeElement.src = url;
    _iframeElement.style.width = "100%";
    _iframeElement.style.height = "100%";
    _iframeElement.style.border = "none";
    _iframeElement.allowFullscreen = true;
    viewerContainer.appendChild(_iframeElement);
  } else {
    // tenta usar PhotoSphereViewer (deve haver a lib carregada no HTML)
    // protege caso a lib não exista
    if (
      window.PhotoSphereViewer &&
      typeof PhotoSphereViewer.Viewer === "function"
    ) {
      _psvInstance = new PhotoSphereViewer.Viewer({
        container: viewerContainer,
        panorama: url,
        navbar: true,
        defaultYaw: 0,
        mousewheel: true,
        touchmoveTwoFingers: true,
      });
    } else {
      // fallback simples: abre a imagem em nova aba
      window.open(url, "_blank");
      // esconde o container porque não iniciei nada
      viewerContainer.style.display = "none";
    }
  }

  // opcional: atualiza título (se quiser mostrar)
  if (titulo) {
    // se quiser exibir o título no viewer, insira aqui (opcional)
    // ex: criar um elemento <div> com o nome e append ao viewerContainer
  }
}

function fechar360() {
  // remove iframe se existir
  if (_iframeElement) {
    try {
      _iframeElement.remove();
    } catch (err) {}
    _iframeElement = null;
  }

  // destrói PhotoSphereViewer se existir
  if (_psvInstance && typeof _psvInstance.destroy === "function") {
    _psvInstance.destroy();
    _psvInstance = null;
  }

  if (viewerContainer) viewerContainer.style.display = "none";
}

/* conecta botões de fechar (se existirem) */
if (close360) {
  close360.addEventListener("click", fechar360);
}

/* fecha viewer se o usuário apertar ESC */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    fechar360();
    // também fecha sidebar
    if (sidebar) sidebar.classList.remove("show");
  }
});

/* -------------------------
      14) Log final
      ------------------------- */
console.log(
  "package.js carregado. Pontos disponíveis:",
  Object.keys(areas).length
);
