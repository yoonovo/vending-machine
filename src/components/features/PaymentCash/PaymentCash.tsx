import { insertComma } from "@/utils/number";
import { reserveCashType } from "@/types/VendingMachineType";
import "./PaymentCash.scss";
import { useState } from "react";
import ButtonBox from "@/components/common/ButtonBox";
import { useStep } from "@/stores/useStep";
import { useCash } from "@/stores/useCash";
import { initInsertedCash } from "@/constants/cash";

type PaymentCashProp = {
  onReset: () => void;
};

const PaymentCash = ({ onReset }: PaymentCashProp) => {
  const { step, setStatus } = useStep();
  const {
    reserveCash,
    insertedCash,
    totalInsertedCash,
    setReserveCash,
    setInsertedCash,
    resetInsertedCash,
  } = useCash();

  const [showInquiryBtn, setShowInquiryBtn] = useState<boolean>(false);

  // 현금 투입 시 동작
  const handleInsertedCash = (value: number) => {
    if (totalInsertedCash + value > 50000) {
      alert("5만원 이상은 투입이 불가능 합니다.");
      return;
    }

    setInsertedCash({
      ...insertedCash,
      ...{
        [value]: insertedCash[value] + 1,
      },
    });
  };

  // 현금 투입 완료 시 동작
  const handleComplete = () => {
    if (totalInsertedCash === 0) {
      alert("투입된 금액이 없습니다.");
      return;
    }

    // 자판기에 투입된 현금 추가
    setReserveCash(
      Object.keys(reserveCash).reduce((t: reserveCashType, key) => {
        t[key] = reserveCash[key] + insertedCash[key];
        return t;
      }, {})
    );

    setStatus(1); // 제품선택 단계로 변경
  };

  // 거스름돈 반환 버튼 클릭 시
  const handleCalculateCash = () => {
    const returnCash = { ...initInsertedCash };
    let total = totalInsertedCash;
    let cash = { ...reserveCash };

    // 큰 금액부터 거스름돈 계산
    Object.keys(cash)
      .map(Number)
      .sort((a, b) => b - a)
      .forEach((value) => {
        while (total >= value && cash[value] > 0) {
          returnCash[value]++;
          total -= value;

          cash = {
            ...cash,
            [value]: cash[value] - 1,
          };
        }
      });

    if (total > 0) {
      alert("거스름돈이 부족합니다. 관리자에게 문의해주세요.");
      setShowInquiryBtn(true);
      return;
    }

    setReserveCash(cash);
    onReset();
  };

  // 문의하기 버튼 클릭 시, 자판기 보유 현금 개수가 각각 +10 증가
  const handleInquiry = () => {
    alert("자판기 내 현금이 보충되었습니다. 감사합니다.");
    setShowInquiryBtn(false);
    setReserveCash(
      Object.keys(reserveCash).reduce((t: reserveCashType, key) => {
        t[key] = reserveCash[key] + 10;
        return t;
      }, {})
    );
  };

  return (
    <div className="payment-cash">
      <h2>총 금액 : {insertComma(totalInsertedCash)}원</h2>
      {step === 0 ? (
        <>
          <p>현금을 투입해주세요.</p>
          <ul className="cash-type-list">
            {Object.keys(reserveCash).map((v) => (
              <li
                key={`cash_${v}`}
                onClick={() => handleInsertedCash(Number(v))}
              >
                {insertComma(v)}원 ({insertedCash[v]})
              </li>
            ))}
          </ul>
          <ButtonBox
            id="payment_cash_1"
            buttons={[
              { title: "완료", onClick: handleComplete },
              { title: "반환", onClick: resetInsertedCash },
              { title: "취소", onClick: onReset },
            ]}
          />
        </>
      ) : (
        <ButtonBox
          id="payment_cash_2"
          buttons={[
            { title: "거스름돈 반환", onClick: handleCalculateCash },
            {
              title: "문의하기",
              onClick: handleInquiry,
              isVisible: showInquiryBtn,
              isHighlight: true,
            },
          ]}
        />
      )}
    </div>
  );
};

export default PaymentCash;
