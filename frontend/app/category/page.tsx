import Link from "next/link";

export default function Category() {
    return (
        <>
            <h1>List of category</h1>
            <Link href="/products">
                <button type="button">Click</button>
            </Link>
        </>
    );
}
