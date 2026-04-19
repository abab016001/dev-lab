export default function Popup({ children }) {
  return <>
    <div className="blockUI">
      <div className="container">
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  </>
}