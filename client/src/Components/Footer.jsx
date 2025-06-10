import "../styles/footer.css"
const Footer = () => {
  const year = new Date().getFullYear()
  return <div className="footer">© {year} footer</div>
}

export default Footer
