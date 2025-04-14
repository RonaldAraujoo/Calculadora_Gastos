// Mostrar e esconder o menu de navegação
const menuBtn = document.getElementById("menu-btn");
const menu = document.querySelector(".menu");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Impede que o clique feche o menu
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
});

// Fecha o menu se clicar fora dele
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== menuBtn) {
    menu.style.display = "none";
  }
});

// Referências dos campos e lista de despesas
const rendaInput = document.getElementById("renda");
const despesaForm = document.getElementById("despesa-form");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const listaDespesas = document.getElementById("lista-despesas");
const restanteP = document.getElementById("restante");

// Função para atualizar o valor restante
function atualizarRestante() {
    const renda = parseFloat(rendaInput.value) || 0;
    const despesas = Array.from(listaDespesas.children).map(li => {
        return parseFloat(li.querySelector(".valor").textContent.replace("R$ ", ""));
    }).reduce((acc, valor) => acc + valor, 0);
    const restante = renda - despesas;
    restanteP.textContent = `Renda disponível após despesas: R$ ${restante.toFixed(2)}`;
}

// Função para adicionar uma despesa
despesaForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o comportamento padrão do form

    const descricao = descricaoInput.value;
    const valor = parseFloat(valorInput.value);

    if (descricao && valor) {
        const li = document.createElement("li");
        li.classList.add("despesa-item");

        li.innerHTML = `
            <span class="descricao">${descricao}</span>
            <span class="valor">R$ ${valor.toFixed(2)}</span>
            <button class="editar">Editar</button>
            <button class="excluir">Excluir</button>
        `;

        listaDespesas.appendChild(li);

        // Limpar os campos de entrada
        descricaoInput.value = "";
        valorInput.value = "";

        // Atualizar o valor restante após a despesa
        atualizarRestante();

        // Editar despesa
        const editarBtn = li.querySelector(".editar");
        editarBtn.addEventListener("click", function() {
            descricaoInput.value = descricao;
            valorInput.value = valor;
            li.remove(); // Remover a despesa para editar
            atualizarRestante();
        });

        // Excluir despesa
        const excluirBtn = li.querySelector(".excluir");
        excluirBtn.addEventListener("click", function() {
            li.remove();
            atualizarRestante();
        });
    } else {
        alert("Por favor, preencha a descrição e o valor da despesa.");
    }
});

// Atualizar valor restante quando a renda for alterada
rendaInput.addEventListener("input", atualizarRestante);
