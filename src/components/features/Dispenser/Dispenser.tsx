import { initPurchasedProducts } from "@/constants";
import "./Dispenser.scss";
import { productsType } from "@/types/VendingMachineType";

type DispenserPropsType = {
  products: productsType[];
  purchasedProducts: Record<string, number>;
  setPurchasedProducts: (v: Record<string, number>) => void;
};

const Dispenser = ({
  products,
  purchasedProducts,
  setPurchasedProducts,
}: DispenserPropsType) => {
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

      <button
        className="button"
        onClick={() => setPurchasedProducts(initPurchasedProducts)}
      >
        꺼내기
      </button>
    </div>
  );
};

export default Dispenser;
