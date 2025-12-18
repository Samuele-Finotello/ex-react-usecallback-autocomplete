import { useState, useEffect, useCallback } from "react"

function App() {

  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setProducts([])
      return;
    }
    try {
      const res = await fetch(`http://localhost:3333/products?search=${query}`)
      const data = await res.json()
      setProducts(data)
      console.log('Ciao')
    } catch (error) {
      console.error(error)
    }
  }

  const debounce = (callback, delay) => {
    let timer;
    return (value) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        callback(value)
      }, delay)
    }
  }

  const debounceFetchProducts = useCallback(
    debounce(fetchProducts, 500), [])

  useEffect(() => {
    debounceFetchProducts(query)
  }, [query])

  return (
    <>
      <div>
        <input type="text" placeholder="Cerca..." value={query} onChange={e => setQuery(e.target.value)} />
        {products.length > 0 && (
          <div className="dropdown">
            {products.map(product => {
              return (
                <p key={product.id} onClick={() => {
                  setProducts([]);
                  setQuery('');
                  setSelectedProduct(product);
                }}>{product.name}</p>
              )
            })}
          </div>
        )}
        <div>
          {selectedProduct && (
            <div className="card" key={selectedProduct.id}>
              <figure><img src={selectedProduct.image} alt={selectedProduct.name} /></figure>
              <h2>{selectedProduct.name} ({selectedProduct.brand})</h2>
              <p>
                {selectedProduct.description}
                Color: {selectedProduct.color}
              </p>
              <span><strong>€ {selectedProduct.price}</strong></span>
            </div>
          )}
        </div>


      </div>
    </>
  )
}

export default App
