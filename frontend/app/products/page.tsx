import Link from "next/link"
const Products = () => {
    return (
        <div>
            <h1>list of Products</h1>

            <Link href="/category">
                <button type="button">Click</button>
            </Link>
        </div>
    )
}

export default Products;