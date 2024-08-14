import React, { useState, useEffect } from 'react';
import { fetchResultsByData } from '../../services/ResultService';
import { formatter } from '../../utils/utils'
import './imposto.css'

function Imposto() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [ano, setAno] = useState(0);
  const [mes, setMes] = useState(0);
  const [anosDisponiveis, setAnosDisponiveis] = useState([]);
  const [results, setResults] = useState([]);
  const [totalResult, setTotalResult] = useState(0);
  const [totalImposto, setTotalImposto] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [ganhoIsento, setGanhoIsento] = useState(0);
  const [baseImposto, setBaseImposto] = useState(0);


  const LIMITE_ISENCAO = 35000;

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const anos = [];

    for (let year = currentYear; year >= startYear; year--) {
      anos.push(year);
    }

    setAnosDisponiveis(anos);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      
      const resultsFetched = await fetchResultsByData(mes, ano, user.id);
      console.log(mes, ano, user.id);
      console.log(resultsFetched);
      renderResults(resultsFetched);
    } catch(error){
      console.error(error);
    }
  };



  const renderResults = (results) => {
    let totalResult = 0;
    let totalVolume = 0;
    let baseImposto = 0;
    let totalImposto = 0;
    let ganhoIsento = 0;

    if (results.length > 0) {
      setResults(results);

      results.forEach((result) => {
        totalResult += result.resultado;
        totalVolume += result.volume;
      });

      if (totalResult > 0) {
        if (totalVolume > LIMITE_ISENCAO) {
          baseImposto = totalResult;
          totalImposto = totalResult * 0.15;
        } else {
          ganhoIsento = totalResult;
        }
      }

      setTotalResult(totalResult);
      setTotalVolume(totalVolume);
      setBaseImposto(baseImposto);
      setTotalImposto(totalImposto);
      setGanhoIsento(ganhoIsento);
    }
  };




  return (
    <div>
      <div className="main-section">
        <h1 className="titulo">Calculadora Imposto</h1>
      </div>

      <div className="container mt-4">
        <form id="imposto-form" onSubmit={handleSubmit}>
          <select
            className="custom-select"
            id="ano"
            name="ano"
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value))}
            required
          >
            <option value="">ano</option>
            {anosDisponiveis.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="custom-select"
            id="mes"
            name="mes"
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
            required
          >
            <option value="">select mes</option>
            <option value="01">Janeiro</option>
            <option value="02">Fevereiro</option>
            <option value="03">Março</option>
            <option value="04">Abril</option>
            <option value="05">Maio</option>
            <option value="06">Junho</option>
            <option value="07">Julho</option>
            <option value="8">Agosto</option>
            <option value="09">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>

      <div className="consolidado-container container mt-5">
        <div className="consolidado-header">
          <h4 className="consolidado-title">Consolidado do mês</h4>
        </div>

        <div className="consolidado-body">
          <div className="consolidado-item">
            <span
              className="displayBlock fontSizeMini white textUppercase fontSemiBold"
              id="resultado-mes-header"
            >
              RESULTADO DO MÊS
            </span>
            <span
              className="displayBlock fontSizeMini white"
              id="resultado-mes-data"
            >
              {formatter.format(totalResult)}
            </span>
          </div>
          <div className="consolidado-item">
            <span
              className="displayBlock fontSizeMini white textUppercase fontSemiBold"
              id="base-imposto-header"
            >
              BASE IMPOSTO
            </span>
            <span
              className="displayBlock fontSizeMini white"
              id="base-imposto-data"
            >
              {formatter.format(baseImposto)}
            </span>
          </div>
          <div className="consolidado-item">
            <span
              className="displayBlock fontSizeMini white textUppercase fontSemiBold"
              id="imposto-pagar-header"
            >
              IMPOSTO DEVIDO
            </span>
            <span
              className="displayBlock fontSizeMini white"
              id="imposto-pagar-data"
            >
              {formatter.format(totalImposto)}
            </span>
          </div>
          <div className="consolidado-item">
            <span
              className="displayBlock fontSizeMini white textUppercase fontSemiBold"
              id="total-vendas-header"
            >
              TOTAL DE VENDAS DE AÇÕES
            </span>
            <span
              className="displayBlock fontSizeMini white"
              id="total-vendas-data"
            >
              {formatter.format(totalVolume)}
            </span>
          </div>
          <div className="consolidado-item">
            <span
              className="displayBlock fontSizeMini white textUppercase fontSemiBold"
              id="limite-isencao-header"
            >
              LIMITE DE ISENÇÃO
            </span>
            <span
              className="displayBlock fontSizeMini white"
              id="limite-isencao-data"
            >
              {formatter.format(LIMITE_ISENCAO)}
            </span>
          </div>
          <div className="consolidado-item">
            <span
              className="displayBlock fontSizeMini white textUppercase fontSemiBold"
              id="ganho-isento-header"
            >
              GANHO ISENTO
            </span>
            <span
              className="displayBlock fontSizeMini white"
              id="ganho-isento-data"
            >
              {formatter.format(ganhoIsento)}
            </span>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <table
              id="results-list"
              className="table table-dark table-hover table-dark-custom"
            >
              <thead>
                {results.length > 0 && (
                  <tr>
                    <th scope="col">Ticker</th>
                    <th scope="col">Resultado</th>
                    <th scope="col">Rentabilidade</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="table-dark-custom">
                    <td className="col-4">{result.ticker}</td>
                    <td
                      className={`col-2 ${
                        result.resultado < 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {formatter.format(result.resultado)}
                    </td>
                    <td
                      className={`col-2 ${
                        result.resultado < 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {result.rentabilidade.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Imposto;