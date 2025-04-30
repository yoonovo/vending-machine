import { insertComma } from "@/utils/number";
import { cashReserveType, insertedCashType } from "@/types/VendingMachineType";
import "./PaymentCash.scss";
import { initInsertedCash } from "@/constants";
import { useState } from "react";

type PaymentCashProp = {
  currentStep: number;
  insertedCash: insertedCashType;
  cashReserve: cashReserveType;
  setInsertedCash: (v: insertedCashType) => void;
  setProcessStep: (v: number) => void;
  setCashReserve: React.Dispatch<React.SetStateAction<cashReserveType>>; // 동일함 (v: (v: cashReserveType) => void) => void;
  onCancel: () => void;
};

const PaymentCash = ({
  currentStep,
  insertedCash,
  cashReserve,
  setInsertedCash,
  setProcessStep,
  setCashReserve,
  onCancel,
}: PaymentCashProp) => {
  const [showInquiryBtn, setShowInquiryBtn] = useState<boolean>(false);

  // 현금 투입시 동작
  const handleInsertedCash = (value: number) => {
    const { total: tot, count: cnt } = insertedCash;

    if (tot + value > 50000) {
      alert("5만원 이상은 투입이 불가능 합니다.");
      return;
    }

    const count = Object.assign({}, cnt, { [value]: cnt[value] + 1 });
    const total = Object.keys(count).reduce((t, v) => {
      const key = Number(v);
      t += key * count[key];
      return t;
    }, 0);

    setInsertedCash({ total, count });
  };

  const handleNextStep = () => {
    const { total: tot, count: cnt } = insertedCash;

    if (tot === 0) {
      alert("투입된 금액이 없습니다.");
      return;
    }

    // 자판기에 투입된 현금 추가
    setCashReserve((pre) =>
      Object.keys(pre).reduce((t: cashReserveType, key) => {
        t[key] = pre[key] + cnt[key];
        return t;
      }, {})
    );

    setProcessStep(1); // 제품선택 단계로 변경
  };

  // 투입한 현금 반환
  const handleReturnCash = () => {
    setInsertedCash(initInsertedCash);
  };

  // 거스름돈 반환 버튼 클릭 시
  const handleCalculateCash = () => {
    const returnCash = { ...initInsertedCash.count };
    let total = insertedCash.total;
    let reserveCash = { ...cashReserve };

    // 큰 금액부터 거스름돈 계산
    Object.keys(reserveCash)
      .map(Number)
      .sort((a, b) => b - a)
      .forEach((value) => {
        while (total >= value && reserveCash[value] > 0) {
          returnCash[value]++;
          total -= value;

          reserveCash = {
            ...reserveCash,
            [value]: reserveCash[value] - 1,
          };
        }
      });

    if (total > 0) {
      alert("거스름돈이 부족합니다. 관리자에게 문의해주세요.");
      setShowInquiryBtn(true);
      return;
    }

    setCashReserve(reserveCash);
    setInsertedCash(initInsertedCash);
    onCancel();
  };

  // 문의하기 버튼 클릭 시, 자판기 보유 현금 개수가 각각 +10 증가
  const handleInquiry = () => {
    alert("자판기 내 현금이 보충되었습니다. 감사합니다.");
    setShowInquiryBtn(false);
    setCashReserve((pre) =>
      Object.keys(pre).reduce((t: cashReserveType, key) => {
        t[key] = pre[key] + 10;
        return t;
      }, {})
    );
  };

  return (
    <div className="payment-cash">
      <h2>총 금액 : {insertComma(insertedCash.total)}원</h2>
      {currentStep === 0 ? (
        <>
          <p>현금을 투입해주세요.</p>
          <ul className="cash-type-list">
            {Object.keys(cashReserve).map((v) => (
              <li
                key={`cash_${v}`}
                onClick={() => handleInsertedCash(Number(v))}
              >
                {insertComma(v)}원 ({insertedCash.count[v]})
              </li>
            ))}
          </ul>
          <div className="button-box">
            <button className="button" onClick={handleNextStep}>
              완료
            </button>
            <button className="button" onClick={handleReturnCash}>
              반환
            </button>
            <button className="button" onClick={onCancel}>
              취소
            </button>
          </div>
        </>
      ) : (
        <div className="button-box">
          <button className="button" onClick={handleCalculateCash}>
            거스름돈 반환
          </button>
          {showInquiryBtn && (
            <button
              className="button"
              style={{ background: "black", color: "white" }}
              onClick={handleInquiry}
            >
              문의하기
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentCash;
