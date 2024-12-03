import { FiSearch } from "react-icons/fi";
import './styles.css';
import { useState } from "react";
import api from "./services/api.jsx";

// validando o tamanho do cep, para poder exibir o erro
const validarCep = (cep) => /^[0-9]{5}-[0-9]{3}$/.test(cep);

function App() {
  const [input, setInput] = useState('');  
  const [cepData, setCepData] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(''); 

  // permitindo apenas utilizar letras e -
  const handleInputChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9-]/g, '');
    setInput(filteredValue);
  };

 
  async function handleSearch() {
    if (input === "") {
      alert("Digite um CEP válido!");
      return;
    }

  
    if (!validarCep(input)) {
      setError("CEP inválido! Use o formato: 12345-678");
      return;
    }

    setLoading(true);  
    setError('');  

    //linkando c api
    try {
      const response = await api.get(`https://viacep.com.br/ws/${input}/json/`);
      
      if (response.data.erro) {
        setError("CEP não encontrado!");
        setCepData(null);  
      } else {
        setCepData(response.data);  
      }
    } catch (error) {
      setError("Ops! Erro ao buscar.");
      setCepData(null);  
    } finally {
      setLoading(false);  
    }
  }

  // ativando o botão enter, cod do botao =13
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="Container">
      <h1 id="Title">CEP-DIRETO</h1>

      <div className="containerInput">
        <input 
          type="text" 
          placeholder="Digite seu cep..." 
          value={input}
          onChange={handleInputChange}  //chama a função para usar apenas numeros e -
          onKeyDown={handleKeyDown}  // ativa o enter para poder pesquisar
        />
        <button 
          className="buttonSearch" 
          onClick={handleSearch} 
          disabled={loading}
        >
          <FiSearch size={25} color="#000"/>
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>  
      ) : (
        <main className="main">
          {error && <p style={{ color: 'red' }}>{error}</p>}  {}
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
            !error && <p id="Text">Nenhum resultado para exibir.</p>  
          )}
        </main>
      )}
    </div>
  );
}

export default App;
