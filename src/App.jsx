import { useState, useEffect, useCallback } from "react"

function App() {

  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])

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
                <p key={product.id}>{product.name}</p>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default App
