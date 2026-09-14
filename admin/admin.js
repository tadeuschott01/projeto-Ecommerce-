/* =========================================================
   MINHA CONFECÇÃO — ADMIN.JS
   Cadastro + edição + exclusão + upload de imagem
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const produtoForm =
    document.getElementById("produto-form");

const produtoId =
    document.getElementById("produto-id");

const produtoNome =
    document.getElementById("produto-nome");

const produtoPreco =
    document.getElementById("produto-preco");

const produtoPromocional =
    document.getElementById("produto-promocional");

const produtoCategoria =
    document.getElementById("produto-categoria");

const produtoEstoque =
    document.getElementById("produto-estoque");

const produtoDescricao =
    document.getElementById("produto-descricao");

const produtoImagem =
    document.getElementById("produto-imagem");

const produtoOferta =
    document.getElementById("produto-oferta");

const previewContainer =
    document.getElementById("preview-container");

const previewImagem =
    document.getElementById("preview-imagem");

const removerImagem =
    document.getElementById("remover-imagem");

const listaProdutosAdmin =
    document.getElementById("lista-produtos-admin");

const buscarProduto =
    document.getElementById("buscar-produto");

const mensagemForm =
    document.getElementById("mensagem-form");

const btnCancelar =
    document.getElementById("btn-cancelar");

const btnSalvar =
    document.getElementById("btn-salvar");

const tituloFormulario =
    document.getElementById("titulo-formulario");

const totalProdutos =
    document.getElementById("total-produtos");

const totalEstoque =
    document.getElementById("total-estoque");

const totalOfertas =
    document.getElementById("total-ofertas");

const modalExcluir =
    document.getElementById("modal-excluir");

const cancelarExclusao =
    document.getElementById("cancelar-exclusao");

const confirmarExclusao =
    document.getElementById("confirmar-exclusao");


/* =========================================================
   ESTADO
========================================================= */

let produtos = [];

let imagemAtual = "";

let produtoParaExcluir = null;


/* =========================================================
   CARREGAR PRODUTOS
========================================================= */

function carregarProdutos() {

    try {

        const dados =
            localStorage.getItem(
                "minhaConfeccaoProdutos"
            );

        if (!dados) {

            produtos = [];

            return;

        }

        const lista =
            JSON.parse(dados);

        if (Array.isArray(lista)) {

            produtos = lista;

        } else {

            produtos = [];

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

        produtos = [];

    }

}


/* =========================================================
   SALVAR PRODUTOS
========================================================= */

function salvarProdutos() {

    try {

        localStorage.setItem(
            "minhaConfeccaoProdutos",
            JSON.stringify(produtos)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar produtos:",
            erro
        );

        mostrarMensagem(
            "Não foi possível salvar. A imagem pode ser grande demais para o armazenamento local.",
            "erro"
        );

        return false;

    }

}


/* =========================================================
   GERAR ID
========================================================= */

function gerarId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


/* =========================================================
   FORMATAR PREÇO
========================================================= */

function formatarPreco(valor) {

    const numero =
        Number(valor || 0);

    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {

    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   MENSAGENS
========================================================= */

function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {

    if (!mensagemForm) {
        return;
    }

    mensagemForm.textContent =
        texto;

    mensagemForm.className =
        "mensagem-form " + tipo;

}


/* =========================================================
   SELECIONAR IMAGEM
========================================================= */

if (produtoImagem) {

    produtoImagem.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files[0];

            if (!arquivo) {
                return;
            }


            /* =========================
               FORMATOS PERMITIDOS
            ========================== */

            const tiposPermitidos = [

                "image/jpeg",

                "image/png",

                "image/webp"

            ];


            if (
                !tiposPermitidos.includes(
                    arquivo.type
                )
            ) {

                alert(
                    "Formato não permitido. Escolha uma imagem JPG, JPEG, PNG ou WEBP."
                );

                produtoImagem.value =
                    "";

                return;

            }


            /* =========================
               LIMITE DE 15 MB
            ========================== */

            const limite =
                15 * 1024 * 1024;


            if (
                arquivo.size >
                limite
            ) {

                alert(
                    "A imagem deve ter no máximo 15 MB."
                );

                produtoImagem.value =
                    "";

                return;

            }


            /* =========================
               CARREGAR FOTO
            ========================== */

            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {

                    imagemAtual =
                        evento.target.result;

                    mostrarPreview(
                        imagemAtual
                    );

                };


            leitor.onerror =
                function () {

                    alert(
                        "Não foi possível carregar essa imagem."
                    );

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


/* =========================================================
   MOSTRAR PRÉVIA
========================================================= */

function mostrarPreview(imagem) {

    if (
        !previewContainer ||
        !previewImagem
    ) {

        return;

    }


    if (!imagem) {

        previewContainer.classList
            .remove("ativo");

        previewImagem.removeAttribute(
            "src"
        );

        return;

    }


    previewImagem.src =
        imagem;


    previewContainer.classList
        .add("ativo");

}


/* =========================================================
   REMOVER FOTO
========================================================= */

if (removerImagem) {

    removerImagem.addEventListener(
        "click",
        function () {

            imagemAtual =
                "";

            if (produtoImagem) {

                produtoImagem.value =
                    "";

            }

            mostrarPreview("");

        }
    );

}


/* =========================================================
   CADASTRAR / EDITAR
========================================================= */

if (produtoForm) {

    produtoForm.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const nome =
                produtoNome.value
                    .trim();


            const preco =
                Number(
                    produtoPreco.value
                );


            const promocional =
                produtoPromocional.value

                    ? Number(
                        produtoPromocional.value
                    )

                    : null;


            const categoria =
                produtoCategoria.value;


            const estoque =
                Number(
                    produtoEstoque.value
                );


            const descricao =
                produtoDescricao.value
                    .trim();


            const oferta =
                produtoOferta.checked;


            /* =========================
               VALIDAÇÕES
            ========================== */

            if (!nome) {

                mostrarMensagem(
                    "Digite o nome do produto.",
                    "erro"
                );

                return;

            }


            if (
                !preco ||
                preco <= 0
            ) {

                mostrarMensagem(
                    "Digite um preço válido.",
                    "erro"
                );

                return;

            }


            if (!categoria) {

                mostrarMensagem(
                    "Selecione uma categoria.",
                    "erro"
                );

                return;

            }


            if (
                estoque < 0
            ) {

                mostrarMensagem(
                    "O estoque não pode ser negativo.",
                    "erro"
                );

                return;

            }


            if (
                promocional &&
                promocional >= preco
            ) {

                mostrarMensagem(
                    "O preço promocional precisa ser menor que o preço normal.",
                    "erro"
                );

                return;

            }


            const idEdicao =
                produtoId.value;


            /* =========================
               EDITAR PRODUTO
            ========================== */

            if (idEdicao) {

                const indice =
                    produtos.findIndex(
                        function (produto) {

                            return (
                                produto.id ===
                                idEdicao
                            );

                        }
                    );


                if (indice === -1) {

                    mostrarMensagem(
                        "Produto não encontrado.",
                        "erro"
                    );

                    return;

                }


                const produtoAnterior = {
                    ...produtos[indice]
                };


                produtos[indice] = {

                    ...produtos[indice],

                    nome: nome,

                    preco: preco,

                    precoPromocional:
                        promocional,

                    categoria:
                        categoria,

                    estoque:
                        estoque,

                    descricao:
                        descricao,

                    oferta:
                        oferta,

                    imagem:
                        imagemAtual

                };


                if (!salvarProdutos()) {

                    produtos[indice] =
                        produtoAnterior;

                    return;

                }


                renderizarProdutos();

                limparFormulario();


                mostrarMensagem(
                    "Produto atualizado com sucesso!"
                );


                return;

            }


            /* =========================
               NOVO PRODUTO
            ========================== */

            const novoProduto = {

                id:
                    gerarId(),

                nome:
                    nome,

                preco:
                    preco,

                precoPromocional:
                    promocional,

                categoria:
                    categoria,

                estoque:
                    estoque,

                descricao:
                    descricao,

                oferta:
                    oferta,

                imagem:
                    imagemAtual,

                criadoEm:
                    new Date()
                        .toISOString()

            };


            produtos.unshift(
                novoProduto
            );


            if (!salvarProdutos()) {

                produtos.shift();

                return;

            }


            renderizarProdutos();

            limparFormulario();


            mostrarMensagem(
                "Produto cadastrado com sucesso!"
            );

        }
    );

}


/* =========================================================
   RENDERIZAR PRODUTOS
========================================================= */

function renderizarProdutos(
    filtro = ""
) {

    if (!listaProdutosAdmin) {
        return;
    }


    const termo =
        filtro
            .trim()
            .toLowerCase();


    const produtosFiltrados =
        produtos.filter(
            function (produto) {

                const nome =
                    String(
                        produto.nome || ""
                    ).toLowerCase();


                const categoria =
                    String(
                        produto.categoria || ""
                    ).toLowerCase();


                return (

                    nome.includes(
                        termo
                    )

                    ||

                    categoria.includes(
                        termo
                    )

                );

            }
        );


    atualizarResumo();


    if (
        produtosFiltrados.length === 0
    ) {

        listaProdutosAdmin.innerHTML = `

            <div class="estado-vazio">

                <span>
                    📦
                </span>

                <h3>
                    Nenhum produto encontrado
                </h3>

                <p>
                    Cadastre um novo produto
                    para começar.
                </p>

            </div>

        `;

        return;

    }


    listaProdutosAdmin.innerHTML =
        "";


    produtosFiltrados.forEach(
        function (produto) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "produto-admin-item";


            const imagem =
                produto.imagem

                    ? produto.imagem

                    : "https://placehold.co/300x400?text=Sem+Foto";


            let precoHTML = `

                <div
                    class="produto-admin-preco"
                >

                    ${formatarPreco(
                        produto.preco
                    )}

                </div>

            `;


            if (
                produto.precoPromocional
            ) {

                precoHTML = `

                    <div
                        style="
                            font-size:12px;
                            color:#8d8582;
                            text-decoration:line-through;
                        "
                    >

                        ${formatarPreco(
                            produto.preco
                        )}

                    </div>


                    <div
                        class="produto-admin-preco"
                    >

                        ${formatarPreco(
                            produto.precoPromocional
                        )}

                    </div>

                `;

            }


            item.innerHTML = `

                <img
                    src="${imagem}"
                    alt="${escaparHTML(
                        produto.nome
                    )}"
                >


                <div
                    class="produto-admin-info"
                >

                    <span
                        class="produto-admin-categoria"
                    >

                        ${escaparHTML(
                            produto.categoria
                        )}

                    </span>


                    <h3>

                        ${escaparHTML(
                            produto.nome
                        )}

                    </h3>


                    ${precoHTML}


                    <div
                        class="produto-admin-detalhes"
                    >

                        Estoque:
                        ${produto.estoque}

                        ${
                            produto.oferta
                                ? " • Oferta"
                                : ""
                        }

                    </div>


                    <div
                        class="produto-admin-acoes"
                    >

                        <button
                            type="button"
                            class="btn-editar"
                            data-editar="${produto.id}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            data-excluir="${produto.id}"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;


            listaProdutosAdmin
                .appendChild(
                    item
                );

        }
    );

}


/* =========================================================
   RESUMO
========================================================= */

function atualizarResumo() {

    if (totalProdutos) {

        totalProdutos.textContent =
            produtos.length;

    }


    if (totalEstoque) {

        const estoque =
            produtos.reduce(
                function (
                    total,
                    produto
                ) {

                    return (
                        total +
                        Number(
                            produto.estoque || 0
                        )
                    );

                },
                0
            );


        totalEstoque.textContent =
            estoque;

    }


    if (totalOfertas) {

        const ofertas =
            produtos.filter(
                function (produto) {

                    return Boolean(
                        produto.oferta
                    );

                }
            ).length;


        totalOfertas.textContent =
            ofertas;

    }

}


/* =========================================================
   CLIQUES EDITAR / EXCLUIR
========================================================= */

document.addEventListener(
    "click",
    function (evento) {

        const botaoEditar =
            evento.target.closest(
                "[data-editar]"
            );


        if (botaoEditar) {

            const id =
                botaoEditar.dataset
                    .editar;


            editarProduto(id);

            return;

        }


        const botaoExcluir =
            evento.target.closest(
                "[data-excluir]"
            );


        if (botaoExcluir) {

            produtoParaExcluir =
                botaoExcluir.dataset
                    .excluir;


            if (modalExcluir) {

                modalExcluir.classList
                    .add("ativo");

            }

        }

    }
);


/* =========================================================
   EDITAR PRODUTO
========================================================= */

function editarProduto(id) {

    const produto =
        produtos.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!produto) {
        return;
    }


    produtoId.value =
        produto.id;


    produtoNome.value =
        produto.nome;


    produtoPreco.value =
        produto.preco;


    produtoPromocional.value =
        produto.precoPromocional || "";


    produtoCategoria.value =
        produto.categoria;


    produtoEstoque.value =
        produto.estoque;


    produtoDescricao.value =
        produto.descricao || "";


    produtoOferta.checked =
        Boolean(
            produto.oferta
        );


    imagemAtual =
        produto.imagem || "";


    mostrarPreview(
        imagemAtual
    );


    if (tituloFormulario) {

        tituloFormulario.textContent =
            "Editar produto";

    }


    if (btnSalvar) {

        btnSalvar.textContent =
            "Salvar alterações";

    }


    if (btnCancelar) {

        btnCancelar.classList.add(
            "ativo"
        );

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   LIMPAR FORMULÁRIO
========================================================= */

function limparFormulario() {

    if (!produtoForm) {
        return;
    }


    produtoForm.reset();


    produtoId.value =
        "";


    produtoEstoque.value =
        1;


    imagemAtual =
        "";


    if (produtoImagem) {

        produtoImagem.value =
            "";

    }


    mostrarPreview("");


    if (tituloFormulario) {

        tituloFormulario.textContent =
            "Adicionar produto";

    }


    if (btnSalvar) {

        btnSalvar.textContent =
            "Salvar produto";

    }


    if (btnCancelar) {

        btnCancelar.classList.remove(
            "ativo"
        );

    }

}


/* =========================================================
   CANCELAR EDIÇÃO
========================================================= */

if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        function () {

            limparFormulario();

        }
    );

}


/* =========================================================
   CONFIRMAR EXCLUSÃO
========================================================= */

if (confirmarExclusao) {

    confirmarExclusao.addEventListener(
        "click",
        function () {

            if (!produtoParaExcluir) {
                return;
            }


            const produtosAnteriores =
                [...produtos];


            produtos =
                produtos.filter(
                    function (produto) {

                        return (
                            produto.id !==
                            produtoParaExcluir
                        );

                    }
                );


            if (!salvarProdutos()) {

                produtos =
                    produtosAnteriores;

                return;

            }


            renderizarProdutos();


            produtoParaExcluir =
                null;


            if (modalExcluir) {

                modalExcluir.classList
                    .remove("ativo");

            }


            mostrarMensagem(
                "Produto excluído com sucesso!"
            );

        }
    );

}


/* =========================================================
   CANCELAR EXCLUSÃO
========================================================= */

if (cancelarExclusao) {

    cancelarExclusao.addEventListener(
        "click",
        function () {

            produtoParaExcluir =
                null;


            if (modalExcluir) {

                modalExcluir.classList
                    .remove("ativo");

            }

        }
    );

}


/* =========================================================
   FECHAR MODAL CLICANDO FORA
========================================================= */

if (modalExcluir) {

    modalExcluir.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                modalExcluir
            ) {

                produtoParaExcluir =
                    null;


                modalExcluir.classList
                    .remove("ativo");

            }

        }
    );

}


/* =========================================================
   BUSCAR PRODUTOS
========================================================= */

if (buscarProduto) {

    buscarProduto.addEventListener(
        "input",
        function () {

            renderizarProdutos(
                buscarProduto.value
            );

        }
    );

}


/* =========================================================
   INICIAR
========================================================= */

carregarProdutos();

renderizarProdutos();
