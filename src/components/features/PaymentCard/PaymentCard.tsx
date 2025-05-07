import { useState } from "react";
import "./PaymentCard.scss";
import ButtonBox from "@/components/common/ButtonBox";
import { useStep } from "@/stores/useStep";

type PaymentCardProp = {
  onCancel: () => void;
};

const PaymentCard = ({ onCancel }: PaymentCardProp) => {
  const { step, setStatus } = useStep();
  const [statusMsg, setStatusMsg] = useState<string>("대기중...");

  // 카드 넣기 버튼 클릭 후 동작
  const handleInputCard = () => {
    const isSuccess = Math.random() < 0.9; // 10% 확률로 오류발생
    if (!isSuccess) {
      alert("카드 오류 입니다. 다시 시도해주세요.");
      setStatusMsg("카드 오류");
      return;
    }

    setStatusMsg("카드 확인 완료");
    setStatus(1); // 제품선택 단계로 변경
  };

  return (
    <div className="payment-card">
      <h2>{statusMsg}</h2>
      {step === 0 && (
        <>
          <p>카드를 넣어주세요.</p>
          <ButtonBox
            id="payment_card_1"
            buttons={[
              { title: "카드 넣기", onClick: handleInputCard },
              { title: "취소", onClick: onCancel },
            ]}
          />
        </>
      )}
      {step === 1 && (
        <ButtonBox
          id="payment_card_2"
          buttons={[{ title: "카드 빼기", onClick: onCancel }]}
        />
      )}
    </div>
  );
};

export default PaymentCard;
