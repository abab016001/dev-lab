export default function ProductGrid({products}) {
  return (
    <div className="container my-5">
      <div className="row g-4">
        {products.map(p => (
            <div className="col-6 col-md-4 col-lg-3" key={p.id}>
              <div className="card h-100">
                <img src={p.image} className="card-img-top" alt="product"></img>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{p.title}</h6>
                  <p className="text-muted mb-1">${p.price}</p>
                  <button className="btn btn-primary mt-auto">加入購物車</button>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  )
}