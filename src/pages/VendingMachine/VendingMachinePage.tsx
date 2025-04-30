import { useState } from "react";
import "./VendingMachinePage.scss";
import PaymentCash from "../../components/PaymentCash/PaymentCash";
import PaymentCard from "../../components/PaymentCard/PaymentCard";
import {
  initCashReserve,
  initProducts,
  msgByStep,
  initInsertedCash,
  initPurchasedProducts,
  payment,
} from "../../constants";
import { productsType } from "../../types/VendingMachineType";

const VendingMachinePage = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [noticeMsg, setNoticeMsg] = useState<string>(msgByStep[currentStep]);

  const [insertedCash, setInsertedCash] = useState(initInsertedCash);
  const [cashReserve, setCashReserve] = useState(initCashReserve);
  const [productsInfo, setProductsInfo] = useState(initProducts);
  const [purchasedProducts, setPurchasedProducts] = useState(
    initPurchasedProducts
  );

  // 결제수단 선택 단계로 리셋
  const onCancel = () => {
    setSelectedPayment("");
    setInsertedCash(initInsertedCash);
    setProcessStep(0);
  };

  // 프로세스 단계 및 메시지 변경
  const setProcessStep = (number: number) => {
    setCurrentStep(number);
    setNoticeMsg(msgByStep[number]);
  };

  // 결제 완료 후 재고 수량 및 결제된 상품 목록 변경
  const handleCompletePayment = (
    product: productsType,
    callback?: () => void
  ) => {
    setProcessStep(2);
    setTimeout(() => {
      setProcessStep(3);
      callback?.();

      // 재고 수량 변경
      setProductsInfo(
        productsInfo.map((v) =>
          v.id === product.id
            ? Object.assign({}, v, { quantity: v.quantity - 1 })
            : v
        )
      );
      // 결제된 상품 목록 변경
      setPurchasedProducts(
        Object.assign({}, purchasedProducts, {
          [product.name]: purchasedProducts[product.name] + 1,
        })
      );
    }, 1000);
  };

  // 카드로 결제 시 동작
  const handlePaymentCard = (product: productsType) => {
    const isSuccess = Math.random() < 0.9; // 10% 확률로 오류발생
    if (!isSuccess) {
      alert("카드 결제 오류 입니다. 다시 시도해주세요.");
      return;
    }

    handleCompletePayment(product);
  };

  // 현금으로 결제 시 동작
  const handlePaymentCash = (product: productsType) => {
    const { total, count } = insertedCash;

    // 가장 싼 제품의 가격보다 잔액이 부족한 경우
    const minPrice = productsInfo
      .map(({ price }) => price)
      .sort((a, b) => a - b)[0];
    if (total < minPrice) {
      alert("잔액이 부족합니다.");
      setNoticeMsg("잔액이 부족합니다.");
      return;
    }

    // 선택한 제품의 가격보다 잔액이 부족한 경우
    if (total < product.price) {
      alert("잔액이 부족합니다.");
      setProcessStep(1);
      return;
    }

    // 총 금액 차감
    const callback = () =>
      setInsertedCash({ total: total - product.price, count });

    handleCompletePayment(product, callback);
  };

  // 선택한 결제 수단별 함수 호출
  const handleTypeOfPayment = (product: productsType) => {
    switch (selectedPayment) {
      case "card":
        handlePaymentCard(product);
        break;
      case "cash":
        handlePaymentCash(product);
        break;
    }
  };

  return (
    <div className="container">
      <div className="machine">
        <div className="machine-products">
          {/* 제품 샘플 */}
          <ul className="products-sample">
            {productsInfo.map((v) => (
              <li
                key={`products_${v.name}_${v.id}`}
                style={{
                  background: v.color,
                }}
              >
                <p>{v.name}</p>
                <p>{v.quantity}개</p>
                <p style={{ background: "#fff", color: v.color }}>
                  {v.price}원
                </p>
              </li>
            ))}
          </ul>
          {/* 제품 선택 버튼 */}
          <ul className="products-button-list">
            {productsInfo.map((v) =>
              v.quantity > 0 && (currentStep === 1 || currentStep === 3) ? (
                <li
                  key={`machine_btn_${v.name}_${v.id}`}
                  className="active"
                  onClick={() => {
                    handleTypeOfPayment(v);
                  }}
                >
                  SELECT
                </li>
              ) : (
                <li key={`machine_btn_${v.name}_${v.id}`} className={`item`}>
                  {v.quantity > 0 ? "" : "X"}
                </li>
              )
            )}
          </ul>
        </div>
        {/* 안내 메시지 */}
        <div className="notice">{noticeMsg}</div>
        {/* 결제수단 선택 버튼 */}
        {selectedPayment === "" && (
          <div className="payment-type">
            {payment.map((v) => (
              <div
                key={`payment_${v.id}`}
                className="item"
                onClick={() => setSelectedPayment(v.id)}
              >
                {v.name}
              </div>
            ))}
          </div>
        )}
        {/* 결제수단 - 카드 */}
        {selectedPayment === "card" && (
          <PaymentCard
            currentStep={currentStep}
            setProcessStep={setProcessStep}
            onCancel={onCancel}
          />
        )}
        {/* 결제수단 - 현금 */}
        {selectedPayment === "cash" && (
          <PaymentCash
            insertedCash={insertedCash}
            cashReserve={cashReserve}
            currentStep={currentStep}
            setCashReserve={setCashReserve}
            setInsertedCash={setInsertedCash}
            setProcessStep={setProcessStep}
            onCancel={onCancel}
          />
        )}
        {/* 결제한 제품 출력 부분 */}
        <div className="dispenser">
          <ul className="purchased-products">
            {productsInfo.map(({ name, color }) =>
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
      </div>
      {/* 현금 보유 현황 */}
      <div className="cash-reserve">
        <h3>현금 보유 현황</h3>
        <ul className="cash-reserve-list">
          {Object.keys(cashReserve).map((key) => (
            <li key={`rest_cash_${key}`}>
              <p>{key}원</p>
              <p>{cashReserve[key]}개</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VendingMachinePage;
