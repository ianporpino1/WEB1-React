import React from 'react';
import './footer.css'

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="atendimento">
          <p>Atendimento</p>
          <span>(11) 3383-0526 (São Paulo)</span><br />
          <span>(21) 2101-8300 (Rio de Janeiro)</span><br />
          <span>Horário de atendimento:<br />
            De segunda à sexta-feira (exceto feriados)<br /> das 8h às 18h30</span>
        </div>
        <div className="atendimento">
          <p>SAC</p>
          <span>(11) 3383-0526 / (11) 2142-0409 (São Paulo)</span><br />
          <span>0800 772 2827 (Demais localidades)</span>
          <span>Horário de atendimento:<br />
            De segunda à sexta-feira (exceto feriados)<br /> das 9h às 18h00</span>
        </div>
        <div className="atendimento">
          <p>Ouvidoria</p>
          <span>0800 776 1443</span><br />
          <span>Horário de atendimento:<br />
            De segunda à sexta-feira (exceto feriados)<br /> das 9h às 18h00</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;