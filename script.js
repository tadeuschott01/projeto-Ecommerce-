// ========================================
// CARRINHO DE COMPRAS
// ========================================

let carrinho = [];

// Seleciona todos os botões de comprar
const botoesComprar = document.querySelectorAll(".comprar");

botoesComprar.forEach((botao) => {

    botao.addEventListener("click", () => {

        const produto = botao.closest(".produto");

        const nome = produto.querySelector("h3").textContent.trim();
        const precoTexto = produto.querySelector(".preco").textContent.trim();
        const imagem = produto.querySelector("img").src;

        const preco = Number(
            precoTexto
                .replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
                .trim()
        );

        const produtoExistente = carrinho.find(
            (item) => item.nome === nome
        );

        if (produtoExistente) {

            produtoExistente.quantidade++;

        } else {

            carrinho.push({
                nome: nome,
                preco: preco,
                imagem: imagem,
                quantidade: 1
            });

        }

        atualizarCarrinho();

        alert(`${nome} foi adicionado ao carrinho!`);
    });

});


// ========================================
// ATUALIZAR CARRINHO
// ========================================

function atualizarCarrinho() {

    let quantidadeTotal = 0;

    carrinho.forEach((produto) => {
        quantidadeTotal += produto.quantidade;
    });

    const linkCarrinho = document.getElementById("link-carrinho");
    );

    if (linkCarrinho) {

        linkCarrinho.textContent =
            `🛒 Carrinho (${quantidadeTotal})`;

    }

    console.log("Carrinho:", carrinho);
}
