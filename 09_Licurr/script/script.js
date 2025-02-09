document.addEventListener("DOMContentLoaded", function () {
  // Adiciona o evento de input para todos os inputs com classe .curropt
  const inputs = document.querySelectorAll(".curropt input");
  const clearBtns = document.querySelectorAll(".clear-btn");

  // Mostrar o botão de limpar ao digitar e limpar o campo ao clicar no botão
  inputs.forEach((input, index) => {
    const clearBtn = clearBtns[index];

    // Mostra o botão "X" quando o input não está vazio
    input.addEventListener("input", () => {
      clearBtn.style.display = input.value ? "block" : "none";
    });

    // Limpa o input quando o botão "X" é clicado
    clearBtn.addEventListener("click", () => {
      inputs.forEach((input) => {
        input.value = "";
      });

      // Esconde todos os botões "X"
      clearBtns.forEach((clearBtn) => {
        clearBtn.style.display = "none";
      });
      inputs[index].focus();
    });
  });
});
