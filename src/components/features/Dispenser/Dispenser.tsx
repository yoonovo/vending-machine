import "./Dispenser.scss";
import { useProducts } from "@/stores/useProducts";

const Dispenser = () => {
  const { products, purchasedProducts, resetPurchasedProducts } = useProducts();

  return (
    <div className="dispenser">
      <ul className="purchased-products">
        {products.map(({ name, color }) =>
          purchasedProducts[name] > 0 ? (
            <li
              key={`purchased_products_${name}`}
              style={{ background: color }}
            >
              {name} {purchasedProducts[name]}개
            </li>
          ) : (
            ""
          )
        )}
      </ul>
      <button className="button" onClick={resetPurchasedProducts}>
        꺼내기
      </button>
    </div>
  );
};

export default Dispenser;
