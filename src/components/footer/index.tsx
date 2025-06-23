import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import logoDesenvolvedor from '../../assets/AlexDesenvolvedor.png'

export function Footer() {

  return (
    <footer className="flex flex-col w-full items-center justify-center h-32 bg-primary drop-shadow-xl px-4 mx-auto bg-slate-400">
      <Link
        to="https://portfolioalexdev.vercel.app/"
        target="_blank"
        className="text-background cursor-pointer hover:font-medium transition-all duration-500 mt-4"
      >
        Software desenvolvido por © Alex Nascimento
      </Link>

      <hr className="w-full max-w-md my-3 mx-4 border-vanilla" />

      <div className="flex items-center mb-4 gap-4">
        <Link to="https://portfolioalexdev.vercel.app/" target="_blank">
          <img src={logoDesenvolvedor} alt="Logo Desenvolvedor" className="w-9 h-9 rounded-full cursor-pointer" />
        </Link>
        <div className="flex gap-4">
          <Link to="https://github.com/alexdev613/" target="_blank">
            <FaGithub size={30} className="text-vanilla" title="Ver GitHub do desenvolvedor"/>
          </Link>
          <Link to="https://www.linkedin.com/in/alexjfnascimento/" target="_blank">
            <FaLinkedin size={30} className="text-vanilla" title="Ver LinkedIn do desenvolvedor"/>
          </Link>
          <Link to="https://api.whatsapp.com/send?phone=+5587981157269&text=Olá%20Alex,%20gostaria%20de%20mais%20informações%20sobre%20seu%20trabalho%20de%20programação%20web">
            <FaWhatsapp size={30} className="text-vanilla" title="Falar diretamente com o desenvolvedor"/>
          </Link>
        </div>
      </div>
    </footer>
  )
}
