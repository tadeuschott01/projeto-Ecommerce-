// ========================================
// CARRINHO
// ========================================

let carrinho = [];


// Elementos da página

const botoesComprar = document.querySelectorAll(".comprar");
const linkCarrinho = document.getElementById("link-carrinho");


// ========================================
// ADICIONAR PRODUTO
// ========================================

botoesComprar.forEach((botao) => {

    botao.addEventListener("click", function () {

        const produto = this.closest(".produto");

        if (!produto) {
            return;
        }

        const nome = produto.querySelector("h3").textContent.trim();

        const precoElemento = produto.querySelector(".preco");

        if (!precoElemento) {
            return;
        }

        const precoTexto = precoElemento.textContent.trim();

        const preco = Number(
            precoTexto
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        );

        const imagemElemento = produto.querySelector("img");

        const imagem = imagemElemento
            ? imagemElemento.src
            : "";


        // Verifica se o produto já está no carrinho

        const produtoExistente = carrinho.find(
            item => item.nome === nome
        );


        if (produtoExistente) {

            produtoExistente.quantidade += 1;

        } else {

            carrinho.push({

                nome: nome,

                preco: preco,

                imagem: imagem,

                quantidade: 1

            });

        }


        atualizarCarrinho();

    });

});


// ========================================
// ATUALIZAR NÚMERO DO CARRINHO
// ========================================

function atualizarCarrinho() {

    let quantidadeTotal = 0;


    carrinho.forEach((produto) => {

        quantidadeTotal += produto.quantidade;

    });


    if (linkCarrinho) {

        if (quantidadeTotal === 0) {

            linkCarrinho.textContent = "🛒 Carrinho";

        } else {

            linkCarrinho.textContent =
                `🛒 Carrinho (${quantidadeTotal})`;

        }

    }


    console.log("Carrinho:", carrinho);

}


// ========================================
// CLICAR NO CARRINHO
// ========================================

linkCarrinho.addEventListener("click", function (evento) {

    evento.preventDefault();

    console.log("Produtos no carrinho:", carrinho);

});


// ========================================
// BUSCA
// ========================================

const formBusca = document.getElementById("form-busca");
const campoBusca = document.getElementById("campo-busca");


if (formBusca) {

    formBusca.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const termo = campoBusca.value
            .trim()
            .toLowerCase();

        const produtos = document.querySelectorAll(".produto");


        produtos.forEach((produto) => {

            const nome = produto
                .querySelector("h3")
                .textContent
                .toLowerCase();

            if (termo === "" || nome.includes(termo)) {

                produto.style.display = "";

            } else {

                produto.style.display = "none";

            }

        });

    });

}


// ========================================
// NEWSLETTER
// ========================================

const formNewsletter =
    document.getElementById("form-newsletter");


if (formNewsletter) {

    formNewsletter.addEventListener("submit", function (evento) {

        evento.preventDefault();

        alert("Cadastro realizado com sucesso!");

        formNewsletter.reset();

    });

}


// ========================================
// INICIALIZAÇÃO
// ========================================

atualizarCarrinho();
