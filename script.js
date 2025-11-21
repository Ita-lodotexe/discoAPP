let albuns = [];

// carrega data.json e guarda em `albuns`
async function carregarDados() {
  try {
    const resp = await fetch('data.json');
    albuns = await resp.json();
  } catch (erro) {
    console.error('Erro ao carregar data.json', erro);
  }
}



// realiza a busca pelo input e renderiza os resultados
function iniciarBusca() {
  const input = document.querySelector('.barra-de-pesquisa input');
  const texto = (input ? input.value.trim().toLowerCase() : '');//tratamento de dados do texto 

  const welcome = document.querySelector('.welcome-section');
  const destaque = document.querySelector('.destaque-semana');
  const banners = document.querySelector('.grid-banners');
  const container = document.querySelector('.card-container');

  // se não há texto, mostra a intro e limpa resultados
  if (!texto) {
    if (welcome) welcome.style.display = '';
    if (banners) banners.style.display = '';
    if (destaque) destaque.style.display = '';
    if (container) container.innerHTML = ''; // limpa área de resultados
    return;
  }

  // quando há texto, esconde a intro
  if (destaque) destaque.style.display = 'none';
  if (welcome) welcome.style.display = 'none';
  if (banners) banners.style.display = 'none';

  // filtra por título, banda, gênero ou ano
  const filtrados = albuns.filter(a => {
    const titulo = (a.titulo || '').toString().toLowerCase();
    const banda  = (a.banda  || a.artista || '').toString().toLowerCase();
    const genero = (a.genero || '').toString().toLowerCase();
    const ano    = (a.ano    || '').toString().toLowerCase();
    return titulo.includes(texto) || banda.includes(texto) || genero.includes(texto) || ano.includes(texto);
  });

  renderizar(filtrados);
}

// renderiza uma lista de álbuns dentro de .card-container
function renderizar(list) {
  const container = document.querySelector('.card-container');
  if (!container) return;
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--tertiary-color)">Nenhum álbum encontrado.</p>';
    return;
  }

  list.forEach(a => {
    const art = document.createElement('article');
    art.className = 'card-album';
    art.innerHTML = `
      <img class="album-capa" src="${escapeHtml(a.imagem || 'images/placeholder.png')}" alt="Capa - ${escapeHtml(a.titulo || '')}">
      <h2 class="album-nome">${escapeHtml(a.titulo || '')}</h2>
      <h4 class="album-banda">${escapeHtml(a.banda || a.artista || '')}</h4>
      <p class="album-ano">${escapeHtml(String(a.ano || ''))}</p>
      <p class="album-genero">${escapeHtml(a.genero || '')}</p>
      <p class="album-descricao">${escapeHtml(a.descricao || '')}</p>
      <div class="card-links">
        <a class="btn-spotify" href="${escapeHtml(a.spotify || a.link || '#')}" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
          <svg class="icon-brand" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </a>
        <a class="btn-youtube" href="${escapeHtml(a.youtube || '#')}" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg class="icon-brand" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
      </div>
    `;
    container.appendChild(art);
  });
}

// evita injeção simples ao inserir texto/atributos no HTML
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// configuração inicial: limpa o input, mostra intro e carrega dados
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.barra-de-pesquisa input');
  const botao = document.getElementById('botao-busca');
  const welcome = document.querySelector('.welcome-section');
  const banners = document.querySelector('.grid-banners');
  const container = document.querySelector('.card-container');

  // limpa campo de busca e evita autocomplete
  if (input) {
    input.value = '';
    input.autocomplete = 'off';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') iniciarBusca();
    });
  }

  // botão dispara busca (se existir)
  if (botao) botao.addEventListener('click', iniciarBusca);

  // ao recarregar: mostra a intro e limpa resultados
  if (welcome) welcome.style.display = '';
  if (banners) banners.style.display = '';
  if (container) container.innerHTML = ''; // limpa resultados anteriores

  // carrega os dados (não renderiza tudo automaticamente)
  carregarDados();
});





// Funções para os banners de genero musical
function buscarGenero(genero) {
    const input = document.querySelector('.barra-de-pesquisa input');
    input.value = genero;
    iniciarBusca();
}







// Função para recarregar a página ao clicar no logo
function recarregarPagina() {
    window.location.reload();
}