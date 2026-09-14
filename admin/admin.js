/* =========================================================
   MINHA CONFECÇÃO — ADMIN.JS
   SUPABASE + STORAGE
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://ujutkgdylwwatbjsnvzw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_5xv4o64FABCRaffX77QEqA_8VHBTX83";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


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

let arquivoImagemAtual = null;

let imagemAtualUrl = "";

let produtoParaExcluir = null;


/* =========================================================
   FORMATAR PREÇO
========================================================= */

function formatarPreco(valor) {

    return Number(valor || 0)
        .toLocaleString(
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
   MENSAGEM
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
   CARREGAR PRODUTOS DO SUPABASE
========================================================= */

async function carregarProdutos() {

    if (listaProdutosAdmin) {

        listaProdutosAdmin.innerHTML = `
            <div class="estado-vazio">
                <span>⏳</span>
                <h3>Carregando produtos...</h3>
            </div>
        `;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("products")

        .select("*")

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );

        mostrarMensagem(
            "Erro ao carregar produtos.",
            "erro"
        );

        produtos = [];

        renderizarProdutos();

        return;

    }


    produtos =
        data || [];


    renderizarProdutos();

}


/* =========================================================
   SELECIONAR FOTO
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
                    "Escolha JPG, JPEG, PNG ou WEBP."
                );

                produtoImagem.value =
                    "";

                return;

            }


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


            arquivoImagemAtual =
                arquivo;


            const previewUrl =
                URL.createObjectURL(
                    arquivo
                );


            mostrarPreview(
                previewUrl
            );

        }
    );

}


/* =========================================================
   MOSTRAR PREVIEW
========================================================= */

function mostrarPreview(url) {

    if (
        !previewContainer ||
        !previewImagem
    ) {

        return;

    }


    if (!url) {

        previewContainer.classList
            .remove("ativo");

        previewImagem.removeAttribute(
            "src"
        );

        return;

    }


    previewImagem.src =
        url;


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

            arquivoImagemAtual =
                null;

            imagemAtualUrl =
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
   UPLOAD PARA STORAGE
========================================================= */

async function enviarImagemStorage(
    arquivo
) {

    if (!arquivo) {

        return imagemAtualUrl || null;

    }


    const extensao =
        arquivo.name
            .split(".")
            .pop()
            .toLowerCase();


    const nomeArquivo =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}.${extensao}`;


    const caminho =
        `produtos/${nomeArquivo}`;


    const {
        error
    } = await supabaseClient
        .storage
        .from("products")
        .upload(
            caminho,
            arquivo,
            {
                cacheControl: "3600",
                upsert: false
            }
        );


    if (error) {

        console.error(
            "Erro no upload:",
            error
        );

        throw new Error(
            "Não foi possível enviar a foto."
        );

    }


    const {
        data
    } = supabaseClient
        .storage
        .from("products")
        .getPublicUrl(
            caminho
        );


    return data.publicUrl;

}


/* =========================================================
   SALVAR PRODUTO
========================================================= */

if (produtoForm) {

    produtoForm.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            mostrarMensagem(
                "Salvando produto..."
            );


            if (btnSalvar) {

                btnSalvar.disabled =
                    true;

                btnSalvar.textContent =
                    "Salvando...";

            }


            try {


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


                if (!nome) {

                    throw new Error(
                        "Digite o nome do produto."
                    );

                }


                if (
                    !preco ||
                    preco <= 0
                ) {

                    throw new Error(
                        "Digite um preço válido."
                    );

                }


                if (!categoria) {

                    throw new Error(
                        "Selecione uma categoria."
                    );

                }


                if (estoque < 0) {

                    throw new Error(
                        "O estoque não pode ser negativo."
                    );

                }


                if (
                    promocional &&
                    promocional >= preco
                ) {

                    throw new Error(
                        "O preço promocional deve ser menor que o preço normal."
                    );

                }


                /* =========================
                   UPLOAD DA FOTO
                ========================== */

                const urlImagem =
                    await enviarImagemStorage(
                        arquivoImagemAtual
                    );


                const dadosProduto = {

                    name:
                        nome,

                    price:
                        preco,

                    promotional_price:
                        promocional,

                    category:
                        categoria,

                    stock:
                        estoque,

                    description:
                        descricao,

                    image_url:
                        urlImagem,

                    is_offer:
                        oferta

                };


                const idEdicao =
                    produtoId.value;


                /* =========================
                   EDITAR
                ========================== */

                if (idEdicao) {

                    const {
                        error
                    } = await supabaseClient

                        .from("products")

                        .update(
                            dadosProduto
                        )

                        .eq(
                            "id",
                            idEdicao
                        );


                    if (error) {

                        throw error;

                    }


                    mostrarMensagem(
                        "Produto atualizado com sucesso!"
                    );

                }


                /* =========================
                   NOVO PRODUTO
                ========================== */

                else {

                    const {
                        error
                    } = await supabaseClient

                        .from("products")

                        .insert([
                            dadosProduto
                        ]);


                    if (error) {

                        throw error;

                    }


                    mostrarMensagem(
                        "Produto cadastrado com sucesso!"
                    );

                }


                limparFormulario();

                await carregarProdutos();


            } catch (erro) {


                console.error(
                    "Erro ao salvar:",
                    erro
                );


                mostrarMensagem(
                    erro.message ||
                    "Erro ao salvar produto.",
                    "erro"
                );


            } finally {


                if (btnSalvar) {

                    btnSalvar.disabled =
                        false;


                    if (
                        produtoId.value
                    ) {

                        btnSalvar.textContent =
                            "Salvar alterações";

                    } else {

                        btnSalvar.textContent =
                            "Salvar produto";

                    }

                }

            }

        }
    );

}


/* =========================================================
   RENDERIZAR
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


    const filtrados =
        produtos.filter(
            function (produto) {

                const nome =
                    String(
                        produto.name || ""
                    ).toLowerCase();


                const categoria =
                    String(
                        produto.category || ""
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
        filtrados.length === 0
    ) {

        listaProdutosAdmin.innerHTML = `

            <div class="estado-vazio">

                <span>
                    📦
                </span>

                <h3>
                    Nenhum produto cadastrado
                </h3>

                <p>
                    Cadastre seu primeiro produto.
                </p>

            </div>

        `;

        return;

    }


    listaProdutosAdmin.innerHTML =
        "";


    filtrados.forEach(
        function (produto) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "produto-admin-item";


            const imagem =
                produto.image_url

                    ? produto.image_url

                    : "https://placehold.co/300x400?text=Sem+Foto";


            let precoHTML = `

                <div
                    class="produto-admin-preco"
                >

                    ${formatarPreco(
                        produto.price
                    )}

                </div>

            `;


            if (
                produto.promotional_price
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
                            produto.price
                        )}

                    </div>


                    <div
                        class="produto-admin-preco"
                    >

                        ${formatarPreco(
                            produto.promotional_price
                        )}

                    </div>

                `;

            }


            item.innerHTML = `

                <img
                    src="${imagem}"
                    alt="${escaparHTML(
                        produto.name
                    )}"
                >


                <div
                    class="produto-admin-info"
                >

                    <span
                        class="produto-admin-categoria"
                    >

                        ${escaparHTML(
                            produto.category
                        )}

                    </span>


                    <h3>

                        ${escaparHTML(
                            produto.name
                        )}

                    </h3>


                    ${precoHTML}


                    <div
                        class="produto-admin-detalhes"
                    >

                        Estoque:
                        ${produto.stock}

                        ${
                            produto.is_offer
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

        totalEstoque.textContent =
            produtos.reduce(
                function (
                    total,
                    produto
                ) {

                    return (
                        total +
                        Number(
                            produto.stock || 0
                        )
                    );

                },
                0
            );

    }


    if (totalOfertas) {

        totalOfertas.textContent =
            produtos.filter(
                function (produto) {

                    return Boolean(
                        produto.is_offer
                    );

                }
            ).length;

    }

}


/* =========================================================
   EDITAR / EXCLUIR
========================================================= */

document.addEventListener(
    "click",
    function (evento) {

        const editar =
            evento.target.closest(
                "[data-editar]"
            );


        if (editar) {

            editarProduto(
                editar.dataset.editar
            );

            return;

        }


        const excluir =
            evento.target.closest(
                "[data-excluir]"
            );


        if (excluir) {

            produtoParaExcluir =
                excluir.dataset.excluir;


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
                    String(item.id) ===
                    String(id)
                );

            }
        );


    if (!produto) {
        return;
    }


    produtoId.value =
        produto.id;


    produtoNome.value =
        produto.name;


    produtoPreco.value =
        produto.price;


    produtoPromocional.value =
        produto.promotional_price || "";


    produtoCategoria.value =
        produto.category;


    produtoEstoque.value =
        produto.stock;


    produtoDescricao.value =
        produto.description || "";


    produtoOferta.checked =
        Boolean(
            produto.is_offer
        );


    imagemAtualUrl =
        produto.image_url || "";


    arquivoImagemAtual =
        null;


    mostrarPreview(
        imagemAtualUrl
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

    produtoForm.reset();


    produtoId.value =
        "";


    produtoEstoque.value =
        1;


    arquivoImagemAtual =
        null;


    imagemAtualUrl =
        "";


    produtoImagem.value =
        "";


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
        limparFormulario
    );

}


/* =========================================================
   CONFIRMAR EXCLUSÃO
========================================================= */

if (confirmarExclusao) {

    confirmarExclusao.addEventListener(
        "click",
        async function () {

            if (!produtoParaExcluir) {
                return;
            }


            const {
                error
            } = await supabaseClient

                .from("products")

                .delete()

                .eq(
                    "id",
                    produtoParaExcluir
                );


            if (error) {

                console.error(error);

                mostrarMensagem(
                    "Erro ao excluir produto.",
                    "erro"
                );

                return;

            }


            produtoParaExcluir =
                null;


            modalExcluir.classList
                .remove("ativo");


            mostrarMensagem(
                "Produto excluído com sucesso!"
            );


            await carregarProdutos();

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

            modalExcluir.classList
                .remove("ativo");

        }
    );

}


/* =========================================================
   BUSCA
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
