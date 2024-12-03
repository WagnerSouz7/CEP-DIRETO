import { FiSearch } from "react-icons/fi";
import './styles.css';
import { useState } from "react";
import api from "./services/api.jsx";

function App() {
  const [input, setInput] = useState('');  
  const [cepData, setCepData] = useState(null);  
  const [loading, setLoading] = useState(false);  
  
  async function handleSearch() {
    if (input === "") {
      alert("Digite um Cep válido!");
      return;
    }

    setLoading(true);  

    try {
      const response = await api.get(`https://viacep.com.br/ws/${input}/json/`);
      
      
      if (response.data.erro) {
        alert("CEP não encontrado!");
        setCepData(null);  
      } else {
        setCepData(response.data);  
      }
    } catch (error) {
      alert("Ops! Erro ao buscar.");
      setCepData(null);  
    } finally {
      setLoading(false);  
    }
  }

  return (
    <div className="Container">
      <h1 id="Title">CEP-DIRETO</h1>

      <div className="containerInput">
        <input 
          type="text" 
          placeholder="Digite seu cep..." 
          value={input}
          onChange={(e) => setInput(e.target.value)} 
        />
        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="#000"/>
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>  
      ) : (
        <main className="main">
          {cepData ? (
            <>
              <h2 id="Text">CEP: {cepData.cep}</h2>
              <span id="Text">Rua: {cepData.logradouro}</span>
              <span id="Text">Complemento: {cepData.complemento || 'Não informado'}</span>
              <span id="Text">Bairro: {cepData.bairro}</span>
              <span id="Text">Cidade: {cepData.localidade}</span>
              <span id="Text">Estado: {cepData.uf}</span>
            </>
          ) : (
            <p id="Text">Nenhum resultado para exibir.</p>  
          )}
        </main>
      )}
    </div>
  );
}

export default App;
