import "./CashList.scss";

type CashList = {
  title: string;
  list: Record<string, any>;
};

const CashList = ({ title, list }: CashList) => {
  return (
    <div className="cash-reserve">
      <h3>{title}</h3>
      <ul className="cash-reserve-list">
        {Object.keys(list).map((key) => (
          <li key={`cash_reserve_${key}`}>
            <p>{key}원</p>
            <p>{list[key]}개</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CashList;
