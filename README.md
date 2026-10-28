# Portfólio Acadêmico — João Vitor Rossi Ferreira

Portfólio acadêmico digital do curso de **Desenvolvimento de Software Multiplataforma (DSM)** — FATEC Prof. Jessen Vidal, São José dos Campos (2026/2).

**Acesse:** https://fatec-sjc-dsm-portfolio.github.io/ra1461392411042/ · versão em inglês: [en.html](https://fatec-sjc-dsm-portfolio.github.io/ra1461392411042/en.html)

## Conteúdo

| Requisito do roteiro | Seção do site |
|---|---|
| 2.1 Apresentação pessoal (foto, nome, formação, objetivos, áreas de interesse) | `#apresentacao` |
| Observação 2: competências técnicas na escala de 1 (ouvi falar) a 5 (fluente) | `#stack` e hard skills de cada API |
| 2.2.1 Projetos Acadêmicos (API) — parceiro, problema, tecnologias, solução, repositório (cópia pessoal), contribuições, hard e soft skills | `#projetos-api` (linha do tempo fixa e os 6 projetos completos na página; link direto: `#api-1` a `#api-6`) |
| 2.2.2 Projetos Profissionais e 2.2.3 Projetos Pessoais | `#outros-projetos` |
| 3. Informações Curriculares (formação, idiomas, certificações e cursos, eventos e apresentações, trabalhos acadêmicos) | `#curriculo` |
| 4. Contato (LinkedIn, GitHub, e-mail) | `#contato` |

### Projetos integradores (API)

| Semestre | Projeto | Parceiro | Papel | Repositório (cópia pessoal) |
|---|---|---|---|---|
| 1º · 2024/1 | Smart Farming | Equipe Inove (Manufatura Avançada) | Dev Team | [Projeto-Smart-Farming](https://github.com/joaorossiferreira/Projeto-Smart-Farming) |
| 2º · 2024/2 | ProStock | Prof. Claudio Lima | Scrum Master | [API_2Semestre](https://github.com/joaorossiferreira/API_2Semestre) |
| 3º · 2025/1 | NectoPoint | Necto Systems | Dev Team (front-end) | [nectopoint](https://github.com/joaorossiferreira/nectopoint) |
| 4º · 2025/2 | SkyTrack | Tecsus | Dev Team (front-end) | [skytrack](https://github.com/joaorossiferreira/skytrack) |
| 5º · 2026/1 | Themis | Xertica | Dev Team (mobile) | [themis](https://github.com/joaorossiferreira/themis) |
| 6º · 2026/2 | CHATin | GSW | Product Owner | [chatin](https://github.com/joaorossiferreira/chatin) |

## Tecnologia

Site estático em HTML, CSS e JavaScript puros, sem dependências de build, publicado no GitHub Pages.

- Layout responsivo (mobile, tablet e desktop) e tema escuro/claro com troca manual.
- Interações em JavaScript puro: fundo de pontos que reage ao cursor (canvas), faixas de tecnologias que acompanham a velocidade da rolagem, abas de competências com medidores animados, linha do tempo que acompanha a leitura dos projetos, botões magnéticos e entrada de títulos por máscara. Tudo respeita `prefers-reduced-motion`.
- Versão em português (`index.html`) e em inglês (`en.html`).
- HTML semântico e acessível: navegação por teclado, link "pular para o conteúdo", textos alternativos e contraste adequado.
- Prints reais de cada projeto, com links para os vídeos de demonstração dos MVPs.
- Folha de estilos de impressão.

```
index.html
en.html
assets/
  css/style.css
  js/main.js
  img/      imagens (foto.jpg, banners, favicon)
  media/    GIFs e vídeos de demonstração
```
