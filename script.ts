interface Veiculo {
    modelo: string;
    placa: string;
    entrada: Date | string;
}

(function (){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function patio () {
        function ler (): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar (veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar (veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.modelo}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function (){
                remover(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);

            if (salva) salvar([...ler(), veiculo]);
        }
        function remover (placa: string) {
            const { entrada, modelo } = ler().find(veiculo => veiculo.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if (
                !confirm(`O Veículo ${modelo} de placa ${placa}, permaneceu por ${tempo}. Deseja encerrar?`)
            )
            return;

            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            renderizar();



        }        
        function renderizar () {
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return {ler, adicionar, remover,salvar, renderizar}
    }
    patio().renderizar();

$("#cadastrar")?.addEventListener("click", () => {
    const modelo = $("#modelo")?.value;
    const placa = $("#placa")?.value;

    console.log(modelo,placa)

    if (!modelo || !placa) {
        alert("Os campos Modelo e Placa são obrigatórios");
        return;
    }

    patio().adicionar( {modelo, placa, entrada: new Date().toISOString() }, true);
})

})();